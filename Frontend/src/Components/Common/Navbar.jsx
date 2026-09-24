import { useEffect, useState } from "react";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import SearchBar from "../Layout/SearchBar";
import { toast } from "react-toastify";


const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5003";
const PROFILE_URL = `${backendUrl}/api/auth/me`;

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

const userLinks = [
  { label: "Your profile", href: "/profile" },
  { label: "Settings", href: "#" },
];

export default function Navbar() {
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(PROFILE_URL, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setAvatar(data?.user?.avatar ?? null);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch profile:", error);
        }
      }
    };

    fetchProfile();
    return () => controller.abort();
  }, []);

 
     
   // logout function to clear local storage and redirect to login page... 
  const handleSignOut = () => {
  if (window.confirm("Are you sure you want to sign out?")) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Signed out successfully!");
    window.location.href = "/login";
  }
};
   
  return (
    <Disclosure
      as="header"
      className="sticky top-0 z-30 flex h-16 items-center border-b border-base-300 bg-base-200"
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between gap-4">
          {/* Left Side: Logo */}
          <div className="flex items-center gap-2.5">
          
            <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text font-mono text-3xl font-bold tracking-wider text-transparent bg-[#D98A4B]">
              LoopTalk
            </h1>
          </div>

          {/* Right Side: Search Bar + Actions */}
          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
            <SearchBar />

            {/* Notifications Bell */}
            <button type="button" className="btn btn-ghost btn-circle">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6 text-base-content opacity-70" />
            </button>

            {/* Profile Dropdown */}
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center gap-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <img
                  src={avatar || DEFAULT_AVATAR}
                  alt="User avatar"
                  className="h-9 w-9 rounded-full object-cover"
                />
                <ChevronDown className="h-4 w-4 text-base-content opacity-70" />
              </MenuButton>

              <MenuItems
                anchor="bottom end"
                className="z-50 mt-2 w-56 rounded-xl border border-base-300 bg-base-200 p-1 shadow-lg outline-none transition data-closed:scale-95 data-closed:opacity-0"
              >
                {userLinks.map((item) => (
                  <MenuItem key={item.label}>
                    <a
                      href={item.href}
                      className="block rounded-lg px-4 py-2 text-sm text-base-content transition data-focus:bg-base-300"
                    >
                      {item.label}
                    </a>
                  </MenuItem>
                ))}

                <MenuItem>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-left text-sm text-base-content transition data-focus:bg-base-300"
                  >
                    <LogOut className="h-4 w-4 opacity-70" />
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </nav>
    </Disclosure>
  );
}