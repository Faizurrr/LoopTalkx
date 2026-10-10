import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SideBar from "../Components/Common/SideBar";

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
  if (!language) return "🌐";
  return LANGUAGE_FLAGS[language.toLowerCase()] || "🌐";
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

  useEffect(() => {
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
        setFriends(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter(
      (f) =>
        f.fullname?.toLowerCase().includes(q) ||
        f.username?.toLowerCase().includes(q)
    );
  }, [friends, query]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-base-100 text-base-content">
      <SideBar />

      <div className="flex-1 flex justify-center pb-20 md:pb-8">
        <div className="w-full max-w-xl border-x-0 md:border-x border-base-300 min-h-screen flex flex-col">
          {/* Header */}
          <div className="px-4 pt-6 pb-3 sticky top-0 bg-base-100 z-10">
            <h1 className="text-2xl font-bold mb-4">Friends</h1>
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

          {!loading && !error && friends.length > 0 && filtered.length === 0 && (
            <p className="text-base-content/60 text-sm px-4 py-6">
              No friends match "{query}".
            </p>
          )}

          {/* Chat-style list */}
          <ul>
            {filtered.map((friend) => (
              <li key={friend._id}>
                <Link
                  to={`/chat/${friend._id}`}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-base-200 focus-visible:bg-base-200 focus-visible:outline-none transition-colors"
                >
                  <Avatar friend={friend} />

                  <div className="flex-1 min-w-0 border-b border-base-300/70 pb-3 -mb-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-semibold truncate">
                        {friend.fullname || friend.username}
                      </p>
                      {friend.fullname && friend.username && (
                        <span className="text-xs text-base-content/50 shrink-0">
                          @{friend.username}
                        </span>
                      )}
                    </div>

                  
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Friends;