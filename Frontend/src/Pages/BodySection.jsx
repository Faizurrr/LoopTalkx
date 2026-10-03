import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';
import { MapPin } from "lucide-react";
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
      <div className="flex flex-1 items-center justify-center p-10 text-base-content/60">
        Loading recommendations of Friends...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-error">
        Error: {error}
      </div>
    );

  if (recommendedFriends.length === 0)
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-base-content/60">
        No recommendations found yet.
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-base-content mb-1">Meet New Learners</h1>
      <p className="text-base-content/70 mb-6">
        Discover perfect language exchange partners based on your profile
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendedFriends.map((user) => (
          <div
            key={user._id}
            className="bg-base-200 rounded-xl p-4 border border-base-300 hover:border-primary/50 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={user.avatar}
                alt={user.fullname || user.fullName || user.username}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30 bg-base-300"
              />
             <div className="flex min-w-0 flex-col gap-0.5">
  <h3 className="truncate text-base font-semibold leading-tight text-base-content">
    {user.fullname || user.username || "Unknown user"}
  </h3>

  {user.username && user.fullname && (
    <p className="truncate text-xs font-medium text-primary">
      @{user.username}
    </p>
  )}

  <p className="flex items-center gap-1 text-xs text-base-content/60">
    <MapPin className="h-3 w-3 shrink-0" />
    <span className="truncate">{user.city || "Location not set"}</span>
  </p>
</div>
            </div>

            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-medium">
                Native: {user.NativeLanguage || "—"}
              </span>
              <span className="text-xs bg-secondary/10 text-secondary border border-secondary/20 px-2.5 py-1 rounded-full font-medium">
                Learning: {user.LearningLanguage || "—"}
              </span>
            </div>

            {user.bio && (
              <p className="text-sm text-base-content/70 mb-4 line-clamp-2">{user.bio}</p>
            )}

            <button
              onClick={() => handleSendRequest(user._id)}
              disabled={requestedIds.has(user._id)}
              className="w-full btn btn-primary btn-sm rounded-lg flex items-center justify-center gap-2"
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