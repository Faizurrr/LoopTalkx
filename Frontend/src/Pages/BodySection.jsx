import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5003";
const RECOMMENDED_URL = `${backendUrl}/api/users/Recommendedfriends`;

function BodySection() {
  const [recommendedFriends, setRecommendedFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestedIds, setRequestedIds] = useState(new Set());

  useEffect(() => {
    const fetchRecommendedFriends = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // calling backend route of recommended Friends....
        const response = await fetch(RECOMMENDED_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const res = await response.json();
      
        setRecommendedFriends(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedFriends();
  }, []);
   

     // calling Friend Request route ... (backend)
  const handleSendRequest = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${backendUrl}/api/friendrequest/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify({ receiverId: userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send request");
      }

      toast.success(data.message || "Friend request sent!");

      // Mark this user as requested so the button updates
      setRequestedIds((prev) => new Set(prev).add(userId));
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to send request");
    }
  };

  if (loading)
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-[#9e8f98]">
        Loading recommendations of Friends...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-red-400">
        Error: {error}
      </div>
    );

  if (recommendedFriends.length === 0)
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-[#9e8f98]">
        No recommendations found yet.
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#e6c485] mb-1">Meet New Learners</h1>
      <p className="text-[#9e8f98] mb-6">
        Discover perfect language exchange partners based on your profile
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendedFriends.map((user) => (
    
          <div
            key={user._id}
            className="bg-[#241a2e] rounded-xl p-4 border border-[#2c2230] hover:border-[#e39a5c]/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
  
                src={user.avatar }
                alt={ user.username}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#d9b26a]/30"
              />
              <div>
                <h3 className="text-white font-semibold">
                  { user.username}
                </h3>
                <p className="text-xs text-[#9e8f98]">{user.city || "—"}</p>
              </div>
            </div>

            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="text-xs bg-[#d9b26a]/10 text-[#e6c485] border border-[#d9b26a]/20 px-2 py-1 rounded-full">
            
                Native: {user.NativeLanguage || "—"}
              </span>
              <span className="text-xs bg-violet-400/10 text-violet-300 border border-violet-400/20 px-2 py-1 rounded-full">
                Learning: {user.LearningLanguage || "—"}
              </span>
            </div>

            {user.bio && (
              <p className="text-sm text-[#b9aec0] mb-4 line-clamp-2">{user.bio}</p>
            )}

            <button
              onClick={() => handleSendRequest(user._id)}
              disabled={requestedIds.has(user._id)}
              className="w-full bg-[#e39a5c] hover:bg-[#d4895a] disabled:bg-[#362725] disabled:text-[#9e8f98] disabled:cursor-not-allowed text-[#1b1320] font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <UserPlus size={16} />
              {requestedIds.has(user._id) ? "Request Sent" : "Send Friend Request"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BodySection;