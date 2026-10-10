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
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-base-content/70">{label}</p>
        <div className="truncate text-base text-base-content font-medium">{children}</div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true">
      <div className="mx-auto h-36 w-36 rounded-full bg-base-300" />
      <div className="mx-auto h-6 w-48 rounded bg-base-300" />
      <div className="h-14 rounded-lg bg-base-300" />
      <div className="h-14 rounded-lg bg-base-300" />
      <div className="h-24 rounded-lg bg-base-300" />
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

  const displayName = user?.fullname ||  user?.username || "";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-base-100 text-base-content">
      <SideBar />
      <div className="flex-1 px-3 sm:px-6 pb-24 md:pb-10 pt-6 sm:pt-20">
      <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-base-300 bg-base-200 shadow-xl">
        {/* Cover banner */}
        <div className="h-28 bg-gradient-to-r from-primary/30 via-base-300 to-secondary/30 sm:h-32" />

        {loading && (
          <div className="p-6 sm:p-10">
            <ProfileSkeleton />
          </div>
        )}

        {!loading && error && (
          <div className="p-6 sm:p-10">
            <div
              role="alert"
              className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
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
                  className="h-32 w-32 rounded-full border-4 border-base-200 bg-base-300 object-cover ring-2 ring-primary/60 sm:h-36 sm:w-36"
                />
                <button
                  type="button"
                  onClick={handleNewAvatar}
                  disabled={updatingAvatar}
                  aria-label="Generate a new profile picture"
                  className={`absolute bottom-1 right-1 btn btn-primary btn-circle btn-sm shadow-md transition disabled:opacity-50 ${
                    updatingAvatar ? "animate-pulse" : ""
                  }`}
                >
                  <Camera className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-base-content">
                  {displayName}
                </h1>
                {user.username && (user.fullname || user.fullName) && (
                  <p className="text-sm font-medium text-primary">@{user.username}</p>
                )}
              </div>

              {user.bio && (
                <p className="max-w-md text-sm leading-relaxed text-base-content/70">{user.bio}</p>
              )}

              <p className="text-xs text-base-content/60">
                {updatingAvatar
                  ? "Updating your picture..."
                  : "Tap the camera to get a new random avatar"}
              </p>
            </div>

            {/* Language chips */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Languages className="h-4 w-4" aria-hidden="true" />
                Speaks {user.NativeLanguage || "—"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary">
                <Languages className="h-4 w-4" aria-hidden="true" />
                Learning {user.LearningLanguage || "—"}
              </span>
            </div>

            {/* Details list */}
            <div className="mt-8 divide-y divide-base-300 border-y border-base-300">
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
            <div className="mt-6 flex items-center justify-between rounded-xl bg-base-300/60 px-5 py-4">
              <span className="text-sm text-base-content/70">Account status</span>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-success">
                <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
                Active
              </span>
              <button
                type="button"
                onClick={handleEditProfile}
                className="btn btn-primary btn-sm rounded-lg text-xs font-semibold transition"
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