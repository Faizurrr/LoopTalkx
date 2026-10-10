import React from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Globe,
  Users,
  Sparkles,
  Zap,
  Shield,
  Heart,
  
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import ProfilePic from "../assets/ProfilePic.jpg";
const stats = [
  { label: "Active Users", value: "10K+" },
  { label: "Languages Supported", value: "50+" },
  { label: "Messages Sent Daily", value: "1M+" },
  { label: "Countries Reached", value: "120+" },
];

const values = [
  {
    icon: <Globe className="h-7 w-7" />,
    title: "Global Connection",
    desc: "We believe language should never be a barrier. LoopTalk bridges cultures and connects people across the globe.",
  },
  {
    icon: <Zap className="h-7 w-7" />,
    title: "Real-Time Everything",
    desc: "Instant messaging, live video calls, and AI responses — all delivered with blazing-fast, low-latency infrastructure.",
  },
  {
    icon: <Sparkles className="h-7 w-7" />,
    title: "AI-Powered Intelligence",
    desc: "Our Second Brain and AI Coach help you learn, retain, and communicate smarter with every conversation.",
  },
  {
    icon: <Shield className="h-7 w-7" />,
    title: "Privacy First",
    desc: "Your conversations are yours. We build with end-to-end security and transparent data practices at our core.",
  },
  {
    icon: <Users className="h-7 w-7" />,
    title: "Community Driven",
    desc: "LoopTalk grows with its users. Your feedback shapes every feature and every release.",
  },
  {
    icon: <Heart className="h-7 w-7" />,
    title: "Built with Care",
    desc: "Every pixel and every line of code is crafted with passion by a developer who genuinely loves building useful software.",
  },
];

const creator = {
  name: "Faizur Rahman",
  role: "Founder & Lead Developer",
  picture: ProfilePic,
  bio: "Most language apps teach you words but not how to use them in conversation. I built LoopTalkx to fix that: match with native speakers, become friends, chat, call, and get instant AI feedback on your messages. As a full-stack developer, I wanted to go beyond CRUD apps and work on real-time communication, authentication, friend systems, and AI integration, and this project let me do all of it end to end.",
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/Faizurrr",
      icon: <FaGithub className="h-5 w-5" />,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/faizurrahman-868700326/?isSelfProfile=true",
      icon: <FaLinkedin className="h-5 w-5" />,
    },
    {
      name: "LeetCode",
      url: "https://leetcode.com/u/Faizkhan34/",
      icon: <SiLeetcode className="h-5 w-5" />,
    },
  ],
};

export default function About() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 py-24 px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/20">
            <MessageCircle className="h-4 w-4" />
            Our Story
          </div>
          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight lg:text-6xl">
            Connecting the World,{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              One Loop at a Time
            </span>
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-base-content/70">
            LoopTalk was born from a simple idea: communication should be
            effortless, intelligent, and truly global. We blend real-time chat,
            video calls, and AI-powered tools into one seamless platform.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn btn-primary btn-lg rounded-full px-8">
              Get Started Free
            </Link>
            <Link to="/docs" className="btn btn-outline btn-lg rounded-full px-8">
              Read the Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-base-300 bg-base-200 py-14 px-6">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-extrabold text-primary">{s.value}</p>
              <p className="mt-1 text-sm text-base-content/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Our Mission</h2>
          <p className="text-lg leading-relaxed text-base-content/70">
            We're on a mission to make meaningful human connection as easy as
            thinking out loud. By combining real-time communication with AI
            intelligence, LoopTalk empowers language learners, remote teams,
            and global communities to understand each other better.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-base-200 py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold">What We Stand For</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="group rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
                  {v.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{v.title}</h3>
                <p className="text-sm leading-relaxed text-base-content/65">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder & Creator */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Meet the Creator</h2>
          <div className="group flex flex-col items-center rounded-3xl border border-base-300 bg-base-200 p-10 text-center shadow-md transition-all duration-300 hover:shadow-xl">
            <img
              src={creator.picture}
              alt={creator.name}
              className="mb-6 h-28 w-28 rounded-full bg-base-300 ring-4 ring-primary/30 transition-all group-hover:ring-primary/60"
            />
            <h3 className="text-2xl font-bold text-base-content">{creator.name}</h3>
            <p className="mb-4 text-base font-semibold text-primary">{creator.role}</p>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-base-content/70">
              {creator.bio}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-4">
              {creator.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-base-100 px-4 py-2 text-sm font-medium text-base-content/80 shadow-sm border border-base-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary hover:text-primary-content"
                >
                  {social.icon}
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20 px-6 text-center text-primary-content">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-3xl font-bold">Ready to Loop In?</h2>
          <p className="mb-8 text-lg opacity-90">
            Join thousands of learners and communicators already using LoopTalk.
          </p>
          <Link to="/register" className="btn btn-lg bg-white text-primary hover:bg-white/90 border-none rounded-full px-10">
            Start for Free
          </Link>
        </div>
      </section>
    </div>
  );
}
