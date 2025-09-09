/* Footer.jsx */
import React from "react";
import {
  FaTwitter, FaYoutube, FaTelegramPlane,
  FaLinkedin, FaInstagram,
  FaEnvelope, FaArrowUp,
} from "react-icons/fa";

import stoneBg from "./assets/stone-bg.jpg";   // Sadece logo



/* ── Ana Footer bileşeni ─────────────────────────────── */
const Footer = () => (
  <footer className="site-footer">
    {/* ===  Hero CTA  =================================================== */}
    <section className="foot-cta">
      <h3>Forge your legend in&nbsp;<em>The Crownless</em></h3>
      <a href="/token" className="cta-btn">Join Pre-Sale</a>
    </section>

    {/* ===  Ana Grid  =================================================== */}
    <section className="foot-grid">
      {/* COL-1 : Logo & tagline */}
      <div className="fcol logo-col">
        <img src={stoneBg} alt="Crownless emblem" className="f-logo" />
        <p className="tag">
          The Crownless is a dark-fantasy MMO where kingdoms rise and fall at
          the edge of a blade.
        </p>
      </div>

      {/* COL-2 : Site map */}
      <nav className="fcol">
        <h4>Navigate</h4>
        <ul className="f-links">
          <li><a href="/">Home</a></li>
          <li><a href="/token">Token</a></li>
          <li><a href="https://the-crownlesss-organization.gitbook.io/the-crownless/"
                 target="_blank" rel="noopener noreferrer">Docs ↗</a></li>
        </ul>
      </nav>

      {/* COL-3 : Community */}
      <div className="fcol">
        <h4>Community</h4>
        <ul className="f-social">
  <li>
    <a href="https://x.com/thecrownlessX"
       target="_blank" rel="noopener noreferrer" aria-label="X">
      <FaTwitter /> X
    </a>
  </li>

  <li>
    <a href="https://www.youtube.com/@thecrownlessX"
       target="_blank" rel="noopener noreferrer" aria-label="YouTube">
      <FaYoutube /> YouTube
    </a>
  </li>

  <li>
    <a href="https://t.me/thecrownlessX"
       target="_blank" rel="noopener noreferrer" aria-label="Telegram">
      <FaTelegramPlane /> Telegram
    </a>
  </li>

  <li>
    <a href="https://www.linkedin.com/company/the-crownless/posts/?feedView=all"
       target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
      <FaLinkedin /> LinkedIn
    </a>
  </li>

  <li>
    <a href="https://www.instagram.com/thecrownlessx/"
       target="_blank" rel="noopener noreferrer" aria-label="Instagram">
      <FaInstagram /> Instagram
    </a>
  </li>
</ul>

      </div>

      {/* COL-4 : Contact */}
      <div className="fcol">
        <h4>Contact</h4>
        <address className="contact">
          <FaEnvelope aria-hidden="true" /> info@thecrownless.com<br/>
        </address>
      </div>

   
    </section>

    {/* ===  Bottom bar  ================================================ */}
    <section className="foot-bottom">
      <ul className="legal-links">

      </ul>
      <p>© 2025 The Crownless — All rights reserved.</p>
      <a href="#top" className="back-top" aria-label="Back to top"><FaArrowUp/></a>
    </section>
  </footer>
);

export default Footer;
