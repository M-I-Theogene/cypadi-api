import React from "react";
import { FiTwitter, FiGithub, FiLinkedin } from "react-icons/fi";

export const Footer: React.FC = () => (
  <footer className="footer">
    <div className="container footer__inner">
      <p>© {new Date().getFullYear()} Cypadi. All rights reserved.</p>
      <div className="socials">
        <a href="#" aria-label="Twitter" className="icon-link">
          <FiTwitter />
        </a>
        <a href="#" aria-label="GitHub" className="icon-link">
          <FiGithub />
        </a>
        <a href="#" aria-label="LinkedIn" className="icon-link">
          <FiLinkedin />
        </a>
      </div>
    </div>
  </footer>
);
