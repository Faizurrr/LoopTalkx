import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5003";

const ChatNotificationContext = createContext({
  chatNotifications: {},
  setChatNotifications: () => {},
  totalUnreadCount: 0,
  streamClient: null,
  myUserId: null,
  markChannelRead: () => {},
  lastIncomingMessage: null,
});


const authFetch = async (path, signal) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${backendUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: "include",
    signal,
  });
  if (!res.ok) {
    let message = "";
    try {
      message = (await res.json()).message || "";
    } catch {
      /* no JSON body */
    }
    throw new Error(
      `Request failed: ${path} (${res.status}) ${message}`.trim()
    );
  }
  return res.json();
};


export function ChatNotificationProvider({ children, enabled }) {
  const [chatNotifications, setChatNotifications] = useState({});
  const [myUserId, setMyUserId] = useState(null);
  const [client, setClient] = useState(null);
  const [lastIncomingMessage, setLastIncomingMessage] = useState(null);
  const listenersRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!enabled || !STREAM_API_KEY) {
      setChatNotifications({});
      setMyUserId(null);
      setClient(null);
      setLastIncomingMessage(null);
      try {
        const chatClient = StreamChat.getInstance(STREAM_API_KEY);
        if (chatClient.userID) chatClient.disconnectUser();
      } catch {
        
      }
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const init = async () => {
      try {
        /* 1. Fetch Stream token + current user in parallel */
        const [tokenData, meData] = await Promise.all([
          authFetch("/api/chat/token", controller.signal),
          authFetch("/api/auth/me", controller.signal),
        ]);
        if (!isMounted) return;

        const authUser = meData.user || meData.data || meData;
        const streamToken =
          tokenData.token || tokenData.streamToken || tokenData.data?.token;
        const myId = String(authUser._id || authUser.id);

        /* 2. Connect (or reuse) the singleton Stream client */
        const chatClient = StreamChat.getInstance(STREAM_API_KEY);

        if (chatClient.userID && chatClient.userID !== myId) {
          await chatClient.disconnectUser();
        }

        if (!chatClient.userID) {
          await chatClient.connectUser(
            {
              id: myId,
              name:
                
                authUser.fullname ||
                authUser.username ||
                "User",
              image: authUser.avatar || undefined,
            },
            streamToken
          );
        }
        if (!isMounted) return;

        setMyUserId(myId);
        setClient(chatClient);

        
        const filter = { type: "messaging", members: { $in: [myId] } };
        const sort = [{ last_message_at: -1 }];
        const channels = await chatClient.queryChannels(filter, sort, {
          watch: true,
          state: true,
          presence: true,
        });
        if (!isMounted) return;

        const notifMap = {};
        channels.forEach((channel) => {
          const memberIds = Object.keys(channel.state?.members || {});
          const otherMemberId = memberIds.find(
            (id) => String(id) !== myId
          );
          if (!otherMemberId) return;

          const otherMember = channel.state?.members[otherMemberId];
          const unreadCount = channel.countUnread
            ? channel.countUnread()
            : channel.state?.unreadCount || 0;

          const messages = channel.state?.messages || [];
          const lastMsg =
            messages.length > 0
              ? messages[messages.length - 1]
              : channel.state?.last_message;

          let lastText = "";
          if (lastMsg) {
            if (lastMsg.text) {
              lastText = lastMsg.text;
            } else if (lastMsg.attachments?.length > 0) {
              lastText =
                lastMsg.attachments[0].type === "image"
                  ? "📷 Image"
                  : "📎 Attachment";
            }
          }

          notifMap[otherMemberId] = {
            channelId: channel.id,
            unreadCount,
            lastMessageText: lastText,
            lastMessageTime:
              lastMsg?.created_at || channel.state?.last_message_at,
            isOnline: Boolean(otherMember?.user?.online),
          };
        });

        setChatNotifications(notifMap);

        /* ── 4. Real-time WebSocket event handlers ───────── */
        const handleNewMessage = (event) => {
          const senderId = String(event.message?.user?.id);
          if (senderId === myId) return;

          const messageText = event.message?.text || "Sent an attachment";
          const senderName =
            event.message?.user?.name ||
            event.message?.user?.username ||
            "A friend";

          // Update real-time chat notifications state
          setChatNotifications((prev) => {
            const prevEntry = prev[senderId] || { unreadCount: 0 };
            return {
              ...prev,
              [senderId]: {
                ...prevEntry,
                channelId: event.channel_id || prevEntry.channelId,
                unreadCount: (prevEntry.unreadCount || 0) + 1,
                lastMessageText: messageText,
                lastMessageTime:
                  event.message?.created_at || new Date().toISOString(),
              },
            };
          });

          setLastIncomingMessage({
            id: event.message?.id,
            senderId,
            senderName,
            text: messageText,
            timestamp: Date.now(),
          });

          // Show interactive real-time toast if user isn't currently chatting with sender
          if (!window.location.pathname.endsWith(`/chat/${senderId}`)) {
            const preview =
              messageText.length > 60
                ? messageText.slice(0, 57) + "..."
                : messageText;

            toast(
              (t) => (
                <div
                  onClick={() => {
                    toast.dismiss(t.id);
                    navigate(`/chat/${senderId}`);
                  }}
                  className="cursor-pointer flex flex-col gap-0.5 select-none"
                >
                  <div className="font-semibold text-xs sm:text-sm text-base-content flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span>New message from {senderName}</span>
                  </div>
                  <p className="text-xs text-base-content/70 truncate max-w-[240px]">
                    {preview}
                  </p>
                </div>
              ),
              {
                id: `chat-${event.message?.id || Date.now()}`,
                duration: 4500,
                icon: "💬",
              }
            );
          }
        };

        const handleMessageRead = (event) => {
          const channelId = event.channel_id || event.channel?.id;
          setChatNotifications((prev) => {
            const next = { ...prev };
            let changed = false;
            for (const [friendId, data] of Object.entries(next)) {
              if (data.channelId === channelId && data.unreadCount > 0) {
                next[friendId] = { ...data, unreadCount: 0 };
                changed = true;
              }
            }
            return changed ? next : prev;
          });
        };

        const handlePresenceChange = (event) => {
          if (!event.user?.id) return;
          const userId = String(event.user.id);
          setChatNotifications((prev) => {
            if (!prev[userId]) return prev;
            return {
              ...prev,
              [userId]: {
                ...prev[userId],
                isOnline: Boolean(event.user.online),
              },
            };
          });
        };

        chatClient.on("message.new", handleNewMessage);
        chatClient.on("notification.message_new", handleNewMessage);
        chatClient.on("message.read", handleMessageRead);
        chatClient.on("notification.mark_read", handleMessageRead);
        chatClient.on("user.presence.changed", handlePresenceChange);

        listenersRef.current = () => {
          chatClient.off("message.new", handleNewMessage);
          chatClient.off("notification.message_new", handleNewMessage);
          chatClient.off("message.read", handleMessageRead);
          chatClient.off("notification.mark_read", handleMessageRead);
          chatClient.off("user.presence.changed", handlePresenceChange);
        };
      } catch (err) {
        if (err.name === "AbortError") return;
        console.warn("Stream Chat notification init error:", err);
      }
    };

    init();

    return () => {
      isMounted = false;
      controller.abort();
      if (listenersRef.current) {
        listenersRef.current();
        listenersRef.current = null;
      }
    };
  }, [enabled, navigate]);

  /* ── derived state ── */
  const totalUnreadCount = useMemo(
    () =>
      Object.values(chatNotifications).reduce(
        (sum, item) => sum + (item.unreadCount || 0),
        0
      ),
    [chatNotifications]
  );

  const markChannelRead = useCallback((friendId) => {
    setChatNotifications((prev) => {
      if (!prev[friendId] || prev[friendId].unreadCount === 0) return prev;
      return {
        ...prev,
        [friendId]: { ...prev[friendId], unreadCount: 0 },
      };
    });
  }, []);

  return (
    <ChatNotificationContext.Provider
      value={{
        chatNotifications,
        setChatNotifications,
        totalUnreadCount,
        streamClient: client,
        myUserId,
        markChannelRead,
        lastIncomingMessage,
      }}
    >
      {children}
    </ChatNotificationContext.Provider>
  );
}

export const useChatNotifications = () => useContext(ChatNotificationContext);
