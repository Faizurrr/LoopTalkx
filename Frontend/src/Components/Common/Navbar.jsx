import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Menu as MenuIcon, X, Bell, ChevronDown } from "lucide-react";
import SearchBar from "../Layout/SearchBar";
import LOOPTALKLOGO from "../../assets/logo.png";

const navLinks = [

  { label: "Team", href: "#" },
  { label: "Projects", href: "#" },
  { label: "Calendar", href: "#" },
];

const userLinks = [
  { label: "Your profile", href: "Profile" },
  { label: "Settings", href: "#" },
  { label: "Sign out", href: "#" },
];

export default function Navbar() {
  return (
    <Disclosure as="header" className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      {({ open }) => (
        <>
          <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between gap-4">
              
              {/* Left Side: Logo & Main Navigation */}
              <div className="flex items-center gap-3">
                <div className="flex shrink-0 items-center">
                  <img
                    src={LOOPTALKLOGO}
                    alt="LoopTalk Logo"
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200"
                  />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900">LoopTalk</h1>

                <div className="hidden lg:flex">
                  <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
                    {navLinks.map((item, idx) => (
                      <a
                        key={item.label}
                        href={item.href}
                        aria-current={idx === 0 ? "page" : undefined}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition `}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Search Bar + Actions */}
              <div className="flex flex-1 items-center cursor:pointer hover:color:gray justify-end gap-2 md:gap-4">
                
                
                
                  <SearchBar />
              

                {/* Notifications Bell */}
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-5 w-5" />
                </button>

                {/* Profile Dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white pl-2 pr-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="User avatar"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </MenuButton>

                  <MenuItems
                    anchor="bottom end"
                    className="mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1 shadow-lg outline-none transition data-closed:scale-95 data-closed:opacity-0"
                  >
                    {userLinks.map((item) => (
                      <MenuItem key={item.label}>
                        <a
                          href={item.href}
                          className="block rounded-lg px-4 py-2 text-sm text-slate-700 transition data-focus:bg-slate-100 data-focus:text-slate-900"
                        >
                          {item.label}
                        </a>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>

                {/* Mobile Menu Toggle Button */}
                <div className="flex lg:hidden">
                  <DisclosureButton className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <MenuIcon className="h-6 w-6" />
                    )}
                  </DisclosureButton>
                </div>
              </div>
            </div>

            {/* Mobile Search Bar (Stays full-width underneath on tiny screens so it doesn't break the header) */}
          </nav>

          {/* Mobile Main Menu Panels */}
          <DisclosurePanel className="border-t border-slate-200 bg-white lg:hidden">
            <div className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6 lg:px-8">
              {navLinks.map((item, idx) => (
                <DisclosureButton
                  key={item.label}
                  as="a"
                  href={item.href}
                  aria-current={idx === 0 ? "page" : undefined}
                  className={`block rounded-xl px-4 py-3 text-base font-medium transition 
                  `}
                >
                  {item.label}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}