import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/LoopTalkLoginpageImage.png";
import LOOPTALKLOGO from "../assets/logo.png";

import { toast } from "react-toastify";

 const backendUrl = import.meta.env.BACKEND_URL || "http://localhost:5003"; 

 
const inputClass =
  "w-full rounded-full border border-[#2c2230] bg-[#150f18] px-3.5 py-2 text-xs text-[#f3ecf5] placeholder-[#7d7385] " +
  "transition focus:border-[#d9b26a] focus:outline-none focus:ring-2 focus:ring-[#d9b26a]/25";

const labelClass = "mb-1 block px-1 text-[11px] font-medium text-[#b9aec0]";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
// Default to localhost if not set

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail?.[0]?.msg ||
            data.detail ||
            data.message ||
            "Login failed"
        );
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-change"));

      toast.success("Login successful!");
      const onboarded = Boolean(
        data.user?.onboarded ||
        data.user?.isOnboarded ||
        Boolean(data.user?.NativeLanguage && data.user?.LearningLanguage)
      );
      navigate(onboarded ? "/" : "/onBoarding");
    } catch (err) {
      setError(err.message || "Login failed");
      setLoading(false);
    }
  };
 

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#150f18] p-4">
      {/* Single bordered card: form left, illustration right */}
      <div className="grid w-full max-w-2xl overflow-hidden rounded-xl border border-[#2c2230] bg-[#1b1320] shadow-lg shadow-black/30 lg:grid-cols-2">
        {/* Left: form panel */}
        <div className="flex flex-col justify-center p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <img
              src={LOOPTALKLOGO}
              alt="LoopTalk logo"
              className="h-7 w-7 rounded-full object-cover ring-1 ring-[#d9b26a]/60"
            />
            <span className="text-lg font-bold tracking-tight text-[#d9b26a]">
              LoopTalk
            </span>
          </div>

          <h1 className="text-sm font-semibold text-[#f3ecf5]">Welcome back</h1>
          <p className="mb-4 mt-0.5 text-[11px] leading-relaxed text-[#a0a0a0]">
            Sign in to your account to continue connecting with language partners worldwide.
          </p>

          {error && (
            <div
              role="alert"
              className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[11px] text-red-300"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="email" className={labelClass}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 rounded-r-full px-3.5 text-[11px] font-medium text-[#8f8596] hover:text-[#d9b26a] focus:outline-none focus-visible:text-[#d9b26a]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#d9b26a] py-2 text-xs font-semibold text-[#1b1320] transition hover:bg-[#e6c485] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b26a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1320] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <svg
                  className="h-3.5 w-3.5 animate-spin"
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
              )}
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-[#a0a0a0]">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-medium text-[#d9b26a] hover:underline focus:outline-none focus-visible:underline"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Right: illustration panel */}
        <div className="hidden flex-col items-center justify-center gap-4 border-l border-[#2c2230] bg-gradient-to-b from-[#2b1d36] to-[#1b1320] p-6 text-center lg:flex">
          <img
            src={logoImg}
            alt="Two people on a video call"
            className="w-full max-w-[13rem] object-contain"
          />
          <div className="max-w-[14rem] space-y-1">
            <h2 className="text-sm font-semibold text-[#f3ecf5]">
              Connect with language partners worldwide
            </h2>
            <p className="text-[11px] leading-relaxed text-[#a0a0a0]">
              Practice conversations, make friends, and improve your language
              skills together
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}