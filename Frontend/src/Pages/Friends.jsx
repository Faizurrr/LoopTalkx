import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SideBar from "../Components/Common/SideBar";
import { useChatNotifications } from "../context/ChatNotificationContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5003";

const LANGUAGE_FLAGS = {
  english: "🇬🇧",
  spanish: "🇪🇸",
  french: "🇫🇷",
  german: "🇩🇪",
  hindi: "🇮🇳",
  urdu: "🇵🇰",
  arabic: "🇸🇦",
  japanese: "🇯🇵",
  korean: "🇰🇷",
  mandarin: "🇨🇳",
  chinese: "🇨🇳",
  russian: "🇷🇺",
  portuguese: "🇵🇹",
  italian: "🇮🇹",
};

const getFlag = (language) => {
  if (!language) return null;
  return LANGUAGE_FLAGS[language.toLowerCase()] || null;
};

// Formats timestamp matching push/chat timestamp UX
const formatTime = (timestamp) => {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return null;

  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHours < 24 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    yesterday.getDate() === date.getDate() &&
    yesterday.getMonth() === date.getMonth() &&
    yesterday.getFullYear() === date.getFullYear()
  ) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

// Truncates text matching Stream Push Template: {{ truncate message.text ... }}
const truncate = (text, maxLength = 60) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
};

const Avatar = ({ friend }) => {
  const name = friend.fullname || friend.username || "?";
  if (friend.avatar) {
    return (
      <img
        src={friend.avatar}
        alt={name}
        className="w-14 h-14 rounded-full object-cover bg-base-300 shrink-0"
      />
    );
  }
  return (
    <div className="w-14 h-14 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xl font-semibold shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

const SkeletonRow = () => (
  <div className="flex items-center gap-4 px-4 py-3 animate-pulse">
    <div className="w-14 h-14 rounded-full bg-base-300 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 w-1/3 rounded bg-base-300" />
      <div className="h-3 w-2/3 rounded bg-base-300" />
    </div>
  </div>
);

function Friends() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const { chatNotifications, totalUnreadCount, markChannelRead } =
    useChatNotifications();

  // 1. Fetch Friends List
  useEffect(() => {
    let isMounted = true;
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${backendUrl}/api/friendslist/friends`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Couldn't load your friends list");
        }

        const data = await response.json();
        if (isMounted) {
          setFriends(data.data || []);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFriends();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter and sort: Unread messages & recent chats float to top
  const filteredAndSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = friends;
    if (q) {
      list = list.filter(
        (f) =>
          f.fullname?.toLowerCase().includes(q) ||
          f.username?.toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      const notifA = chatNotifications[a._id];
      const notifB = chatNotifications[b._id];
      const unreadA = notifA?.unreadCount || 0;
      const unreadB = notifB?.unreadCount || 0;

      // Friends with unread messages first
      if (unreadA > 0 && unreadB === 0) return -1;
      if (unreadB > 0 && unreadA === 0) return 1;
      if (unreadA !== unreadB) return unreadB - unreadA;

      // Then by newest message timestamp
      const timeA = notifA?.lastMessageTime
        ? new Date(notifA.lastMessageTime).getTime()
        : 0;
      const timeB = notifB?.lastMessageTime
        ? new Date(notifB.lastMessageTime).getTime()
        : 0;
      return timeB - timeA;
    });
  }, [friends, query, chatNotifications]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-base-100 text-base-content">
      <SideBar />

      <div className="flex-1 flex justify-center pb-20 md:pb-8">
        <div className="w-full max-w-xl border-x-0 md:border-x border-base-300 min-h-screen flex flex-col">
          {/* Header */}
          <div className="px-4 pt-6 pb-3 sticky top-0 bg-base-100 z-10 backdrop-blur-sm bg-base-100/90">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Friends</h1>
                {totalUnreadCount > 0 && (
                  <span className="badge badge-primary badge-sm font-semibold animate-pulse">
                    {totalUnreadCount} unread
                  </span>
                )}
              </div>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search friends"
              className="input input-sm w-full bg-base-200 rounded-full px-4 h-10 focus:outline-none"
            />
          </div>

          {/* States */}
          {loading && (
            <div>
              {[...Array(6)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          )}

          {!loading && error && (
            <p className="text-error text-sm px-4 py-6">{error}</p>
          )}

          {!loading && !error && friends.length === 0 && (
            <p className="text-base-content/60 text-sm px-4 py-6">
              You haven't added any friends yet.
            </p>
          )}

          {!loading && !error && friends.length > 0 && filteredAndSorted.length === 0 && (
            <p className="text-base-content/60 text-sm px-4 py-6">
              No friends match "{query}".
            </p>
          )}

          {/* Chat-style friend list with real-time notifications */}
          <ul>
            {filteredAndSorted.map((friend) => {
              const notif = chatNotifications[friend._id];
              const unread = notif?.unreadCount || 0;
              const lastMessage = notif?.lastMessageText;
              const formattedTime = formatTime(notif?.lastMessageTime);
              const isOnline = notif?.isOnline ?? friend.isOnline;
              const nativeFlag = getFlag(friend.nativeLanguage);
              const learningFlag = getFlag(friend.learningLanguage);

              return (
                <li key={friend._id}>
                  <Link
                    to={`/chat/${friend._id}`}
                    onClick={() => markChannelRead(friend._id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 hover:bg-base-200 focus-visible:bg-base-200 focus-visible:outline-none transition-colors ${
                      unread > 0 ? "bg-base-200/50" : ""
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar friend={friend} />
                      {/* Presence online/offline indicator dot */}
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-base-100 ${
                          isOnline ? "bg-success" : "bg-base-content/30"
                        }`}
                        title={isOnline ? "Online" : "Offline"}
                      />
                    </div>

                    <div className="flex-1 min-w-0 border-b border-base-300/70 pb-3 -mb-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-center gap-1.5 truncate">
                          <p
                            className={`truncate text-sm sm:text-base ${
                              unread > 0
                                ? "font-bold text-base-content"
                                : "font-semibold text-base-content"
                            }`}
                          >
                            {friend.fullname || friend.username}
                          </p>
                          {(nativeFlag || learningFlag) && (
                            <span
                              className="text-xs shrink-0"
                              title={`Native: ${friend.nativeLanguage || ""} | Learning: ${friend.learningLanguage || ""}`}
                            >
                              {nativeFlag}
                              {learningFlag && nativeFlag !== learningFlag
                                ? ` → ${learningFlag}`
                                : ""}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {formattedTime && (
                            <span
                              className={`text-xs ${
                                unread > 0
                                  ? "text-primary font-bold"
                                  : "text-base-content/50"
                              }`}
                            >
                              {formattedTime}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p
                          className={`text-xs truncate ${
                            unread > 0
                              ? "text-base-content font-medium"
                              : lastMessage
                                ? "text-base-content/60"
                                : "text-base-content/40"
                          }`}
                        >
                          {lastMessage ? (
                            truncate(lastMessage, 55)
                          ) : friend.username ? (
                            `@${friend.username}`
                          ) : (
                            "Tap to chat"
                          )}
                        </p>

                        {/* Real-time unread message notification badge */}
                        {unread > 0 && (
                          <span className="badge badge-primary badge-sm font-bold shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center animate-pulse">
                            {unread > 99 ? "99+" : unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Friends;