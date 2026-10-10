import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  MessageCircle,
  Video,
  Sparkles,
  Users,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

const sections = [
  {
    id: "getting-started",
    icon: <BookOpen className="h-5 w-5" />,
    title: "Getting Started",
    items: [
      { label: "Creating Your Account", anchor: "#create-account" },
      { label: "Completing Onboarding", anchor: "#onboarding" },
      { label: "Setting Up Your Profile", anchor: "#profile" },
      { label: "Finding Language Partners", anchor: "#partners" },
    ],
  },
  {
    id: "chat",
    icon: <MessageCircle className="h-5 w-5" />,
    title: "Chat & Messaging",
    items: [
      { label: "Sending Messages", anchor: "#send-msg" },
      { label: "Sending Images & Files", anchor: "#files" },
      { label: "Message Reactions", anchor: "#reactions" },
      { label: "Notifications", anchor: "#notifications" },
    ],
  },
  {
    id: "calls",
    icon: <Video className="h-5 w-5" />,
    title: "Video Calls",
    items: [
      { label: "Starting a Call", anchor: "#start-call" },
      { label: "Screen Sharing", anchor: "#screen-share" },
      { label: "Call Settings", anchor: "#call-settings" },
      { label: "Troubleshooting Audio/Video", anchor: "#av-troubleshoot" },
    ],
  },
  {
    id: "ai",
    icon: <Sparkles className="h-5 w-5" />,
    title: "AI Features",
    items: [
      { label: "AI Coach Overview", anchor: "#ai-coach" },
      { label: "Second Brain", anchor: "#second-brain" },
      { label: "Language Correction", anchor: "#lang-correction" },
      { label: "AI Prompts & Tips", anchor: "#ai-tips" },
    ],
  },
  {
    id: "community",
    icon: <Users className="h-5 w-5" />,
    title: "Community & Friends",
    items: [
      { label: "Sending Friend Requests", anchor: "#friend-req" },
      { label: "Managing Your Friends List", anchor: "#friends-list" },
      { label: "Blocking & Reporting", anchor: "#block-report" },
      { label: "Community Guidelines", anchor: "#guidelines" },
    ],
  },
];

const faqs = [
  {
    q: "Is LoopTalk free to use?",
    a: "Yes! LoopTalk offers a generous free tier with access to chat, friend connections, and basic AI features. Premium plans unlock advanced AI coaching, higher call quality, and extended Second Brain storage.",
  },
  {
    q: "What languages does LoopTalk support?",
    a: "We support 50+ languages for matching and learning, including English, Spanish, French, German, Hindi, Urdu, Arabic, Japanese, Korean, Mandarin, and many more.",
  },
  {
    q: "How does the AI Coach work?",
    a: "The AI Coach listens to your conversations (with consent) and provides real-time suggestions, corrections, and vocabulary tips. It adapts to your learning level over time.",
  },
  {
    q: "Is my data private and secure?",
    a: "Absolutely. All messages are encrypted in transit. We never sell your data to third parties. See our Privacy Policy for full details.",
  },
  {
    q: "Can I use LoopTalk on mobile?",
    a: "LoopTalk is fully responsive and works great on mobile browsers. Native mobile apps are on our roadmap.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-base-300">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-base font-medium text-base-content transition hover:text-primary"
        aria-expanded={open}
      >
        {q}
        <ChevronDown
          className={`h-5 w-5 shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-primary" : "text-base-content/50"}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-4" : "max-h-0"}`}
      >
        <p className="text-sm leading-relaxed text-base-content/70">{a}</p>
      </div>
    </div>
  );
}

export default function Docs() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 py-20 px-6 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/20">
            <BookOpen className="h-4 w-4" />
            Documentation
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
            LoopTalk Docs
          </h1>
          <p className="text-lg text-base-content/70">
            Everything you need to get the most out of LoopTalk — from your first
            message to mastering the AI Coach.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-60">
            <nav className="sticky top-24 space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-base-content/70 transition hover:bg-base-200 hover:text-primary"
                >
                  {s.icon}
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 space-y-14">
            {sections.map((section) => (
              <div key={section.id} id={section.id}>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {section.items.map((item) => (
                    <a
                      key={item.label}
                      href={item.anchor}
                      className="group flex items-center justify-between rounded-xl border border-base-300 bg-base-200 px-5 py-4 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                    >
                      {item.label}
                      <ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 text-primary" />
                    </a>
                  ))}
                </div>
              </div>
            ))}

            {/* FAQ */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              </div>
              <div className="rounded-2xl border border-base-300 bg-base-200 px-6">
                {faqs.map((faq) => (
                  <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>

            {/* Still need help? */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
              <h3 className="mb-2 text-xl font-bold">Still have questions?</h3>
              <p className="mb-5 text-sm text-base-content/70">
                Can't find what you're looking for? Reach out to our team or chat with the community.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/about" className="btn btn-primary btn-sm rounded-full px-6">
                  Contact Us
                </Link>
                <Link to="/" className="btn btn-outline btn-sm rounded-full px-6">
                  Back to App
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
