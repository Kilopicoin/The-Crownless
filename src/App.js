/* eslint-env es2020, browser */

import React, { useEffect, useState, useMemo } from "react";
import {
  BrowserRouter as Router, Routes, Route, Link,
  useNavigate, useLocation,
} from "react-router-dom";
import {
  BrowserProvider, formatUnits, parseUnits,
} from "ethers";
import { getContract, getSignerContract, contractAddress } from "./contractbnb";
import { getusdtbnbSignerContract } from "./usdtcontractbnb";
import { getusdcbnbSignerContract } from "./usdccontractbnb";
import "./App.css";
import "./profil.css";
// App.js başında diğer importların yanına ekle
import roadmapImg from "./assets/roadmap.png";
import MapInteractive from "./MapInteractive";
import TokenShards, { ALLOCATION_COLORS } from "./TokenShards";

import HeroBanner from "./HeroBanner";
import ProfilePage from "./ProfilePage";   // ⇦ yeni
import Footer from "./Footer";                // ①  ────── new
import iconSkill from "./assets/bir.png";
import iconHouse from "./assets/iki.png";
import iconOwn   from "./assets/uc.png";
import iconGuild from "./assets/dort.png";

/* ----------------- DİKKAT: Aşağıdaki adresler mevcut haliyle korundu ----------------- */
const ADMIN_ADDRESS   = "0x648aC85C1FA2E117Ab1d2B30f145361c80D00213";
const ZERO_ADDRESS    = "0x0000000000000000000000000000000000000000";


  const hasMetaMask = typeof window !== "undefined" && !!window.ethereum && !!window.ethereum.isMetaMask;
  
const WHITEPAPER_URL = "https://the-crownlesss-organization.gitbook.io/the-crownless/"; // <-- put your link here


export const RING_Y = [298, 370, 442, 516, 588];
/* ───────────── Dark-Fantasy ROADMAP (concise) ───────────── */
const ROADMAP = [
  {
    year: 2026,
    q12Title: "2026 Q1–Q2",
    q34Title: "2026 Q3–Q4",
    q12: [
      {
        icon: "🩸",
        text: "Crownless-Origins PvP Arena",
        desc:
          "Unreal combat prototype goes live with timing-first duels. Phase I community forms and Ember Scribe starts."
      }
    ],
    q34: [
      {
        icon: "🜏",
        text: "Fourgebound closed alpha",
        desc:
          "Marketplace MVP and $CROWN rails launch. Early mini-game sales fund testing; balance telemetry comes online."
      }
    ]
  },
  {
    year: 2027,
    q12Title: "2027 Q1–Q2",
    q34Title: "2027 Q3–Q4",
    q12: [
      {
        icon: "🛡️",
        text: "Fourgebound full release",
        desc:
          "Complete crafting loop and clan shops open the economy. Governance trials begin with Ashwarden v0.5."
      }
    ],
    q34: [
      {
        icon: "🔥",
        text: "Reignfall launch",
        desc:
          "Region control and new biomes; mini-games sync to main."
      },
      {
        icon: "☠️",
        text: "The Crownless closed alpha",
        desc:
          "Mass tests reinforce warfare and anti-cheat."
      }
    ]
  },
  {
    year: 2028,
    q12Title: "2028 Q1–Q2",
    q34Title: "2028 Q3–Q4",
    q12: [
      {
        icon: "🌑",
        text: "The Crownless public alpha",
        desc:
          "On-chain economy with mint/burn items goes live. Ashwarden 1.0 balances world health for wider testing."
      }
    ],
    q34: [
      {
        icon: "🌀",
        text: "The Crownless beta",
        desc:
          "Land sales and housing open. Open-world sieges expand as the AI Chronicle library grows."
      }
    ]
  },
  {
    year: 2029,
    q12Title: "2029 Q1–Q2",
    q34Title: "2029 Q3–Q4",
    q12: [
      {
        icon: "⚙️",
        text: "Pre-launch preparations",
        desc:
          "Server load testing, console port prototypes and certification prep. Go-to-market: “Every Step Leaves a Story.”"
      }
    ],
    q34: [
      {
        icon: "🗡️",
        text: "The Crownless 1.0 (Q3)",
        desc:
          "SDAO economy goes live; seasons guide play."
      },
      {
        icon: "📜",
        text: "First major content patch (Q4)",
        desc:
          "New raids and events; Esports League revealed."
      }
    ]
  },
  {
    year: 2030,
    q12Title: "2030 Q1–Q2",
    q34Title: "2030 Q3–Q4",
    q12: [
      {
        icon: "🕯️",
        text: "GravenKing standalone story pack",
        desc:
          "Cinematic single-shot campaign in Crownless mythos with signature bosses and bespoke mechanics. Steam/Epic cross-promo."
      }
    ],
    q34: [
      {
        icon: "♾️",
        text: "Ecosystem 2.0",
        desc:
          "Mobile companion for trading and management; full console release. Mod SDK and a community creator fund."
      }
    ]
  }
];

function ObeliskRoadmap() {
  const [active, setActive] = useState(null);
  const toggle = (yr) => setActive((a) => (a === yr ? null : yr));

  return (
    <section className="obelisk-sec" data-active={active}>
      <div className="obelisk-img-wrap">
        <img src={roadmapImg} alt="Roadmap Obelisk" className="obelisk-img sm" />
        <h2 className="sec-title obelisk-title">Saga RoadMap</h2>
        {ROADMAP.map((y, i) => (
          <button
            key={y.year}
            className="ring-btn"
            style={{ top: `${RING_Y[i]}px`, left: "50%" }}
            onClick={() => toggle(y.year)}
          >
            {y.year}
          </button>
        ))}
      </div>

      {active && (() => {
        const yearObj = ROADMAP.find((y) => y.year === active);
        const q12Title = `${active} Q1–Q2`;
        const q34Title = `${active} Q3–Q4`;

        const HalfCard = ({ side, list, title }) => {
          const isOne = (list?.length || 0) <= 1;
          const nodes = (list || []).slice(0, 2);

          return (
            <aside className={`rm-card ${side} ${isOne ? "one-item" : "two-items"}`}>
              <h3 className="rm-hdr">{title}</h3>
              {nodes.map((m, k) => (
                <div key={k} className="rm-item">
                  <p className="rm-item-title"><span>{m.icon}</span> {m.text}</p>
                  <p className={isOne ? "rm-sub rm-sub--one" : "rm-sub rm-sub--two"}>{m.desc}</p>
                </div>
              ))}
              <div className="rm-spacer" aria-hidden="true" />
            </aside>
          );
        };

        return (
          <>
            <HalfCard side="left"  list={yearObj.q12} title={q12Title} />
            <HalfCard side="right" list={yearObj.q34} title={q34Title} />
          </>
        );
      })()}
    </section>
  );
}

/* ──────────  TOKEN ECONOMY  ────────── */
const TOTAL_SUPPLY = 700_000_000; // 700 M CRLS
const tokenDist = [
  { name: "Team & Advisors",          pct: 3  },
  { name: "Treasury",                 pct: 6  },
  { name: "Community Rewards",        pct: 3  },
  { name: "Ecosystem & Partnerships", pct: 3  },
  { name: "Liquidity ( CEX&DEX )",    pct: 15 },
  { name: "Public Sale",              pct: 70 },
];

/* ───────────  PART LABELS  ─────────── */
const PART_LABELS = [
  "Lore & Worldbuilding", "Visual Identity & Branding",
  "Game Systems Design", "UI/UX Foundations",
  "Core Infrastructure & Backend", "Crafting Mini-Game",
  "Social & Identity System", "Exploration Mechanics",
  "NFT System Integration", "PvE Combat Core",
  "Trading & Economy Layer", "PvP Mini-Game",
  "Event & Dynamic World System", "Housing & Ownership Systems",
  "Full MMO Integration", "Alpha Testing & Launch Prep"
];

const TokenEconomy = () => (
  <section className="token-sec">
    <h2 className="sec-title">Token&nbsp;Economy</h2>
    <div className="token-flex">
      <TokenShards />
      <table className="token-table">
        <thead><tr><th>Allocation</th><th>%</th><th>CRLS</th></tr></thead>
        <tbody>
          {tokenDist.map((d) => (
            <tr key={d.name}>
              <td>
                <span className="color-dot" style={{ background: ALLOCATION_COLORS[d.name] ?? "#888" }} />
                {" "}{d.name}
              </td>
              <td>{d.pct}%</td>
              <td>{(TOTAL_SUPPLY * d.pct / 100).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

/* ───────────────  CORE TEAM  ─────────────── */
const team = [
  { img: "knight1.png", name: "Cem Tosun",          role: "Founder and Creative Director",  focus:"Game vision, core mechanics" },
  { img: "knight2.png", name: "Bilal Tekmil",       role: "Co-Founder and Engineering Lead",   focus:"Game mechanics, Web3 systems integration" },
  { img: "knight3.png", name: "Necdet Öncegil",     role: "Technical Lead",     focus:"Architecture, technical feasibility" },
  { img: "knight4.png", name: "Mesut Demirtaş",     role: "Art Director",       focus:"Visual style, concept art" },
  { img: "knight5.png", name: "Kıvılcım Hindistan", role: "Project Lead",       focus:"Timeline planning, cross-team coordination" },
  { img: "knight6.png", name: "Ömer Çulcu",         role: "Community Lead",     focus:"Community growth, analytics, visibility" },
  { img: "knight7.png", name: "Göktuğ Çağrıcı",     role: "Business Lead",      focus:"Partnerships, investor & partner relations" },
];
export const TeamSection = () => {
  const lead   = team.slice(0, 2);
  const others = team.slice(2);
  return (
    <section className="team-sec">
      <h2 className="sec-title">Core&nbsp;Team</h2>
      <div className="team-leads">
        {lead.map(m => (
          <article key={m.name} className="team-card">
            <img src={require(`./assets/${m.img}`)} alt={m.name} />
            <h4>{m.name}</h4>
            <p className="role">{m.role}</p>
            <p className="focus">{m.focus}</p>
          </article>
        ))}
      </div>
      <div className="team-grid">
        {others.map(m => (
          <article key={m.name} className="team-card">
            <img src={require(`./assets/${m.img}`)} alt={m.name} />
            <h4>{m.name}</h4>
            <p className="role">{m.role}</p>
            <p className="focus">{m.focus}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

/* ── FEATURE GRID ───────────────────── */
const FeatureIconsGrid = () => {
  const feats = [
    {
      img: iconSkill,
      title: "Skill Combat",
      text:
        "Reactive, timing-based melee and ranged fighting where mastery matters. Animation canceling, stamina control, and weapon proficiencies define every duel. Armor types and positioning shape damage layers, keeping PvP and PvE high-stakes and deeply rewarding.",
    },
    {
      img: iconHouse,
      title: "Player Housing",
      text:
        "Claim land and build functional structures that grow with you. Decorate interiors, run workshops, and grant clan access. Fortify walls, gates, and traps to withstand raids, while your home economy powers crafting, rentals, and trade.",
    },
    {
      img: iconOwn,
      title: "True Ownership",
      text:
        "Items exist as verifiable on-chain assets with traceable scarcity and series. Trade peer-to-peer on an open marketplace, migrate across modes, and retain provenance. Your gear is portable, transparent, and genuinely transferable.",
    },
    {
      img: iconGuild,
      title: "Guild Wars",
      text:
        "Persistent territory wars reshape the map through sieges, logistics, and diplomacy. Forge alliances or impose vassalage and tribute. Seasonal leagues and rewards drive long-term rivalry as captured regions influence taxes and market share.",
    },
  ];
  return (
    <section className="feat-grid">
      {feats.map(({ img, title, text }) => (
        <figure key={title}>
          <img src={img} alt="" className="icon-img" width="56" height="56" loading="lazy" />
          <figcaption>{title}</figcaption>
          <p className="feat-text">{text}</p>
        </figure>
      ))}
    </section>
  );
};

/* ──────────────────────────────────────────  Constants ────────────────── */
const MIN_LOP         = 100;
const PARTS_COUNT     = 16;


// === Rounds (from your image) ===
const ROUND_PRICES_USD = [
  0.0075, 0.0080, 0.0085, 0.0090,
  0.0095, 0.0100, 0.0105, 0.0110,
  0.0115, 0.0120, 0.0125, 0.0130,
  0.0135, 0.0140, 0.0145, 0.0150,
];


// Targets in USD (18 decimals) per round (precalculated to avoid float drift)
const TARGETS = [
  75000n, 116000n, 161500n, 211500n,
  266000n, 325000n, 388500n, 456500n,
  529000n, 606000n, 687500n, 773500n,
  864000n, 959000n, 1058500n, 1162500n
].map(v => v * 10n ** 18n); // 18 decimals

// Helper to read price for a round as number
const priceForPart = (i) => ROUND_PRICES_USD[i] ?? ROUND_PRICES_USD[ROUND_PRICES_USD.length - 1];



/* Ağ & Token tanımı (UI amaçlı). Sadece Harmony-LOP/ONE aktif. */
const CHAINS = [
  {
    id: "BSC",
    label: "BNB Chain",
    tokens: [
      { symbol: "USDC",  label: "USDC (BEP20)",  kind: "bep20", enabled: true },
      { symbol: "USDT", label: "USDT (BEP20)",  kind: "bep20",  enabled: true }
    ]
  }
];



/* ─────────────────────────  Reusable UI  ──────────────────────────────── */


const NavBar = ({ isAdmin }) => {
  const nav = useNavigate();
  return (
    <nav className="main-nav">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/token">Token</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        {isAdmin && (
          <li>
            <button className="admin-menu-btn" onClick={() => nav("/admin")}>
              Admin
            </button>
          </li>
        )}
         <li>
   <a
     href={WHITEPAPER_URL}
     target="_blank"
     rel="noopener noreferrer"
   >
     Whitepaper
   </a>
 </li>
      </ul>
    </nav>
  );
};

/* ========= LANDING PAGE ========= */
const LandingHome = ({ presale }) => (
  <>
    <HeroBanner />
    <div className="home-wrap single-col">
      <aside className="info-column">
        <h1 className="game-title hide-on-hero">The Crownless</h1>
        <p className="intro intro-short">
          <em>
            “The Crownless is a dark fantasy realm shaped by player choice from frozen fjords to embered calderas. 
            Survive, gather power, and carve a legend that can outlast fallen empires.”
          </em>
        </p>
        <blockquote className="lore-quote top">
          <em>“Power is not bestowed by crowns, but forged in ash and blood.”</em>
        </blockquote>
        <FeatureIconsGrid />
      </aside>
    </div>

    <MapInteractive />
    <ObeliskRoadmap />
    <TokenEconomy />
    <TeamSection />
    <Footer />
  </>
);

/* ─────────────────────────  Levels Table  ─────────────────────────────── */
const LEVELS = [
  { lvl: 1,        min: 100,    max: 499,     nft: "Tier 1 NFT"  },
  { lvl: 2,        min: 500,    max: 1_999,   nft: "Tier 2 NFT"  },
  { lvl: 3,        min: 2_000,  max: 6_999,   nft: "Tier 3 NFT"    },
  { lvl: 4,        min: 7_000,  max: 19_999,  nft: "Tier 4 NFT" },
  { lvl: 5,        min: 20_000, max: 49_999,  nft: "Tier 5 NFT"  },
  { lvl: "Premium",min: 50_000, max: 100_000 ,nft: "Premium NFT"  },
];
const LevelsTable = () => (
  <>
    <h2 className="lvl-title">Reward Tiers</h2>
    <table className="level-table">
      <thead>
        <tr><th>Tier</th><th>Cumulative Spend ($)</th><th>NFT Reward</th></tr>
      </thead>
      <tbody>
        {LEVELS.map(l => {
          const label = typeof l.lvl === "number" ? `${l.lvl}` : l.lvl;
          const range = l.max === Infinity ? `${l.min.toLocaleString()}+` : `${l.min.toLocaleString()} – ${l.max.toLocaleString()}`;
          return (
            <tr key={label}>
              <td>{label}</td><td>{range}</td><td>{l.nft}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
    <p className="lvl-note">
      * Level is based on your <strong>cumulative</strong> spending during the pre-sale.
    </p>
  </>
);

/* ─────────────────────────  Presale Card (EN – UPDATED, compact dropdown)  ───────────────────────── */
const PresaleCard = ({ presale, provider, account, connectWallet }) => {
 const [showCongrats, setShowCongrats] = useState(false);
 const [lastBuy, setLastBuy] = useState({ amt: "", sym: "" });
  
const isConnected = !!account; // we set this when user connects

  const loc = useLocation();

  const [paused, setPaused]           = useState(false);
  const [part, setPart]               = useState(0);
  const [partPct, setPartPct]         = useState(0);
  const [ended, setEnded]             = useState(false);

 const [chain, setChain] = useState(() => CHAINS[0]); // BSC
 const [asset, setAsset] = useState(() => CHAINS[0].tokens[0]); // USDC default
 const canPay = chain.id === "BSC" && asset.enabled && (asset.symbol === "USDT" || asset.symbol === "USDC");

  const [amount, setAmount]           = useState("");
  const [status, setStatus]           = useState("");
  const [loading, setLoading]         = useState(false);
  const [refAddr, setRefAddr]         = useState(() => new URLSearchParams(loc.search).get("ref") ?? "");
  const [myAddr, setMyAddr]           = useState("");

const [maintenance, setMaintenance] = useState(false);
const LISTING_PRICE_USD = 0.03;
// inside PresaleCard component state:
const [netUsd, setNetUsd] = useState("0.00");


  // Convert round USD price => tokensPerStable_1e18 (BigInt) without float drift.
// tokensPerStable = 1 / price; scaled by 1e18.
// We do (1e24 / (price * 1e6)) to stay in integer math.
const priceUsdToTokensPerStable1e18 = (usdPrice) => {
  const micro = Math.round(usdPrice * 1_000_000);      // e.g. 0.0075 -> 7500
  const DEN = BigInt(micro);                            // 7,500
  const NUM = 1_000_000n * 10n ** 18n;                  // 1e24
  return NUM / DEN;                                     // floor division BigInt
};

// Optional tolerance (ppm = parts-per-million). 5000 ppm ≈ 0.5%.
// This avoids false alarms due to integer division/rounding.
const approxEqPpm = (a, b, ppm = 5000n) => {
  const A = BigInt(a), B = BigInt(b);
  const diff = A > B ? A - B : B - A;
  // Compare diff <= max(A,B) * ppm / 1e6  (guard zero)
  const ref = (A > B ? A : B);
  if (ref === 0n) return A === B;
  return (diff * 1_000_000n) <= (ref * ppm);
};



  useEffect(() => {
    setMyAddr(account ?? "");
  }, [account]);


    useEffect(() => {
  const pull = async () => {
    if (!presale) return;

    const isPaused = await presale.paused();
    const netWei   = await presale.netContributed(); // BigNumberish

    setNetUsd(
  Number(formatUnits(netWei)).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
);


    // Determine current round from cumulative targets
    let cum = 0n;
    let idx = 0;
    while (idx < PARTS_COUNT && (cum + TARGETS[idx]) <= BigInt(netWei)) {
      cum += TARGETS[idx];
      idx++;
    }

    const endedAll  = idx >= PARTS_COUNT;
    const inPartWei = endedAll ? 0n : (BigInt(netWei) - cum);
    const tgtWei    = endedAll ? 1n : TARGETS[idx];

    const pct       = endedAll ? 100 : Number((inPartWei * 100n) / tgtWei);

    setPaused(isPaused);
    setEnded(endedAll);
    setPart(endedAll ? PARTS_COUNT - 1 : idx);
    setPartPct(pct);


    // ======== NEW: on-chain price vs frontend round price ========
    // Contract stores "tokens per 1 stable" scaled by 1e18.
    const onChain = await presale.priceTokensPerStable_1e18(); // BigNumberish
    if (!endedAll) {
      const expected = priceUsdToTokensPerStable1e18(ROUND_PRICES_USD[idx]);
      setMaintenance(!approxEqPpm(onChain, expected, 5000n)); // 0.5% tolerance
    } else {
      setMaintenance(false); // sale ended; no need to warn
    }
  };

  pull();
  const t = setInterval(pull, 20_000);
  return () => clearInterval(t);
}, [presale]);




  // Ağ değişince: varsayılan seçilebilir token’a geç
  useEffect(() => {
    const firstEnabled = chain.tokens.find(t => t.enabled) || chain.tokens[0];
    setAsset(firstEnabled);
  }, [chain]);

   const buy = async () => {
  if (!amount) return;



  
    if (!isConnected) {
      await connectWallet();
      if (!window.ethereum || !provider) return; // user cancelled or no MM
    }
  if (paused) return setStatus("Pre-sale is paused");
  if (maintenance) return setStatus("Maintenance work is being carried out on the site, service will resume very soon.");
  if (!canPay) return setStatus("This network/asset is not active yet.");

  const amtNum = +amount;
  if (!Number.isFinite(amtNum) || amtNum <= 0) {
    return setStatus("Enter a valid amount.");
  }

  setLoading(true);
  setStatus("Awaiting wallet confirmation…");

  try {
    const contractSigner = await getSignerContract();

    // use your configured constant
    const spender = contractAddress;

    // validate referral (must be 42 chars long and hex)
    const ref =
      /^0x[a-fA-F0-9]{40}$/.test(refAddr ?? "") ? refAddr : ZERO_ADDRESS;

    // amount (assume 18 decimals for USDT/USDC on BSC)
    const amtWei = parseUnits(amount, 18);

    const TokencontractSigner = asset.symbol === "USDT" ? await getusdtbnbSignerContract() : await getusdcbnbSignerContract();


        const Allowancetx = await TokencontractSigner.increaseAllowance(
          spender,
          amtWei
        );
        await Allowancetx.wait();


    // contribute
    if (asset.symbol === "USDT") {
      setStatus("Contributing (USDT) …");
      const tx = await contractSigner.contributeUsdt(amtWei, ref);
      await tx.wait();
    } else if (asset.symbol === "USDC") {
      setStatus("Contributing (USDC) …");
      const tx = await contractSigner.contributeUsdc(amtWei, ref);
      await tx.wait();
    } else {
      setLoading(false);
      return setStatus("This asset is not enabled.");
    }

   setAmount("");
   setStatus("");
   setLastBuy({ amt: amount, sym: asset.symbol });
   setShowCongrats(true);
  } catch (e) {
    setStatus(e?.shortMessage ?? e?.message ?? "Transaction failed");
  } finally {
    setLoading(false);
  }
};




  const copyRef = async () => {
  if (!refUrl || loading) return;
  try {
    await navigator.clipboard.writeText(refUrl);
    setStatus("Link copied 📋");
  } catch {
    setStatus("Clipboard blocked");
  }
};


  // Basit overlay stilleri (inline)
  const overlayStyle = {
    position: "fixed", inset: 0, background: "rgba(0,0,0,.6)",
    display: "grid", placeItems: "center", zIndex: 10000
  };
  const boxStyle = {
    background: "var(--clr-surface)", color: "var(--clr-text-main)",
    border: "1px solid var(--clr-border)", borderRadius: 8,
    padding: "16px 20px", minWidth: 220, textAlign: "center",
    boxShadow: "0 10px 28px rgba(0,0,0,.55)"
  };

  const pct     = Math.max(0, Math.min(100, Math.round(partPct)));
const prevId  = part > 0 ? (part)     : null;           // previous round display id
const nextId  = part < PARTS_COUNT - 1 ? (part + 2) : null; // next round display id

const refUrl = React.useMemo(
  () => (myAddr ? `${window.location.origin}/?ref=${myAddr}` : ""),
  [myAddr]
);

  return (
    <section className="presale-card">
      <header><h1>Crownless Pre-Sale</h1></header>

      {ended ? (
        <p>Pre-sale complete — thank you!</p>
      ) : paused ? (
        <p className="paused-banner">⚠️ Maintenance work is being carried out on the site, service will resume very soon. </p>
      ) : (
        <>
          <p style={{ marginBottom: "15px"}}><strong>Round:</strong> 
          {part + 1}/{PARTS_COUNT} → <strong className={"part-title" + ((part === 5 || part === 11) ? " highlight" : "")}>{PART_LABELS[part]}</strong></p>

        


           <div className="price-line">
  <span><strong>Current Price:</strong> ${priceForPart(part).toFixed(4)}</span>
  <span className="price-line__right"><strong>Listing Price:</strong> ${LISTING_PRICE_USD.toFixed(2)}</span>
</div>

          <div className="round-progress" role="progressbar"
     aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
     aria-label={`Round progress ${pct}%. ${prevId ? `Previous round ${prevId}. ` : ""}${nextId ? `Next round ${nextId}.` : ""}`}>
  <progress value={pct} max="100" />

  {/* LEFT: previous round id */}
  <span className="round-progress__edge round-progress__edge--left">
    ← Round {prevId ?? "0"}
  </span>

  {/* CENTER: percent */}
  <span className="round-progress__label">Round {prevId+1}: {pct}%</span>

  {/* RIGHT: next round id */}
  <span className="round-progress__edge round-progress__edge--right">
    Round {nextId ?? "End"} →
  </span>
</div>
         
    <p className="net-line">
  <strong>USD Raised:</strong> ${netUsd} / $8,640,000.00
</p>

        



          {/* ========= NEW: Ağ & Token seçim (compact dropdown) ========= */}
          <div className="pay-row">
            <label className="select-group">
              <span className="pay-hdr">Network</span>
              <select
                className="select"
                value={chain.id}
                onChange={(e) => {
                  const next = CHAINS.find(c => c.id === e.target.value);
                  if (next) setChain(next);
                }}
              >
                {CHAINS.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </label>

            <label className="select-group">
              <span className="pay-hdr">Asset</span>
              <select
                className="select"
                value={asset.symbol}
                onChange={(e) => {
                  const t = chain.tokens.find(x => x.symbol === e.target.value);
                  if (t && t.enabled) setAsset(t);
                }}
              >
                {chain.tokens.map(t => (
                  <option key={t.symbol} value={t.symbol} disabled={!t.enabled}>
                    {t.label}{!t.enabled ? " (soon)" : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {(!canPay) && (
            <p className="pay-hint">
              Only <strong>Harmony</strong> with <strong>LOP</strong> or <strong>ONE</strong> is active for now.
            </p>
          )}

          <input
            type="text"
            placeholder="Referral address (optional)"
            value={refAddr}
            onChange={e=>setRefAddr(e.target.value)}
            disabled={paused || loading}
          />
          <input
            type="number"
            min={MIN_LOP}
            placeholder={`Amount in ${asset.symbol}`}
            value={amount}
            onChange={e=>setAmount(e.target.value)}
            disabled={paused || loading}
          />

          {(() => {
            // Decide label and click behavior
            if (!hasMetaMask) {
              return (
                <button
                  onClick={() => window.open("https://metamask.io/download", "_blank", "noopener")}
                >
                  Install MetaMask
                </button>
              );
            }
            if (!isConnected) {
              return (
                <button onClick={connectWallet}>
                  Connect MetaMask
                </button>
              );
            }
            // Connected: normal contribute flow
            return (
              <button
                onClick={buy}
                disabled={paused || loading || !canPay || maintenance}
              >
                {loading ? "Processing…" : `Contribute with ${asset.symbol}`}
              </button>
            );
          })()}

        </>
      )}

      {maintenance && (
  <p className="paused-banner">
    Maintenance work is being carried out on the site, service will resume very soon.
  </p>
)}

      {myAddr && (
  <p className="ref-line">
    Your Referral link <br/>
    <code
      className="copyable"
      role="button"
      tabIndex={0}
      onClick={copyRef}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && copyRef()}
      title="Click to copy"
      aria-label="Referral link, click to copy"
    >
      {refUrl}
    </code>
  </p>
)}


      {status && <p className="status">{status}</p>}

      {loading && (
        <div style={overlayStyle} role="dialog" aria-busy="true" aria-live="polite">
          <div style={boxStyle}>
            <svg
              width="44" height="44" viewBox="0 0 50 50"
              style={{ margin: "0 auto 10px", display: "block", color: "var(--clr-accent-flame)" }}
            >
              <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="4" />
              <g>
                <path d="M25 5 a20 20 0 0 1 0 40" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 25 25"
                  to="360 25 25"
                  dur="0.9s"
                  repeatCount="indefinite"
                />
              </g>
            </svg>
            <div style={{ fontWeight: 600, color: "var(--clr-accent-gold)" }}>
              {status || "Processing…"}
            </div>
          </div>
        </div>
      )}




     {showCongrats && (
       <div style={{
         position:"fixed", inset:0, zIndex:10001,
         display:"grid", placeItems:"center",
         background:"rgba(0,0,0,.75)",
         backdropFilter:"blur(4px)"
       }}
         role="dialog" aria-modal="true" aria-label="Contribution success"
       >
         <style>{`
           @keyframes pop { 0%{transform:scale(.8);opacity:0} 100%{transform:scale(1);opacity:1} }
           @keyframes confetti {
             0% { transform: translateY(-60vh) rotate(0deg); opacity: 0; }
             10% { opacity: 1; }
             100% { transform: translateY(60vh) rotate(540deg); opacity: 0; }
           }
           .cg-card {
             width:min(640px, 92vw);
             background: radial-gradient(120% 140% at 50% 0%, rgba(255,180,80,.12), rgba(0,0,0,.35)) ,
                         linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
             border:1px solid rgba(201,162,75,.35);
             box-shadow:0 30px 80px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.03);
             border-radius:20px; padding:28px 28px 24px; text-align:center;
             animation: pop .28s ease-out both;
           }
           .cg-title { font:900 2.1rem/1.15 Inter, system-ui; letter-spacing:.4px; color:#fff5dc; text-shadow:0 0 14px rgba(201,162,75,.35); }
           .cg-sub   { margin-top:.5rem; opacity:.9; }
           .cg-row   { display:flex; gap:12px; justify-content:center; margin-top:18px; flex-wrap:wrap; }
           .cg-btn {
             padding:10px 16px; border-radius:12px; font-weight:800; letter-spacing:.3px;
             border:1px solid rgba(201,162,75,.45); background:linear-gradient(90deg,#FF4800,#C9A24B);
             color:#0b0b0b; box-shadow:0 10px 26px rgba(0,0,0,.45);
           }
           .cg-btn.secondary {
             background:rgba(255,255,255,.06); color:#fff; border:1px solid rgba(255,255,255,.15);
           }
           .confetti { position:fixed; inset:0; pointer-events:none; z-index:10002; overflow:hidden; }
           .confetti i{
             position:absolute; top:-10vh; width:8px; height:12px; border-radius:2px;
             background:linear-gradient(180deg,#FF4800,#C9A24B);
             animation: confetti 2.2s ease-in forwards;
           }
         `}</style>

         {/* simple confetti sprinkles */}
         <div className="confetti" aria-hidden="true">
           {Array.from({ length: 40 }).map((_,i)=>(
             <i key={i} style={{
               left: `${(i*97)%100}%`,
               animationDelay: `${(i%10)*0.05}s`,
               transform: `translateY(-60vh) rotate(${i*37}deg)`,
               opacity: 0
             }}/>
           ))}
         </div>

         <div className="cg-card">
           <div style={{fontSize:"3rem", lineHeight:1, marginBottom:6}}>🎉</div>
           <div className="cg-title">Contribution Successful</div>
           <p className="cg-sub">
             Thank you! You contributed <strong>{lastBuy.amt} {lastBuy.sym}</strong>.
           </p>
           <div className="cg-row">
             <button className="cg-btn" onClick={() => setShowCongrats(false)}>
               Continue
             </button>
             <Link className="cg-btn secondary" to="/profile" onClick={()=>setShowCongrats(false)}>
               View Profile
             </Link>
           </div>
         </div>
       </div>
     )}




    </section>
  );
};


/* ─────────────────────────  Token Page  ──────────────────────────────── */
const TokenPage = ({ presale, provider, account, connectWallet }) => (
  <div className="home-wrap token-layout">
    <aside className="info-column">
      <h1 className="game-title">Token Pre-Sale</h1>
      <p className="intro">
        Secure your spot in the economy of The Crownless. Early supporters
        unlock exclusive NFTs and the best CRLS price tiers.
      </p>
      <LevelsTable />
    </aside>
    <div className="card-column">
      <PresaleCard
        presale={presale}
        provider={provider}
        account={account}
        connectWallet={connectWallet}
      />
    </div>
  </div>
);

/* ─────────────────────────  Admin Panel  ─────────────────────────────── */
const AdminPanel = ({ presale, provider }) => {
  const [paused, setPaused] = useState(false);
  const [rowsC, setRowsC]   = useState(null);
  const [rowsW, setRowsW]   = useState(null);
  const [progC, setProgC]   = useState(0);
  const [progW, setProgW]   = useState(0);
  const [wTok, setWTok]     = useState("LOP");
  const [wAmt, setWAmt]     = useState("");
  const [status, setStatus] = useState("");
  const [totRef, setTotRef] = useState("0");

  useEffect(() => { presale && presale.paused().then(setPaused); }, [presale]);

  const loadContributions = async () => {
    if (!presale) return;
    setRowsC(null); setProgC(0);

    const histCollected = Array(PARTS_COUNT).fill(0n);
    let curPart = 0;
    const out   = [];
    let grossWei  = 0n;

    const total = Number(await presale.contributionsCount());
    const raw   = [];
    for (let i = 0; i < total; i++) raw.push(await presale.contributions(i));

    raw.sort((a, b) => Number(a.ts) - Number(b.ts));

    for (let idx = 0; idx < raw.length; idx++) {
      const c       = raw[idx];
      const amtWei  = BigInt(c.amountEq);
      grossWei     += amtWei;

      let remainWei = amtWei;
      let tokens    = 0;
      let pIter     = curPart;

      while (remainWei > 0n && pIter < PARTS_COUNT) {
        const room = TARGETS[pIter] - histCollected[pIter];
        const take = remainWei > room ? room : remainWei;

        tokens += Number(formatUnits(take)) / priceForPart(pIter);
        histCollected[pIter] += take;

        if (histCollected[pIter] === TARGETS[pIter]) pIter++;
        remainWei -= take;
      }
      curPart = pIter;

      out.push({
        date : new Date(Number(c.ts) * 1000),
        addr : c.user,
        part : Number(c.part) + 1,
        price: priceForPart(Number(c.part)).toFixed(4),
        amt  : formatUnits(c.amountEq),
        crls  : Math.round(tokens).toLocaleString(),
      });

      if (idx % 50 === 0) setProgC(Math.round(((idx + 1) / raw.length) * 100));
    }

    out.sort((a, b) => b.date - a.date);
    setRowsC(out); setProgC(100);

    const netWei = await presale.totalCollected();
    const refWei = grossWei > netWei ? grossWei - netWei : 0n;
    setTotRef(formatUnits(refWei));
  };

  const loadWithdrawals = async () => {
    if (!presale) return;
    setRowsW(null); setProgW(0);
    const total = Number(await presale.withdrawalsCount());
    const out = [];
    for (let i = 0; i < total; i++) {
      const w = await presale.withdrawals(i);
      out.push({
        date: new Date(Number(w.ts) * 1000),
        token: w.token.toLowerCase() === ZERO_ADDRESS.toLowerCase() ? "ONE" : "LOP",
        amt: formatUnits(w.amount),
      });
      if (i % 50 === 0) setProgW(Math.round(((i + 1) / total) * 100));
    }
    out.sort((a, b) => b.date - a.date);
    setRowsW(out); setProgW(100);
  };

  const totC = useMemo(() => rowsC?.reduce((s, r) => s + +r.amt, 0).toFixed(2) ?? "0", [rowsC]);

  const togglePause = async () => {
    if (!provider || !presale) return;
    try {
      setStatus(paused ? "Resuming…" : "Pausing…");
      await (await presale.connect(await provider.getSigner()).setPaused(!paused)).wait();
      setPaused(!paused); setStatus("✅ Done");
    } catch (e) { setStatus(e.shortMessage ?? e.message); }
  };

  const doWithdraw = async () => {
    if (!presale || !provider || !wAmt) return;
    try {
      const amtWei = parseUnits(wAmt, 18);
      setStatus("Withdrawing…");
      const signer = await provider.getSigner();
      if (wTok === "LOP")
        await (await presale.connect(signer).withdrawLOP(amtWei)).wait();
      else
        await (await presale.connect(signer).withdrawONE(amtWei)).wait();
      setStatus("✅ Withdraw sent"); setWAmt("");
    } catch (e) { setStatus(e.shortMessage ?? e.message); }
  };

  return (
    <section className="admin-panel">
      <h2>Admin Panel</h2>
      <button className="pause-btn" onClick={togglePause}>
        {paused ? "Resume Pre-Sale" : "Pause Pre-Sale"}
      </button>

      <div className="withdraw-wrap">
        <select value={wTok} onChange={e => setWTok(e.target.value)}>
          <option value="LOP">LOP</option><option value="ONE">ONE</option>
        </select>
        <input type="number" placeholder="Amount"
               value={wAmt} onChange={e => setWAmt(e.target.value)} />
        <button onClick={doWithdraw}>Withdraw</button>
      </div>

      {status && <p className="status">{status}</p>}

      <div className="data-buttons">
        <button onClick={loadContributions}>Load Contributions</button>
        <button onClick={loadWithdrawals}>Load Withdrawals</button>
      </div>

      {!rowsC && progC > 0 && <p>Loading… {progC}%</p>}
      {rowsC && (
        <>
          <h3>Contributions — total {totC} (refs {totRef})</h3>
          <div className="table-wrap">
            <table className="adm-table">
              <thead>
              <tr><th>Date</th><th>Wallet</th><th>Part</th>
                <th>Price $</th><th>Amount</th><th>CRLS</th></tr>
              </thead>
              <tbody>
                {rowsC.map((r,i) => (
                  <tr key={i}>
                    <td>{r.date.toLocaleString()}</td><td>{r.addr}</td>
                    <td>{r.part}</td><td>{r.price}</td><td>{r.amt}</td><td>{r.crls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!rowsW && progW > 0 && <p>Loading… {progW}%</p>}
      {rowsW && (
        <>
          <h3 style={{marginTop:"1.5rem"}}>Withdrawals — total {
            rowsW.reduce((s,r)=>s+ +r.amt,0).toFixed(2)
          }</h3>
          <div className="table-wrap">
            <table className="adm-table">
              <thead><tr><th>Date</th><th>Token</th><th>Amount</th></tr></thead>
              <tbody>
                {rowsW.map((w,i) => (
                  <tr key={i}>
                    <td>{w.date.toLocaleString()}</td>
                    <td>{w.token}</td><td>{w.amt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
};

 

/* ─────────────────────────  ROOT APP  ─────────────────────────────── */
function App() {
  const [presale, setPresale]   = useState(null);
  const [provider, setProvider] = useState(null);
  const [isAdmin, setIsAdmin]   = useState(false);

  const [account, setAccount] = useState(null);

   


  const connectWallet = async () => {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      window.open("https://metamask.io/download", "_blank", "noopener");
      return;
    }
    const accts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const selected = accts?.[0] ?? null;
    setAccount(selected);
    const p = new BrowserProvider(window.ethereum);
    setProvider(p);
    setIsAdmin((selected ?? "").toLowerCase() === ADMIN_ADDRESS.toLowerCase());
    // Optional: upgrade presale to signer-backed after connect, otherwise keep read-only
    // setPresale(await getSignerContract());
  };




  useEffect(() => {
    

    setPresale(getContract());

    // If MetaMask is present, check accounts silently (no prompt).
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then(async (accts) => {
        if (accts && accts.length) {
          setAccount(accts[0]);
          const p = new BrowserProvider(window.ethereum);
          setProvider(p);
          setIsAdmin(accts[0].toLowerCase() === ADMIN_ADDRESS.toLowerCase());
        } else {
          setAccount(null); 
          setProvider(null);
          setIsAdmin(false);
        }
      });
    }

        if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accts) => {
        const a0 = accts?.[0] ?? null;
        setAccount(a0);
        if (a0) {
          setProvider(new BrowserProvider(window.ethereum));
          setIsAdmin(a0.toLowerCase() === ADMIN_ADDRESS.toLowerCase());
        } else {
          setProvider(null);
          setIsAdmin(false);
        }
      });
      window.ethereum.on("chainChanged", () => {
        // Keep read-only until user reconnects explicitly
        setAccount(null);
        setProvider(null);
      });
     }
     return () => {
       if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
       }
     };

  }, []);

  useEffect(() => {
    const hero = document.querySelector(".hero-banner");
    if (!hero) return;
    const io = new IntersectionObserver(
      ([e]) => document.body.classList.toggle("hero-exited", !e.isIntersecting),
      { rootMargin: "-70px 0px 0px 0px" }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <Router>
      <NavBar isAdmin={isAdmin} />
      <Routes>
        <Route path="/"           element={<LandingHome presale={presale} />} />
        <Route path="/token"      element={<TokenPage  presale={presale} provider={provider} account={account} connectWallet={connectWallet} />} />
        {isAdmin && (
          <Route path="/admin" element={<AdminPanel presale={presale} provider={provider} />} />
        )}
        <Route path="/profile" element={<ProfilePage presale={presale} provider={provider} account={account} connectWallet={connectWallet} />} />
      </Routes>
    </Router>
  );
}

export default App;
