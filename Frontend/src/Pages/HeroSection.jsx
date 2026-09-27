import React, { useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5003";

// Small helper to turn a language name into a flag emoji for the pills
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

function HeroSection() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="px-10 py-8">
      <h1 className="text-2xl font-bold mb-6 text-base-content">Your Friends</h1>

      {loading && <p className="text-base-content/70 text-sm">Loading friends…</p>}
      {!loading && error && <p className="text-error text-sm">{error}</p>}
      {!loading && !error && friends.length === 0 && (
        <p className="text-base-content/70 text-sm">
          You haven't added any friends yet.
        </p>
      )}

      <div className="flex flex-wrap gap-5">
        {friends.map((friend) => (
          <div
            key={friend._id}
            className="w-72 bg-base-200 border border-base-300 rounded-xl px-5 py-4 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={friend.avatar}
                alt={friend.username}
                className="w-11 h-11 rounded-full object-cover bg-base-300 ring-2 ring-primary/30"
              />
              <p className="font-semibold text-base-content">{friend.username}</p>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              <span className="text-xs bg-base-300 text-base-content/80 border border-base-300 px-2.5 py-1 rounded-full">
                {getFlag(friend.NativeLanguage)} Native: {friend.NativeLanguage}
              </span>
              <span className="text-xs bg-base-300 text-base-content/80 border border-base-300 px-2.5 py-1 rounded-full">
                {getFlag(friend.LearningLanguage)} Learning:{" "}
                {friend.LearningLanguage}
              </span>
            </div>

            <button className="w-full btn btn-primary btn-sm font-medium rounded-lg transition-colors">
              Message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HeroSection;