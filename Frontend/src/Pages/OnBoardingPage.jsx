import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const backendUrl = import.meta.env.BACKEND_URL || "http://localhost:5003";
const ONBOARDING_URL = `${backendUrl}/api/profile/CompleteProfile`;


const LANGUAGES = [
  "English",
  "Hindi",
  "Urdu",
  "Arabic",
  "Bengali",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Japanese",
  "Korean",
  "Mandarin",
  "Turkish",
  "Tamil",
  "Telugu",
  "Punjabi",
  "Indonesian",
  "Dutch",
];

const newAvatar = () =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${Math.random()
    .toString(36)
    .slice(2, 10)}`;

const labelClass = "mb-2 block text-sm font-medium text-[#d9b26a]";

const fieldClass =
  "w-full rounded-lg border border-[#3a2f3d] bg-[#231a26] px-4 py-3 text-sm text-gray-100 " +
  "placeholder-gray-500 transition focus:border-[#d9b26a] focus:outline-none focus:ring-2 focus:ring-[#d9b26a]/30";

function ShuffleIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 3h5v5" />
      <path d="M4 20 21 3" />
      <path d="M21 16v5h-5" />
      <path d="m15 15 6 6" />
      <path d="M4 4l5 5" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function WheelIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="8" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 10l5 5 5-5z" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export default function OnBoardingPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    NativeLanguage: "",
    LearningLanguage: "",
    city: "",
    avatar: newAvatar(),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRandomAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar: newAvatar() }));
    toast.success("Random profile picture generated!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.NativeLanguage === formData.LearningLanguage) {
      setError("Native and learning language must be different");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(ONBOARDING_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.detail?.[0]?.msg ||
            data.detail ||
            data.message ||
            "Onboarding failed"
        );
      }

      let storedUser = {};
      try {
        storedUser = JSON.parse(localStorage.getItem("user")) || {};
      } catch {
        storedUser = {};
      }

      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, ...(data.user || {}), isOnboarded: true })
      );

      toast.success("Profile completed successfully!");
      navigate("/");
    } catch (err) {
      setError(err.message || "Onboarding failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#150f18] px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl border border-[#2c2230] bg-[#1b1320] p-6 shadow-xl sm:p-10">
        <h1 className="text-center text-3xl font-bold tracking-tight text-[#d9b26a]">
          Complete Your Profile
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-5">
            <div className="h-24 w-24 overflow-hidden rounded-full bg-[#e9e2ee] ring-2 ring-[#3a2f3d]">
              <img
                src={formData.avatar}
                alt="Your profile avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleRandomAvatar}
              className="flex items-center gap-2 rounded-md bg-[#1f6072] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#25748a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3aa0bd]"
            >
              <ShuffleIcon />
              Generate random avatar
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {/* Full name */}
          <div>
            <label htmlFor="fullName" className={labelClass}>
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              autoComplete="name"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
              className={fieldClass}
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className={labelClass}>
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              maxLength={300}
              placeholder="Tell others about yourself and your language learning goals"
              value={formData.bio}
              onChange={handleChange}
              required
              className={`${fieldClass} resize-y`}
            />
          </div>

          {/* Languages */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="NativeLanguage" className={labelClass}>
                Native language
              </label>
              <div className="relative">
                <select
                  id="NativeLanguage"
                  name="NativeLanguage"
                  value={formData.NativeLanguage}
                  onChange={handleChange}
                  required
                  className={`${fieldClass} appearance-none pr-10 ${
                    formData.NativeLanguage ? "" : "text-gray-500"
                  }`}
                >
                  <option value="" disabled>
                    Select your native language
                  </option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang} className="text-gray-900">
                      {lang}
                    </option>
                  ))}
                </select>
                <ChevronIcon />
              </div>
            </div>

            <div>
              <label htmlFor="LearningLanguage" className={labelClass}>
                Learning language
              </label>
              <div className="relative">
                <select
                  id="LearningLanguage"
                  name="LearningLanguage"
                  value={formData.LearningLanguage}
                  onChange={handleChange}
                  required
                  className={`${fieldClass} appearance-none pr-10 ${
                    formData.LearningLanguage ? "" : "text-gray-500"
                  }`}
                >
                  <option value="" disabled>
                    Select language you're learning
                  </option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang} className="text-gray-900">
                      {lang}
                    </option>
                  ))}
                </select>
                <ChevronIcon />
              </div>
            </div>
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className={labelClass}>
              Location
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <PinIcon />
              </span>
              <input
                id="city"
                type="text"
                name="city"
                autoComplete="address-level2"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className={`${fieldClass} pl-11`}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#df9548] py-3 text-sm font-semibold text-[#1b1320] transition hover:bg-[#e8a35a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a35a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1320] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Spinner /> : <WheelIcon />}
            {loading ? "Completing onboarding..." : "Complete onboarding"}
          </button>
        </form>
      </div>
    </div>
  );
}