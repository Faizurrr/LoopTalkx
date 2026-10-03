import React, { useEffect, useState } from "react";
import SideBar from "../Components/Common/SideBar";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5003";

function Notifications() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);
  const[rejectingId , setRejectingId] = useState(null);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${backendUrl}/api/friendrequest/get`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Couldn't load friend requests");
        }

        const data = await response.json();
        setFriendRequests(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, []);


    // this fn logic to accept friend request....
  const handleAccept = async (requestId) => {
    setAcceptingId(requestId);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${backendUrl}/api/friendrequest/accept/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Couldn't accept this request");
      }

      setFriendRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      setError(err.message);
    } finally {
      setAcceptingId(null);
    }
  };


  
    // this fn logic to reject friend request....
  const  handleReject = async (requestId) => {
    setRejectingId(requestId);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${backendUrl}/api/friendrequest/reject/${requestId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Couldn't reject this request");
      }

      setFriendRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      setError(err.message);
    } finally {
      setRejectingId(null);
    }
  };


  return (
    <div className="flex min-h-screen bg-base-100 text-base-content">
      <SideBar />

      <main className="flex-1 px-10 py-8">
        <h1 className="text-2xl font-semibold mb-8 text-base-content">Notifications</h1>

        <section>
          <div className="flex items-center gap-2 mb-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-base-content/70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h2 className="text-lg font-medium text-base-content">Friend Requests</h2>
            {friendRequests.length > 0 && (
              <span className="badge badge-primary badge-sm">
                {friendRequests.length}
              </span>
            )}
          </div>

          {loading && (
            <p className="text-base-content/70 text-sm">Loading requests…</p>
          )}

          {!loading && error && (
            <p className="text-error text-sm">{error}</p>
          )}

          {!loading && !error && friendRequests.length === 0 && (
            <p className="text-base-content/70 text-sm">
              No pending friend requests right now.
            </p>
          )}

          <div className="flex flex-col gap-3">
            {friendRequests.map((req) => (
              <div
                key={req._id}
                className="flex items-center justify-between bg-base-200 border border-base-300 rounded-2xl px-5 py-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={req.sender?.avatar}
                    alt={req.sender?.username}
                    className="w-11 h-11 rounded-full object-cover bg-base-300 ring-2 ring-primary/30"
                  />
                  <div>
                    <p className="font-medium text-sm text-base-content">
                      {req.sender?.fullname || req.sender?.username}
                    </p>
                    {req.sender?.fullname && req.sender?.username && (
                      <p className="text-xs text-primary font-medium">@{req.sender.username}</p>
                    )}
                    <div className="flex gap-2 mt-1.5">
                      <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-medium">
                        Native: {req.sender?.NativeLanguage}
                      </span>
                      <span className="text-xs bg-secondary/10 text-secondary border border-secondary/20 px-2.5 py-0.5 rounded-full font-medium">
                        Learning: {req.sender?.LearningLanguage}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAccept(req._id)}
                    disabled={acceptingId === req._id}
                    className="btn btn-primary btn-sm font-medium px-4 transition-colors"
                  >
                    {acceptingId === req._id ? "Accepting…" : "Accept"}
                  </button>
                  <button
                    onClick={() => handleReject(req._id)}
                    disabled={rejectingId === req._id}
                    className="btn btn-error btn-sm btn-outline font-medium px-4 transition-colors"
                  >
                    {rejectingId === req._id ? "Rejecting…" : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Notifications;