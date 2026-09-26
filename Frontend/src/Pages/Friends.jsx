import React, { useEffect, useState } from "react";
import SideBar from "../Components/Common/SideBar";
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

function Friends() {
    
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

      <div className="flex min-h-screen bg-[#0f0b12] text-slate-100">
          <SideBar />
    <div className="px-10   py-8">
           
      <h1 className="text-2xl font-bold text-amber-200 mb-6">Your Friends</h1>

      {loading && <p className="text-slate-400 text-sm">Loading friends…</p>}
      {!loading && error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && friends.length === 0 && (
        <p className="text-slate-400 text-sm">
          You haven't added any friends yet.
        </p>
      )}

      <div className="flex flex-wrap gap-5">
        {friends.map((friend) => (
          <div
            key={friend._id}
            className="w-72 bg-[#1a1420] border border-[#3a2f42] rounded-xl px-5 py-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={friend.avatar}
                alt={friend.username}
                className="w-11 h-11 rounded-full object-cover bg-slate-700"
              />
              <p className="font-semibold text-amber-100">{friend.username}</p>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              <span className="text-xs bg-[#2a3a3a] text-slate-200 px-2.5 py-1 rounded-full">
                {getFlag(friend.NativeLanguage)} Native: {friend.NativeLanguage}
              </span>
              <span className="text-xs bg-[#3a2a1a] text-slate-200 px-2.5 py-1 rounded-full">
                {getFlag(friend.LearningLanguage)} Learning:{" "}
                {friend.LearningLanguage}
              </span>
            </div>

            <button className="w-full border border-amber-200/60 text-amber-200 text-sm font-medium py-2 rounded-lg hover:bg-amber-200/10 transition-colors">
              Message
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default Friends;