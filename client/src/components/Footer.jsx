import React from "react";
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t-2 border-black py-6 mt-4">
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

      <div className="flex justify-center mb-4 space-x-6 text-black text-sm">
        <Link to="/" className="hover:text-gray-700">
          Home
        </Link>
        <span>|</span>
        <Link to="/about-us" className="hover:text-gray-700">
          About Us
        </Link>
        <span>|</span>
        <Link to="/contact-us" className="hover:text-gray-700">
          Contact Us
        </Link>
      </div>

      <div className="text-center text-black text-sm">
        © Copyright. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
