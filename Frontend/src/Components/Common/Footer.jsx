import React from "react";
import { Link, useLocation } from "react-router-dom";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall } from "react-icons/fi";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { ToastContainer } from "react-toastify";

const Footer = () => {
  const { pathname } = useLocation();

  if (pathname.startsWith("/chat/")) return null;

  return (
    <footer className="border-t border-base-300 bg-base-200 text-base-content/80">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-primary">LoopTalk</h3>
            <p className="mb-4 text-sm leading-6 text-base-content/70">
              Chat, call, and learn from native speakers, with instant AI feedback on every message.
            </p>
            <p className="text-sm font-medium text-base-content">
              Connect instantly. Remember everything.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-primary">Resources</h3>
            <ul className="space-y-2 text-sm text-base-content/70">
              <li><Link to="/about" className="transition hover:text-primary">About</Link></li>
              <li><Link to="/docs" className="transition hover:text-primary">Docs</Link></li>
              <li><Link to="/privacy" className="transition hover:text-primary">Privacy</Link></li>
              <li><Link to="/terms" className="transition hover:text-primary">Terms</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-primary">Updates</h3>
            <p className="mb-4 text-sm text-base-content/70">
              Get product updates and release notes.
            </p>

            <div className="mb-4 flex items-center gap-4 text-base-content/70">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="transition hover:text-primary">
                <FaGithub className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="transition hover:text-primary">
                <FaLinkedinIn className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="transition hover:text-primary">
                <TbBrandMeta className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="transition hover:text-primary">
                <IoLogoInstagram className="h-5 w-5" />
              </a>
              <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" className="transition hover:text-primary">
                <RiTwitterXLine className="h-4 w-4" />
              </a>
            </div>

            <p className="text-sm text-base-content/80">
              <FiPhoneCall className="mr-2 inline-block text-primary" />
              +91 12345 67890
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 border-t border-base-300 pt-6">
          <p className="text-center text-sm text-base-content/60">
            © {new Date().getFullYear()} LoopTalk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;