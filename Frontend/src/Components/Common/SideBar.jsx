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
    <aside className="w-60 min-h-screen bg-base-200 border-r border-base-300 p-4 flex flex-col gap-6 select-none">
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
                      ? 'bg-primary/20 text-primary shadow-inner border border-primary/30'
                      : 'text-base-content/70 hover:text-base-content '
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