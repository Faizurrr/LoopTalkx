import { createContext, useContext, useEffect, useRef, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5003";

const NotificationContext = createContext({
  friendRequests: [],
  setFriendRequests: () => {},
  loading: false,
  error: null,
  setError: () => {},
});

// Signals to fetchEventSource that we hit an unrecoverable error — stop retrying
class FatalError extends Error {}

export function NotificationProvider({ children, enabled }) {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const inFlight = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setFriendRequests([]);
      setError(null);
      setLoading(true);
      return;
    }

    let isMounted = true;
    let hasOpened = false;
    const controller = new AbortController();
    const token = localStorage.getItem("token");

    const fetchFriendRequests = async (isFirstLoad = false) => {
      if (inFlight.current) return;
      inFlight.current = true;

      try {
        const response = await fetch(`${backendUrl}/api/friendrequest/get`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Couldn't load friend requests");

        const data = await response.json();
        if (isMounted) {
          setFriendRequests(data.data || []);
          setError(null);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        if (isMounted && isFirstLoad) setError(err.message);
      } finally {
        inFlight.current = false;
        if (isMounted && isFirstLoad) setLoading(false);
      }
    };

    // 1. Initial load over normal HTTP
    fetchFriendRequests(true);

    // 2. Open the SSE stream with the Bearer token in the header
    //    (native EventSource cannot send custom headers — fetchEventSource can)
    fetchEventSource(`${backendUrl}/api/notifications/stream`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
      signal: controller.signal,
      openWhenHidden: true, // keep the stream alive when the tab is in the background

      async onopen(res) {
        // 4xx (except 429) means the token is bad — stop retrying immediately
        if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          throw new FatalError("SSE unauthorized");
        }
        // Reconnected after a drop: refetch to catch any missed events
        if (hasOpened) fetchFriendRequests();
        hasOpened = true;
      },

      onmessage(msg) {
        if (msg.event === "friend-request:new") {
          const req = JSON.parse(msg.data);
          setFriendRequests((prev) =>
            prev.some((r) => r._id === req._id) ? prev : [req, ...prev]
          );
        }
      },

      onerror(err) {
        if (err instanceof FatalError) throw err; // re-throw to stop retrying
        // anything else: fetchEventSource retries automatically — do nothing
      },
    });

    return () => {
      isMounted = false;
      controller.abort(); // closes both the HTTP fetch and the SSE stream
    };
  }, [enabled]);

  return (
    <NotificationContext.Provider
      value={{ friendRequests, setFriendRequests, loading, error, setError }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);