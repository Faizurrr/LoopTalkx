import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall, className = "" }) {
  return (
    <button
      onClick={handleVideoCall}
      className={`btn btn-sm btn-primary text-primary-content gap-2 shadow-sm transition hover:scale-105 ${className}`}
      title="Start Video Call"
      type="button"
    >
      <VideoIcon className="w-4 h-4" />
      <span className="hidden sm:inline font-medium">Video Call</span>
    </button>
  );
}

export default CallButton;