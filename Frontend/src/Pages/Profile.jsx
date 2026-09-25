import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Camera, Mail, User, MapPin, Languages, CalendarDays } from "lucide-react";
import SideBar from "../Components/Common/SideBar";
import OnBoardingPage from "./OnBoardingPage";


const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5003";
const PROFILE_URL = `${backendUrl}/api/users/me`;
const UPDATE_URL = `${backendUrl}/api/profile/CompleteProfile`; // this url is for updating the profile picture jo onbording route hai 




const newAvatar = () =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${Math.random()
    .toString(36)
    .slice(2, 10)}`;







const authHeaders = () => {  // basically a helper fn ... 
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};




// Read-only detail row: icon badge + small label + value (no input-like box)
function InfoRow({ icon: Icon, label, children }) {
  return (
   
    <div className="flex items-center gap-4 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d9b26a]/10 text-[#d9b26a]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-[#8f8596]">{label}</p>
        <div className="truncate text-base text-[#f3ecf5]">{children}</div>
      </div>
    </div>
  );
}
   





function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true">
      <div className="mx-auto h-36 w-36 rounded-full bg-[#2c2230]" />
      <div className="mx-auto h-6 w-48 rounded bg-[#2c2230]" />
      <div className="h-14 rounded-lg bg-[#241a2a]" />
      <div className="h-14 rounded-lg bg-[#241a2a]" />
      <div className="h-24 rounded-lg bg-[#241a2a]" />
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/onBoarding");
  };

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingAvatar, setUpdatingAvatar] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(PROFILE_URL, {
          method: "GET",
          headers: authHeaders(),
          credentials: "include",
        });

        if (response.status === 401) { // unuthorized, banda agr hai toh 
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || data?.detail || "Failed to load profile");
        }

        setUser(data.user || data);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleNewAvatar = async () => {
    const avatar = newAvatar();

    try {
      setUpdatingAvatar(true);

      const response = await fetch(UPDATE_URL, {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify({ avatar }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.detail || "Could not update avatar");
      }

      const updated = data.user || { ...user, avatar };
      setUser(updated);

      try {
        const stored = JSON.parse(localStorage.getItem("user")) || {};
        localStorage.setItem("user", JSON.stringify({ ...stored, avatar: updated.avatar }));
      } catch {
        localStorage.setItem("user", JSON.stringify(updated));
      }

      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error(err.message || "Could not update avatar");
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  const displayName = user?.fullName || user?.username || "";







  return (
    <div className="flex min-h-screen bg-[#150f18] text-[#f3ecf5]">
      <SideBar />
      <div className="flex-1 px-4 pb-10 pt-20">
      <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-[#2c2230] bg-[#1b1320] shadow-lg shadow-black/30">
        {/* Cover banner */}
        <div className="h-28 bg-gradient-to-r from-[#3a2648] via-[#2b1d36] to-[#4a3520] sm:h-32" />

        {loading && (
          <div className="p-6 sm:p-10">
            <ProfileSkeleton />
          </div>
        )}

        {!loading && error && (
          <div className="p-6 sm:p-10">
            <div
              role="alert"
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </div>
          </div>
        )}

        {!loading && user && (
          <div className="px-6 pb-8 sm:px-10">
            {/* Avatar overlaps the banner */}
            <div className="-mt-16 flex flex-col items-center gap-3 text-center sm:-mt-20">
              <div className="relative">
                <img
                  src={
                    user.avatar ||
                    `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username || "user"}`
                  }
                  alt={`${displayName || "User"} avatar`}
                  className="h-32 w-32 rounded-full border-4 border-[#1b1320] bg-[#2c2230] object-cover ring-2 ring-[#d9b26a]/60 sm:h-36 sm:w-36"
                />
                <button
                  type="button"
                  onClick={handleNewAvatar}
                  disabled={updatingAvatar}
                  aria-label="Generate a new profile picture"
                  className={`absolute bottom-1 right-1 rounded-full bg-[#d9b26a] p-2.5 text-[#1b1320] shadow-md transition hover:bg-[#e6c485] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b26a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1320] disabled:opacity-50 ${
                    updatingAvatar ? "animate-pulse" : ""
                  }`}
                >
                  <Camera className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#f3ecf5]">
                  {displayName}
                </h1>
                {user.username && user.fullName && (
                  <p className="text-sm text-[#d9b26a]">@{user.username}</p>
                )}
              </div>

              {user.bio && (
                <p className="max-w-md text-sm leading-relaxed text-[#b9aec0]">{user.bio}</p>
              )}

              <p className="text-xs text-[#8f8596]">
                {updatingAvatar
                  ? "Updating your picture..."
                  : "Tap the camera to get a new random avatar"}
              </p>
            </div>

            {/* Language chips */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d9b26a]/30 bg-[#d9b26a]/10 px-4 py-1.5 text-sm text-[#e6c485]">
                <Languages className="h-4 w-4" aria-hidden="true" />
                Speaks {user.NativeLanguage || "—"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-1.5 text-sm text-violet-300">
                <Languages className="h-4 w-4" aria-hidden="true" />
                Learning {user.LearningLanguage || "—"}
              </span>
            </div>

            {/* Details list */}
            <div className="mt-8 divide-y divide-[#2c2230] border-y border-[#2c2230]">
              <InfoRow icon={User} label="Username">
                {user.username || "—"}
              </InfoRow>
              <InfoRow icon={Mail} label="Email">
                {user.email || "—"}
              </InfoRow>
              <InfoRow icon={MapPin} label="Location">
                {user.city || "—"}
              </InfoRow>
              <InfoRow icon={CalendarDays} label="Member since">
                {memberSince}
              </InfoRow>
            </div>

            {/* Account status */}
            <div className="mt-6 flex items-center justify-between rounded-xl bg-[#241a2a] px-5 py-4">
              <span className="text-sm text-[#b9aec0]">Account status</span>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                Active
              </span>
              <button
                type="button"
                onClick={handleEditProfile}
                className="rounded-lg bg-[#d9b26a] px-4 py-2 text-xs font-semibold text-[#1b1320] transition hover:bg-[#e6c485]"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}