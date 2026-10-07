import { Sparkles, X } from "lucide-react";

export default function AICoachCard({
  suggestion,
  error,
  onUse,
  onSendAsIs,
  onClose,
}) {
  if (!suggestion && !error) return null;

  return (
    <div className="mx-3 mb-2 rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-base-content">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-sky-600">
          <Sparkles className="h-4 w-4" />
          AI coach
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-base-content/50 hover:text-base-content"
          aria-label="Close AI coach"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {error ? (
        <>
          <p className="mb-3 text-base-content/80">{error}</p>
          <button
            type="button"
            onClick={onSendAsIs}
            className="btn btn-xs btn-outline"
          >
            Send as is
          </button>
        </>
      ) : (
        <>
          <p className="mb-1 text-xs text-base-content/60">Try</p>
          <p className="mb-2 font-medium">{suggestion.corrected}</p>
          <p className="mb-3 text-xs text-base-content/70">
            {suggestion.explanation}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onUse}
              className="btn btn-xs btn-primary"
            >
              Use correction
            </button>
            <button
              type="button"
              onClick={onSendAsIs}
              className="btn btn-xs btn-outline"
            >
              Send as is
            </button>
          </div>
        </>
      )}
    </div>
  );
}