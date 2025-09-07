/* eslint-env es2020, browser */
import React, { useEffect, useRef, useState } from "react";
import worldPng from "./assets/world.png";
import "./mapInteractive.css";

/* ─────────────  PLACES (x,y are % of image width/height) ───────────── */
export const PLACES = [
  { id: 1,  name: "Aary Ulistine",  x: 54, y: 22, info: "A harbor city ringed by ancient fjords and ice caves." },
  { id: 2,  name: "Emberburn Tundra", x: 25, y: 72, info: "Built at the foot of an active volcano—the heart of obsidian trade." },
  { id: 3,  name: "Lowlands",       x: 33, y: 36, info: "Fertile plains and the bloodiest fronts of guild wars." },
  { id: 4,  name: "Impernal City",  x: 82, y: 56, info: "An iron capital beneath the shadow of the Saltoro range." },
  { id: 5,  name: "Zephyros Isles", x: 57.5, y: 73, info: "A chain of isles where merchant corsairs ride the wind." },
  { id: 6,  name: "Glacial Rift",   x: 72, y: 13, info: "Shattered ice chasms hiding arcane crystals." },
  { id: 7,  name: "Obsidian Muir",  x: 18, y: 85, info: "An ash-blanketed settlement woven with lava tunnels below." },
  { id: 8,  name: "Ruincel Camp",   x: 50, y: 48, info: "A nomad garrison raised atop long-abandoned ruins." },
  { id: 9,  name: "Carrowe Tarter", x: 65, y: 80, info: "Treasure-hunters’ hidden base beneath swamp mists." },
  { id: 10, name: "Shardpeaks",     x: 75, y: 25, info: "A mountain chain of glacial peaks and knife-edge crags." },
  { id: 11, name: "Frostvale",      x: 59, y: 29, info: "Hunter villages around lakes frozen most of the year." },
  { id: 12, name: "Embertrench",    x: 10, y: 75, info: "A deep, smoking lava scar wreathed in ash flats." },
  { id: 13, name: "Saltoro Pass",   x: 20, y: 35, info: "The empire’s lone mountain gateway, bristling with forts." },
  { id: 14, name: "Zevyros Deep",   x: 38, y: 65, info: "A tempestuous cove famed for whirlpools and storm shrines." },
  { id: 15, name: "Amber Caravan Road", x: 23, y: 20, info: "An old trade route of salt and amber, dotted with roadside inns." },
  { id: 16, name: "Whispering Valley",  x: 71, y: 58, info: "A foggy gorge where the wind whistles through narrow clefts." },
];

export default function MapInteractive() {
  const [active, setActive] = useState(null);
  const [legendOpen, setLegendOpen] = useState(false);

  const secRef = useRef(null);
  const startedRef = useRef(false);
  const intervalRef = useRef(null);
  const hideTimerRef = useRef(null);
  const tourIdxRef = useRef(0);

  // Bölüm görünür olunca otomatik turu başlat (sadece 1 kez)
  useEffect(() => {
    const el = secRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          startAutoTour();
        }
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startAutoTour = () => {
    clearInterval(intervalRef.current);
    clearTimeout(hideTimerRef.current);

    // Hemen ilkini göster
    tourIdxRef.current = 0;
    showOneStep();

    // Sonrakiler 2.5 sn aralıkla
    intervalRef.current = setInterval(showOneStep, 2500);
  };

  const showOneStep = () => {
    const p = PLACES[tourIdxRef.current];
    setActive(p);

    // 1.4 sn sonra kartı kapat (böylece “açılıp kapandığı için gözükür”)
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setActive(null), 1400);

    // sıradaki
    tourIdxRef.current = (tourIdxRef.current + 1) % PLACES.length;
  };

  const stopAutoTour = () => {
    clearInterval(intervalRef.current);
    clearTimeout(hideTimerRef.current);
  };

  // Kullanıcı etkileşimi olursa turu durdur
  const onUserInteract = () => {
    stopAutoTour();
  };

  // Deep-link (?map=Lowlands)
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get("map");
    if (q) {
      const hit = PLACES.find(p => p.name.toLowerCase() === q.toLowerCase());
      if (hit) { setActive(hit); onUserInteract(); }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section ref={secRef} className="map-teaser map--scroll">
      <div
        className="map-wrap"
        onMouseMove={onUserInteract}
        onClick={onUserInteract}
        onTouchStart={onUserInteract}
      >
        <img src={worldPng} alt="World map" className="map-img" />

        {PLACES.map(p => (
          <button
            key={p.id}
            className={`place-pin ${active?.id === p.id ? "is-active" : ""}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            onMouseEnter={() => { setActive(p); onUserInteract(); }}
            onMouseLeave={() => setActive(null)}
            onClick={() => { setActive(p); onUserInteract(); }}
            aria-label={`${p.name}: ${p.info}`}
          >
            <span className="pin-dot" aria-hidden>●</span>
            <span className="pin-label">{p.name}</span>
          </button>
        ))}

        {active && (
          <div
            className="place-card"
            style={{ left: `calc(${active.x}% + 1.6rem)`, top: `${active.y}%` }}
            onMouseLeave={() => setActive(null)}
            role="dialog"
            aria-live="polite"
          >
            <h4>{active.name}</h4>
            <p>{active.info}</p>
          </div>
        )}

        {/* Regions toggle & panel (biraz daha sola kaydırıldı) */}
        <button
          className="regions-toggle"
          onClick={() => setLegendOpen(v => !v)}
          aria-expanded={legendOpen}
          aria-controls="regions-panel"
          title="Open Regions"
        >
          Regions
        </button>

        <aside id="regions-panel" className={`regions-panel ${legendOpen ? "open" : ""}`}>
          <header>
            <h5>Regions</h5>
            <button className="close-x" onClick={() => setLegendOpen(false)} aria-label="Close">×</button>
          </header>
          <ul>
            {PLACES.map(p => (
              <li key={p.id}>
                <button
                  onClick={() => {
                    setActive(p);
                    setLegendOpen(false);
                    onUserInteract();
                    tourIdxRef.current = PLACES.findIndex(x => x.id === p.id);
                  }}
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <blockquote className="lore-quote top map-slogan">
  <em>“Explore five ruthless biomes…”</em>
</blockquote>

    </section>
  );
}
