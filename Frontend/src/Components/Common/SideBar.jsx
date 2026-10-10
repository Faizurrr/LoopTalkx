import React, { useState } from 'react';
import { House, Users, Bell } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

function SideBar() {
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: House, href: '/' },
    { name: 'Friends', icon: Users, href: '/friends' },
    { name: 'Notifications', icon: Bell, href: '/notification' },
  ];

  return (
    <aside className="w-full md:w-60 min-h-0 md:min-h-screen bg-base-200 border-t md:border-t-0 md:border-r border-base-300 p-2 md:p-4 flex flex-row md:flex-col justify-around md:justify-start gap-1 md:gap-6 select-none fixed bottom-0 left-0 right-0 md:relative z-40 md:z-auto">
      <nav className="w-full">
        <ul className="flex flex-row md:flex-col justify-around md:justify-start gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <li key={item.name} className="flex-1 md:flex-none">
                <Link
                  to={item.href}
                  className={`w-full flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 py-2 md:px-3.5 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/20 text-primary shadow-inner border border-primary/30'
                      : 'text-base-content/70 hover:text-base-content hover:bg-base-300/50'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="hidden sm:inline md:inline">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default SideBar;