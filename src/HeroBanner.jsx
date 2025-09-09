/* HeroBanner.jsx */
import React from "react";
import heroVid from "./assets/hero.mp4";   // yolu ayarlayın

const HeroBanner = () => (
  <section className="hero-banner">
    {/* Arka plan video */}
    <video
      className="hero-video"
      autoPlay
      muted
      loop
      playsInline      /* iOS için */
      preload="metadata"
    >
      <source src={heroVid} type="video/mp4" />
      Tarayıcınız video etiketini desteklemiyor.
    </video>

    {/* Üstteki içerik */}
    <div className="hero-overlay">
      <h1 className="hero-title">The Crownless</h1>
      <p className="hero-sub">
      Survive in a dark world and write your own path to the throne.
      </p>
      <div className="hero-cta">
        <a href="/token" className="cta-btn">Join Pre-Sale</a>
      </div>
    </div>
  </section>
);

export default HeroBanner;
