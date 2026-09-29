import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  StreamTheme,
  SpeakerLayout,
  CallControls,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import ChatLoader from "../Components/Common/ChatLoader";

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
  if (!res.ok) throw new Error(`Request failed: ${path} (${res.status})`);
  return res.json();
};

export default function CallPage() {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!callId || !STREAM_API_KEY) {
      setError(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    let videoClient;
    let videoCall;

    const initCall = async () => {
      try {
        const [tokenData, meData] = await Promise.all([
          authFetch("/api/chat/token"),
          authFetch("/api/auth/me"),
        ]);
        if (cancelled) return;

        const authUser = meData.user || meData.data || meData;
        const streamToken =
          tokenData.token || tokenData.streamToken || tokenData.data?.token;

        videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: {
            id: String(authUser._id || authUser.id),
            name: authUser.fullName || authUser.username || "User",
            image: authUser.profilePic || authUser.avatar || undefined,
          },
          token: streamToken,
        });

        videoCall = videoClient.call("default", callId);
        await videoCall.join({ create: true });
        if (cancelled) return;

        setClient(videoClient);
        setCall(videoCall);
      } catch (err) {
        console.error("Error joining call:", err);
        if (!cancelled) {
          setError(true);
          toast.error("Could not join the call.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initCall();

    return () => {
      cancelled = true;
      videoCall?.leave().catch(() => {});
      videoClient?.disconnectUser().catch(() => {});
    };
  }, [callId]);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Could not join the call. Please refresh and try again.</p>
      </div>
    );
  }

  if (loading || !client || !call) return <ChatLoader />;

  return (
    <div className="h-screen w-full flex items-center justify-center bg-base-200">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <CallContent />
        </StreamCall>
      </StreamVideo>
    </div>
  );
}

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  // When the user hits "Leave", go back to the app
  useEffect(() => {
    if (callingState === CallingState.LEFT) navigate("/");
  }, [callingState, navigate]);

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};