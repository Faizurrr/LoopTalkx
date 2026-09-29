import { useEffect, useState } from "react";
import { useParams , useNavigate, Navigate } from "react-router";
import toast from "react-hot-toast";
import { StreamChat } from "stream-chat";
import { Link} from "react-router";
import { ArrowLeft } from "lucide-react";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageComposer,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";


import "stream-chat-react/dist/css/index.css"; //  for styling...


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

        // 2. Make sure the OTHER user exists in Stream before creating the channel
        await authFetch(`/api/chat/sync-user/${targetUserId}`);
        if (cancelled) return;

        const authUser = meData.user || meData.data || meData;
        const streamToken =
          tokenData.token || tokenData.streamToken || tokenData.data?.token;
        const myId = String(authUser._id || authUser.id);

        // 3. Connect (skip if this user is already connected, e.g. StrictMode double-run)
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

        // 4. Same channel id for both users
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

  // Disconnect only when leaving the chat page entirely
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
    <div className="h-[93vh] ">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <Link to="/" className="btn btn-ghost btn-sm gap-2">
  <ArrowLeft size={18} />

</Link>
            <CallButton handleVideoCall={handleVideoCall} />
           
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageComposer focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
}