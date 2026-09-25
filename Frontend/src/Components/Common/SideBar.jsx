import React, { useState } from 'react';
import { House, Users, Bell } from "lucide-react";
import { Link } from 'react-router-dom';


   
function SideBar() {
  const [activeTab, setActiveTab] = useState('Home');

  const navItems = [
    { name: 'Home', icon: House, href: '/' },
    { name: 'Friends', icon: Users, href: '/friends' },
    { name: 'Notifications', icon: Bell, href: '/notification' },
  ];

  return (
    <aside className="w-60 min-h-screen bg-[#181116] border-r border-[#2d222a] p-4 flex flex-col gap-6 select-none">
      <nav>
        <ul className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#362725] text-[#e39a5c] shadow-inner border border-[#4a3430]'
                      : 'text-[#9e8f98] hover:text-[#e39a5c] hover:bg-[#251b22]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
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