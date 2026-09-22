import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall } from "react-icons/fi";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";


const Footer = () => {
 
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-300">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">LoopTalk</h3>
            <p className="mb-4 text-sm leading-6 text-slate-400">
              Real-time video, instant chat, and AI-powered Second Brain in one connected workspace.
            </p>
            <p className="text-sm font-medium text-slate-300">
              Connect instantly. Remember everything.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Product</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/chat" className="transition hover:text-white">Chat</Link></li>
              <li><Link to="/rooms" className="transition hover:text-white">Rooms</Link></li>
              <li><Link to="/brain" className="transition hover:text-white">Second Brain</Link></li>
              <li><Link to="/calls" className="transition hover:text-white">Video Calls</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/about" className="transition hover:text-white">About</Link></li>
              <li><Link to="/docs" className="transition hover:text-white">Docs</Link></li>
              <li><Link to="/privacy" className="transition hover:text-white">Privacy</Link></li>
              <li><Link to="/terms" className="transition hover:text-white">Terms</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Updates</h3>
            <p className="mb-4 text-sm text-slate-400">
              Get product updates and release notes.
            </p>

           

            

            <div className="mb-4 flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                <FaGithub className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                <FaLinkedinIn className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                <TbBrandMeta className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                <IoLogoInstagram className="h-5 w-5" />
              </a>
              <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                <RiTwitterXLine className="h-4 w-4" />
              </a>
            </div>

            <p className="text-sm text-slate-300">
              <FiPhoneCall className="mr-2 inline-block" />
              +91 12345 67890
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-center text-sm text-slate-500">
            © {new Date().getFullYear()} LoopTalk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;