import React from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Trash2, Mail } from "lucide-react";

const lastUpdated = "October 10, 2026";

const sections = [
  {
    id: "information-we-collect",
    icon: <Eye className="h-5 w-5" />,
    title: "Information We Collect",
    content: `When you create a LoopTalk account, we collect information you directly provide such as your name, email address, profile photo, native language, and learning language preferences.

We also automatically collect certain data when you use our services, including:
• Device information (browser type, operating system)
• Log data (IP address, access times, pages viewed)
• Usage data (features used, session duration)
• Communications metadata (who you chat with, when — but NOT message content)

We use cookies and similar tracking technologies to maintain your session, remember your preferences, and understand how you use LoopTalk.`,
  },
  {
    id: "how-we-use",
    icon: <Shield className="h-5 w-5" />,
    title: "How We Use Your Information",
    content: `We use the information we collect to:
• Provide, maintain, and improve LoopTalk services
• Match you with compatible language partners based on your preferences
• Power AI features like the AI Coach and Second Brain (only with your explicit consent)
• Send you important service notifications and account updates
• Detect and prevent fraud, abuse, and security issues
• Analyze usage patterns to improve the user experience
• Comply with legal obligations

We do NOT use your data for targeted advertising. We do NOT sell your personal information to third parties.`,
  },
  {
    id: "data-sharing",
    icon: <Lock className="h-5 w-5" />,
    title: "Data Sharing & Third Parties",
    content: `We share your information only in the following limited circumstances:

With Your Consent: We share data you've explicitly agreed to share, such as your profile being visible to matched language partners.

Service Providers: We use trusted third-party providers (e.g., cloud hosting, analytics) who process data on our behalf under strict data processing agreements.

Legal Requirements: We may disclose data if required by law, court order, or to protect the rights and safety of LoopTalk and its users.

Business Transfers: If LoopTalk is acquired or merges with another company, your data may be transferred. We will notify you of any such change.

We never sell your personal data to data brokers, advertisers, or any other third parties.`,
  },
  {
    id: "data-security",
    icon: <Lock className="h-5 w-5" />,
    title: "Data Security",
    content: `We take the security of your data seriously. We implement the following measures:

• All data in transit is encrypted using TLS 1.3
• Passwords are hashed using industry-standard algorithms (bcrypt)
• Access to production systems is restricted to authorized personnel only
• We conduct regular security audits and vulnerability assessments
• JWT tokens are used for secure session management

While we strive to protect your data, no method of transmission over the internet is 100% secure. We encourage you to use a strong, unique password and to log out from shared devices.`,
  },
  {
    id: "your-rights",
    icon: <Shield className="h-5 w-5" />,
    title: "Your Rights & Choices",
    content: `You have the following rights regarding your personal data:

Access: You can request a copy of the personal data we hold about you.
Correction: You can update or correct your profile information at any time in Settings.
Deletion: You can request deletion of your account and associated data. See the section below.
Portability: You can request an export of your data in a machine-readable format.
Objection: You can object to certain processing activities, such as analytics.
Withdraw Consent: You can withdraw consent for AI features at any time in your Settings.

To exercise any of these rights, please contact us at privacy@looptalk.com.`,
  },
  {
    id: "data-deletion",
    icon: <Trash2 className="h-5 w-5" />,
    title: "Account & Data Deletion",
    content: `You may delete your LoopTalk account at any time from your Profile Settings page. Upon deletion:

• Your profile will be immediately removed from public view
• Your messages will be deleted from our servers within 30 days
• Backup copies may persist for up to 90 days in encrypted cold storage
• Aggregated, anonymized analytics data may be retained

If you need assistance with account deletion or have questions about what data is retained, email us at privacy@looptalk.com.`,
  },
  {
    id: "cookies",
    icon: <Eye className="h-5 w-5" />,
    title: "Cookies & Tracking",
    content: `We use the following types of cookies:

Essential Cookies: Required for the app to function (session management, authentication). These cannot be disabled.

Preference Cookies: Remember your settings, theme, and language preferences. You can clear these via your browser.

Analytics Cookies: Help us understand how LoopTalk is used (e.g., most visited pages). These are anonymized and aggregated. You can opt out in your account Settings.

We do not use advertising or tracking cookies. You can manage cookies through your browser settings.`,
  },
  {
    id: "children",
    icon: <Shield className="h-5 w-5" />,
    title: "Children's Privacy",
    content: `LoopTalk is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has created an account, we will promptly delete their information.

If you are a parent or guardian and believe your child has provided us with personal information, please contact us at privacy@looptalk.com.`,
  },
  {
    id: "changes",
    icon: <Mail className="h-5 w-5" />,
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. When we make significant changes, we will:

• Update the "Last Updated" date at the top of this page
• Notify you via email (if you have provided one)
• Show a notice in the app

Your continued use of LoopTalk after the effective date of any changes constitutes your acceptance of the revised policy.`,
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 py-20 px-6 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/20">
            <Shield className="h-4 w-4" />
            Privacy Policy
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Your Privacy Matters
          </h1>
          <p className="text-base-content/70 text-lg">
            We are committed to being transparent about how we collect, use, and
            protect your data. Read below to understand our practices.
          </p>
          <p className="mt-4 text-sm text-base-content/50">Last Updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Sidebar TOC */}
          <aside className="w-full shrink-0 lg:w-64">
            <div className="sticky top-24 rounded-2xl border border-base-300 bg-base-200 p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-base-content/50">
                Table of Contents
              </p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-base-content/70 transition hover:bg-base-100 hover:text-primary"
                  >
                    <span className="text-primary/60">{s.icon}</span>
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 space-y-10">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm text-base-content/70">
              <strong className="text-base-content">Summary:</strong> We collect only what we need,
              use it to power your experience, never sell your data, and give you
              full control. Your conversations are private.
            </div>

            {sections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-2xl border border-base-300 bg-base-200 p-7"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold">{section.title}</h2>
                </div>
                <div className="whitespace-pre-line text-sm leading-relaxed text-base-content/70">
                  {section.content}
                </div>
              </div>
            ))}

            {/* Contact */}
            <div className="rounded-2xl border border-base-300 bg-base-200 p-7">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Contact Us</h2>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-base-content/70">
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or how we handle your data, please reach out:
              </p>
              <p className="text-sm text-base-content/80">
                📧{" "}
                <a
                  href="mailto:privacy@looptalk.com"
                  className="font-medium text-primary underline underline-offset-2"
                >
                  privacy@looptalk.com
                </a>
              </p>
              <p className="mt-1 text-sm text-base-content/60">
                We aim to respond to all privacy inquiries within 5 business days.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/terms" className="btn btn-outline btn-sm rounded-full">
                View Terms of Service
              </Link>
              <Link to="/about" className="btn btn-ghost btn-sm rounded-full">
                About LoopTalk
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
