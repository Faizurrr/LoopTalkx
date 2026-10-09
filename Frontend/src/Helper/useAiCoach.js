import { useState } from "react";

const getLearningLanguage = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.LearningLanguage || null;
  } catch {
    return null;
  }
};

export default function useAiCoach() {
  const [checking, setChecking] = useState(false);
  const [suggestion, setSuggestion] = useState(null); // { corrected, explanation }
  const [error, setError] = useState("");

  const clearSuggestion = () => {
    setSuggestion(null);
    setError("");
  };

  const checkWithAI = async (text) => {
    const message = text?.trim();
    if (!message || checking) return;

    const language = getLearningLanguage();
    if (!language) {
      setSuggestion(null);
      setError("Set the language you're learning in your profile first.");
      return;
    }

    setChecking(true);
    setSuggestion(null);
    setError("");

    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5003";

    try {
      const res = await fetch(`${backendUrl}/api/ai/correct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text: message, language }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          data.message || "AI coach isn't available right now. Try again."
        );
        return;
      }

      setSuggestion({
        corrected: data.corrected,
        explanation: data.explanation,
      });
    } catch {
      setError("Couldn't reach the server. Check your connection.");
    } finally {
      setChecking(false);
    }
  };

  return { checking, suggestion, error, checkWithAI, clearSuggestion };
}