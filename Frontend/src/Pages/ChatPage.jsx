import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { StreamChat } from "stream-chat";
import { ArrowLeft, Plus, Send, Paperclip, X } from "lucide-react";
import {
  Channel,
  Chat,
  MessageList,
  Thread,
  Window,
  useChannelStateContext,
  useChatContext,
} from "stream-chat-react";

import ChatLoader from "../Components/Common/ChatLoader";
import CallButton from "../Components/Common/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5003";

const authFetch = async (path) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${backendUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: "include",
  });

  if (!res.ok) {
    let message = "";
    try {
      message = (await res.json()).message || "";
    } catch {
      /* response had no JSON body */
    }
    throw new Error(`Request failed: ${path} (${res.status}) ${message}`.trim());
  }
  return res.json();
};

/* Custom Header Component: Avatar & Name on Left, Status in Middle, Call Button on Right */
function CustomChatHeader({ handleVideoCall }) {
  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  const members = channel?.state?.members || {};
  const currentUserId = String(client?.userID);

  // Find the target user in the DM channel
  const otherMember = Object.values(members).find(
    (m) => String(m.user?.id) !== currentUserId
  );

  const user = otherMember?.user || {};
  const displayName = user.fullname || user.fullName || user.name || user.username || user.id || "Chat";
  const avatarUrl = user.image || user.profilePic || user.avatar;
  const isOnline = Boolean(user.online);

  return (
    <div className="chat-topbar flex items-center justify-between px-3 py-2.5 sm:px-5 bg-base-200 border-b-2 border-base-content/20 shrink-0 min-h-[64px] z-20 gap-3 shadow-xs">
      {/* Left Section: Back Button + Avatar + Name */}
      <div className="flex items-center gap-2.5 shrink-0 min-w-0">
        <Link
          to="/"
          className="btn btn-ghost btn-circle btn-sm text-base-content hover:bg-base-300 transition-all shrink-0 border border-base-content/15"
          title="Back to home"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-base-content/20 shadow-xs"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base shadow-xs ring-2 ring-primary/30">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-base-200 ${
                isOnline ? "bg-success" : "bg-base-content/40"
              }`}
            />
          </div>

          <h2 className="font-semibold text-sm sm:text-base text-base-content leading-tight truncate max-w-[130px] sm:max-w-[220px]">
            {displayName}
          </h2>
        </div>
      </div>

      {/* Middle Section: ONLY Online / Offline Status Badge */}
      <div className="flex items-center justify-center flex-1 min-w-0 px-2">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border-2 transition-colors ${
            isOnline
              ? "bg-success/15 text-success border-success/40"
              : "bg-base-300/60 text-base-content/80 border-base-content/25"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isOnline ? "bg-success animate-pulse" : "bg-base-content/50"
            }`}
          />
          <span className="capitalize">{isOnline ? "Online" : "Offline"}</span>
        </div>
      </div>

      {/* Right Section: Video Call Button */}
      <div className="flex items-center shrink-0">
        <CallButton handleVideoCall={handleVideoCall} />
      </div>
    </div>
  );
}

/* Custom Input Component: Plus Button on Left, Rounded Pill Input in Middle, Paper Plane Send on Right */
function CustomMessageInput() {
  const { channel } = useChannelStateContext();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSend = async (e) => {
    e?.preventDefault();
    if ((!text.trim() && !file) || uploading) return;

    try {
      setUploading(true);
      let attachments = [];

      if (file) {
        const response = await channel.sendFile(file);
        attachments.push({
          type: file.type.startsWith("image/") ? "image" : "file",
          asset_url: response.file,
          title: file.name,
          file_size: file.size,
          mime_type: file.type,
        });
      }

      const messageText = text.trim();
      setText("");
      setFile(null);

      await channel.sendMessage({
        text: messageText,
        attachments: attachments.length ? attachments : undefined,
      });
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message.");
    } finally {
      setUploading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const triggerFileSelect = () => {
    document.getElementById("chat-file-input")?.click();
  };

  return (
    <div className="chat-custom-input-bar w-full px-3 py-3 sm:px-4 bg-base-100 border-t border-base-content/20 flex flex-col gap-2 shrink-0 z-10">
      {/* Attachment Preview if selected */}
      {file && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-base-200 border border-base-300 rounded-lg text-xs w-fit max-w-full">
          <Paperclip className="w-3.5 h-3.5 shrink-0 text-primary" />
          <span className="truncate max-w-[200px]">{file.name}</span>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="btn btn-ghost btn-circle btn-xs text-base-content/70 hover:text-error"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-center gap-2.5 sm:gap-3 w-full">
        <input
          id="chat-file-input"
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) setFile(e.target.files[0]);
          }}
        />

        {/* Left: Standalone (+) Attachment Button */}
        <button
          type="button"
          onClick={triggerFileSelect}
          className="w-10 h-10 rounded-full border border-base-content/25 flex items-center justify-center bg-base-100 hover:bg-base-200 transition-all text-base-content shrink-0 shadow-xs active:scale-95"
          title="Add attachment"
          aria-label="Add attachment"
        >
          <Plus className="w-5 h-5 text-base-content/80" />
        </button>

        {/* Center: Long Capsule Input Pill */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message"
            className="w-full h-11 px-5 py-2 rounded-full border border-base-content/25 bg-base-100 text-base-content placeholder:text-base-content/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm sm:text-base shadow-xs"
          />
        </div>

        {/* Right: Standalone Paper Plane Send Button */}
        <button
          type="submit"
          disabled={(!text.trim() && !file) || uploading}
          className={`w-10 h-10 rounded-full border border-base-content/20 flex items-center justify-center transition-all shrink-0 shadow-xs active:scale-95 ${
            text.trim() || file
              ? "bg-primary text-primary-content hover:bg-primary/90 cursor-pointer"
              : "bg-base-200 text-base-content/40 cursor-not-allowed"
          }`}
          title="Send message"
          aria-label="Send message"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>
    </div>
  );
}

export default function ChatPage() {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!targetUserId || !STREAM_API_KEY) {
      setError(true);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const initChat = async () => {
      setLoading(true);
      setError(false);

      try {
        const [tokenData, meData] = await Promise.all([
          authFetch("/api/chat/token"),
          authFetch("/api/auth/me"),
        ]);
        if (cancelled) return;

        await authFetch(`/api/chat/sync-user/${targetUserId}`);
        if (cancelled) return;

        const authUser = meData.user || meData.data || meData;
        const streamToken =
          tokenData.token || tokenData.streamToken || tokenData.data?.token;
        const myId = String(authUser._id || authUser.id);

        const client = StreamChat.getInstance(STREAM_API_KEY);

        if (client.userID !== myId) {
          if (client.userID) await client.disconnectUser();
          await client.connectUser(
            {
              id: myId,
              name: authUser.fullName || authUser.username || "User",
              image: authUser.profilePic || authUser.avatar || undefined,
            },
            streamToken
          );
        }
        if (cancelled) return;

        const channelId = [myId, String(targetUserId)].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [myId, String(targetUserId)],
        });

        await currChannel.watch();
        if (cancelled) return;

        setChatClient(client);
        setChannel(currChannel);
      } catch (err) {
        console.error("Error initializing chat:", err);
        if (!cancelled) {
          setError(true);
          toast.error("Could not connect to chat. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initChat();

    return () => {
      cancelled = true;
    };
  }, [targetUserId]);

  useEffect(() => {
    return () => {
      const client = StreamChat.getInstance(STREAM_API_KEY);
      client.disconnectUser?.();
    };
  }, []);

  const handleVideoCall = async () => {
    if (!channel) return;
    try {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      await channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
      toast.success("Video call link sent successfully!");
    } catch (err) {
      console.error("Error sending call link:", err);
      toast.error("Could not send the call link.");
    }
  };

  if (error) {
    return (
      <div className="h-[93vh] flex items-center justify-center">
        <p>Unable to load the chat. Please refresh and try again.</p>
      </div>
    );
  }

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="chat-page-container w-full h-[100dvh] max-h-[100dvh] flex flex-col bg-base-100 text-base-content overflow-hidden p-0 sm:p-2">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="chat-main-wrapper flex flex-col flex-1 h-full w-full overflow-hidden border border-base-content/20 sm:rounded-2xl shadow-sm">
            {/* Custom Centered Top Navigation Bar */}
            <CustomChatHeader handleVideoCall={handleVideoCall} />

            {/* Main Window with Message List & Custom Input Bar matching user screenshot */}
            <div className="chat-window-container flex flex-1 h-full overflow-hidden relative">
              <Window>
                <MessageList />
                <CustomMessageInput />
              </Window>
              <Thread />
            </div>
          </div>
        </Channel>
      </Chat>
    </div>
  );
}