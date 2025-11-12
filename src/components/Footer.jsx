import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
      <div className="grid grid-flow-col gap-4">
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Artwork</a>
        <a className="link link-hover">Artists</a>
      </div>
      <div>
        <div className="grid grid-flow-col gap-4">
          <a>
            <FaTwitter className="w-6 h-6" />
          </a>
          <a>
            <FaFacebook className="w-6 h-6" />
          </a>
          <a>
            <FaInstagram className="w-6 h-6" />
          </a>
          <a>
            <FaLinkedin className="w-6 h-6" />
          </a>
        </div>
      </div>
      <div>
        <p>Copyright © 2023 - All rights reserved by Artify</p>
      </div>
    </footer>
  );
};

export default Footer;