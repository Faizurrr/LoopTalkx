import { useEffect, useRef, useState } from "react";
import { Search, X, UserPlus, Check, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const backendUrl = process.env.VITE_BACKEND_URL || "http://localhost:5003";
const SEARCH_URL = `${backendUrl}/api/user/search`; // must match how your router is mounted



export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  // for sending friend requests
  const [sent, setSent] = useState({});
  const [sending, setSending] = useState({});

  const wrapperRef = useRef(null);

  // send friend request
  const handleAddFriend = async (user) => {
    if (sent[user._id] || sending[user._id]) return;

    try {
      setSending((p) => ({ ...p, [user._id]: true }));

      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/api/friendrequest/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ receiverId: user._id }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Could not send request");

      setSent((p) => ({ ...p, [user._id]: true }));
      toast.success(`Request sent to @${user.username}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending((p) => ({ ...p, [user._id]: false }));
    }
  };


   
  // 1. debounce typing (400ms) .. this is to avoid making too many API calls while the user is typing .. 
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 400);
    return () => clearTimeout(t);
  }, [query]);



  
  // 2. call the API when the debounced value changes
  useEffect(() => {
    if (!debounced) {
      setUsers([]);
      setError("");
      return;
    }

    const controller = new AbortController();

    const search = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        const res = await fetch(
          `${SEARCH_URL}?query=${encodeURIComponent(debounced)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
            signal: controller.signal,
          }
        );

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Search failed");
        setUsers(json.data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    search();
    return () => controller.abort();
  }, [debounced]);

  // 3. close dropdown on outside click or Escape
  useEffect(() => {
    const onClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xs">
      <label className="input input-bordered input-sm flex items-center gap-2">
        <Search className="h-4 w-4 opacity-60" />
        <input
          type="text"
          value={query}
          maxLength={30}
          placeholder="Search users..."
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="grow"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setUsers([]);
            }}
            aria-label="Clear search"
          >
            <X className="h-4 w-4 opacity-60" />
          </button>
        )}
      </label>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-base-300 bg-base-200 p-1 shadow-lg">
          {loading && <p className="px-3 py-2 text-sm opacity-70">Searching...</p>}

          {error && <p className="px-3 py-2 text-sm text-error">{error}</p>}

          {!loading && !error && debounced && users.length === 0 && (
            <p className="px-3 py-2 text-sm opacity-70">No users found</p>
          )}

          {users.map((u) => (
            <div
              key={u._id}
              className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-base-300"
            >
              <img
                src={u.avatar}
                alt={u.username}
                className="h-9 w-9 rounded-full object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{u.fullname}</p>
                <p className="truncate text-xs opacity-60">
                  @{u.username}
                  {u.city && ` · ${u.city}`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleAddFriend(u)}
                disabled={sent[u._id] || sending[u._id]}
                title={sent[u._id] ? "Request sent" : "Add friend"}
                aria-label={sent[u._id] ? "Request sent" : "Add friend"}
                className="btn btn-ghost btn-circle btn-sm"
              >
                {sending[u._id] ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : sent[u._id] ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}