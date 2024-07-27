import React from "react";
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t-2 border-black py-6">
      {/* Social Media Icons */}
      <div className="flex justify-center mb-4 space-x-6">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-gray-700"
        >
          <FaInstagram size={24} />
        </a>
        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-gray-700"
        >
          <FaTwitter size={24} />
        </a>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-gray-700"
        >
          <FaFacebookF size={24} />
        </a>
        <a
          href="https://www.youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-gray-700"
        >
          <FaYoutube size={24} />
        </a>
      </div>

      {/* Navigation Links */}
      <div className="flex justify-center mb-4 space-x-6 text-black text-sm">
        <a href="/" className="hover:text-gray-700">
          Home
        </a>
        <span>|</span>
        <a href="/about" className="hover:text-gray-700">
          About Us
        </a>
        <span>|</span>
        <a href="/contact" className="hover:text-gray-700">
          Contact Us
        </a>
      </div>

      {/* Copyright */}
      <div className="text-center text-black text-sm">
        © Copyright. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
