import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { ShipWheel, Bell, ChevronDown, LogOut } from "lucide-react";
import SearchBar from "../Layout/SearchBar";
import { toast } from "react-toastify";
import ThemeSelector from "./ThemeSelector";
import { isAuthenticated } from "../../Helper/Auth.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5003";
const PROFILE_URL = `${backendUrl}/api/users/me`;

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

const userLinks = [
  { label: "Your profile", href: "/profile" },
  { label: "Settings", href: "#" },
];

export default function Navbar() {
  const [avatar, setAvatar] = useState(null);
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (!authenticated) return;
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
  }, [authenticated]);

  // logout function to clear local storage and redirect to login page... 
  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
     
      window.dispatchEvent(new Event("auth-change"));
      toast.success("Signed out successfully!");
      window.location.href = "/login";
    }
  };

  return (
    <Disclosure
      as="header"
      className="sticky top-0 z-30 flex h-16 items-center border-b border-base-300 bg-base-200/80 backdrop-blur-md"
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">    
        <div className="flex w-full items-center justify-between gap-4">
          {/* Left Side: Logo */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2 px-1 sm:px-2">
              <ShipWheel className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2] text-primary" />
              <span className="text-base sm:text-xl font-bold tracking-wide">
                LoopTalk
              </span>
            </div>
          </Link>

    {/* Right Side: Actions */}
      <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
           {authenticated && <SearchBar />}
          <ThemeSelector />

           {authenticated ? (
              <>
              {/* Notifications Bell */}
                <Link to="/notification">
                  <button type="button" className="btn btn-ghost btn-circle">
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-6 w-6 text-base-content opacity-70" />
                  </button>
                </Link>

                {/* Profile Dropdown with Sign Out */}
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
                        <Link
                          to={item.href}
                          className="block rounded-lg px-4 py-2 text-sm text-base-content transition data-focus:bg-base-300"
                        >
                          {item.label}
                        </Link>
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
              </>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary btn-sm rounded-full px-4 font-semibold"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>
    </Disclosure>
  );
}