import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/LoopTalkLoginpageImage.png";
import LOOPTALKLOGO from "../assets/logo.png";

import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5003";
const inputClass =
  "w-full rounded-full border border-base-300 bg-base-100 px-3.5 py-2 text-xs text-base-content placeholder:text-base-content/50 " +
  "transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25";

const labelClass = "mb-1 block px-1 text-[11px] font-medium text-base-content/70";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
           fullname: formData.fullname,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail?.[0]?.msg || data.message || "Registration failed"
        );
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-change"));

      toast.success("User registered successfully!");
      navigate("/onBoarding");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100 text-base-content p-4">
      {/* Single bordered card: form left, illustration right */}
      <div className="grid w-full max-w-2xl overflow-hidden rounded-xl border border-base-300 bg-base-200 shadow-xl lg:grid-cols-2">
        {/* Left: form panel */}
        <div className="flex flex-col p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <img
              src={LOOPTALKLOGO}
              alt="LoopTalk logo"
              className="h-7 w-7 rounded-full object-cover ring-2 ring-primary/60"
            />
            <span className="text-lg font-bold tracking-tight text-primary">
              LoopTalk
            </span>
          </div>

          <h1 className="text-sm font-semibold text-base-content">Create account</h1>
          <p className="mb-4 mt-0.5 text-[11px] text-base-content/70">
            Sign up to start practicing with partners
          </p>

          {error && (
            <div
              role="alert"
              className="mb-3 rounded-lg border border-error/30 bg-error/10 px-3 py-1.5 text-[11px] text-error"
            >
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit} className="space-y-3">

             <div>
              <label htmlFor="fullname" className={labelClass}>
                Full Name
              </label>
              <input
                id="fullname"
                type="text"
                name="fullname"
                autoComplete="fullname"
                placeholder="Enter your full name"
                value={formData.fullname}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="username" className={labelClass}>
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                autoComplete="username"
                placeholder="Choose a unique username"
                value={formData.username}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
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
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 rounded-r-full px-3.5 text-[11px] font-medium text-base-content/60 hover:text-primary focus:outline-none focus-visible:text-primary"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-sm w-full rounded-full font-semibold transition"
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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-base-content/70">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-medium text-primary hover:underline focus:outline-none focus-visible:underline"
            >
              Log in
            </button>
          </p>
        </div>

        {/* Right: illustration panel */}
        <div className="hidden flex-col items-center justify-center gap-4 border-l border-base-300 bg-gradient-to-b from-base-200 to-base-300 p-6 text-center lg:flex">
          <img
            src={logoImg}
            alt="Two people on a video call"
            className="w-full max-w-[13rem] object-contain"
          />
          <div className="max-w-[14rem] space-y-1">
            <h2 className="text-sm font-semibold text-base-content">
              Connect with language partners worldwide
            </h2>
            <p className="text-[11px] leading-relaxed text-base-content/70">
              Practice conversations, make friends, and improve your language
              skills together
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}