/* eslint-env es2020, browser */

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router, Routes, Route, Link,
  useNavigate, useLocation,
} from "react-router-dom";
import { BrowserProvider, formatUnits, parseUnits, Contract } from "ethers";
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
const TOTAL_SUPPLY = 1_000_000_000; // 700 M CRLS
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
      * Tier is based on your <strong>cumulative</strong> spending during the pre-sale.
    </p>
  </>
);

/* ─────────────────────────  Presale Card (EN – UPDATED, compact dropdown)  ───────────────────────── */
const PresaleCard = ({ presale, provider, account, connectWallet, isConnecting, connectMsg }) => {
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




// inside PresaleCard, above useEffect and buy()
const refreshSaleState = React.useCallback(async () => {
  if (!presale) return;

  const isPaused = await presale.paused();
  const netWei   = await presale.netContributed();

  setNetUsd(
    Number(formatUnits(netWei)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );

  // figure out current round
  let cum = 0n, idx = 0;
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

  // maintenance check
  const onChain = await presale.priceTokensPerStable_1e18();
  if (!endedAll) {
    const expected = priceUsdToTokensPerStable1e18(ROUND_PRICES_USD[idx]);
    setMaintenance(!approxEqPpm(onChain, expected, 5000n));
  } else {
    setMaintenance(false);
  }
}, [presale]);


useEffect(() => {
  refreshSaleState();
}, [refreshSaleState]);



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

}, [presale]);




  // Ağ değişince: varsayılan seçilebilir token’a geç
  useEffect(() => {
    const firstEnabled = chain.tokens.find(t => t.enabled) || chain.tokens[0];
    setAsset(firstEnabled);
  }, [chain]);

   const buy = async () => {
  if (!amount) return;



  
  if (!isConnected) {
    const ok = await connectWallet();
    if (!ok || !window.ethereum || !provider) {
      setStatus(connectMsg || "Open MetaMask and approve the connection.");
      return;
    }
  }
  if (paused) return setStatus("Pre-sale is paused");
  if (maintenance) return setStatus("Maintenance work is being carried out on the site, service will resume very soon.");
  if (!canPay) return setStatus("This network/asset is not active yet.");

 const amtNum = Number(amount);
if (!Number.isInteger(amtNum) || amtNum < 100 || amtNum > 100000) {
  setStatus("Please enter a number between 100 and 100000.");
  return;
}


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

    await refreshSaleState();
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
  () => (myAddr ? `${window.location.origin}/token/?ref=${myAddr}` : ""),
  [myAddr]
);

  return (
    <section className="presale-card">
      <header><h1>CRLS Pre-Sale</h1></header>

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


          <input
            type="text"
            placeholder="Referral address (optional)"
            value={refAddr}
            onChange={e=>setRefAddr(e.target.value)}
            disabled={paused || loading}
          />
          <input
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  placeholder={`Amount in ${asset.symbol} (min:100 max:100000)`}
  value={amount}
  onChange={(e) => {
    const val = e.target.value;
    // allow only digits while typing; up to 6 digits (100000)
    if (/^\d{0,6}$/.test(val)) setAmount(val);
  }}

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
     <>
       <button onClick={async () => {
         const ok = await connectWallet();
         if (!ok) setStatus(connectMsg || "Open MetaMask to continue.");
       }} disabled={isConnecting}>
         {isConnecting ? "Waiting in MetaMask…" : "Connect MetaMask"}
       </button>
       {connectMsg && <p className="status" style={{ marginTop: 8 }}>{connectMsg}</p>}
     </>
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
  <p className="wallet-line" style={{ marginTop: 12 }}>
    <strong>Connected Wallet:</strong><br/>
    <code>{myAddr}</code>
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
const TokenPage = ({ presale, provider, account, connectWallet, isConnecting, connectMsg }) => (
  <div className="home-wrap token-layout">
    <aside className="info-column">
      <h1 className="game-title">The Crownless</h1>
      <p className="intro">
        Support the development of the project, reserve your spot, take advantage of the good price, and get special NFT rights.
      </p>
      <LevelsTable />
    </aside>
    <div className="card-column">
  <PresaleCard
    presale={presale}
    provider={provider}
    account={account}
    connectWallet={connectWallet}
    isConnecting={isConnecting}
    connectMsg={connectMsg}
  />
    </div>
  </div>
);

/* ─────────────────────────  Admin Panel  ─────────────────────────────── */
const ERC20_ABI_MIN = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

const AdminPanel = ({ presale, provider, account }) => {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const [withdrawCount, setWithdrawCount] = useState(0);
const [withdrawTotalUsdWei, setWithdrawTotalUsdWei] = useState(0n);


  // after existing useState hooks in AdminPanel:
const [globalLen, setGlobalLen] = useState(0);

// slice UI state
const [sliceStart, setSliceStart] = useState("");
const [sliceEnd, setSliceEnd] = useState("");
const [sliceRows, setSliceRows] = useState([]); // array of structs { user, token, amount, priceAtContribution }

// near your other slice UI state
const [sliceBase, setSliceBase] = useState(0); // global start index of current slice

  // status panel fields
  const [owner, setOwner] = useState("");
  const [switcher, setSwitcher] = useState("");
  const [paused, setPaused] = useState(false);
  const [switchStatus, setSwitchStatusState] = useState(false);
  const [price1e18, setPrice1e18] = useState(0n);
  const [netContribWei, setNetContribWei] = useState(0n);
  const [usdtAddr, setUsdtAddr] = useState("");
  const [usdcAddr, setUsdcAddr] = useState("");
  const [usdtBal, setUsdtBal] = useState("0");
  const [usdcBal, setUsdcBal] = useState("0");
  const [usdtSym, setUsdtSym] = useState("USDT");
  const [usdcSym, setUsdcSym] = useState("USDC");

  // owner panel inputs
  const [newPriceUsd, setNewPriceUsd] = useState(""); // USD per CRLS (e.g., 0.0100)

  const lc = (x) => (x || "").toLowerCase();
  const isOwner = account && lc(account) === lc(owner);
  const isSwitcher = account && lc(account) === lc(switcher);

  const [wdRows, setWdRows] = useState([]);


const actOwnerListWithdrawals = async () => {
  try {
    if (!isOwner) return setStatusMsg("Only owner can list withdrawals.");
    if (!presale) return;
    setLoading(true);
    setStatusMsg("Fetching all withdrawals…");
    const rows = await presale.getAllWithdrawalsUnsafe(); // UNSAFE full dump
    // normalize to plain objects (ethers v6 structs are fine, but we map for clarity)
    setWdRows(rows.map(r => ({
      timestamp: Number(r.timestamp),
      token: r.token,
      amount: r.amount // BigInt
    })));
    setStatusMsg(`✅ Loaded ${rows.length} withdrawal records`);
  } catch (e) {
    setStatusMsg(e?.shortMessage ?? e?.message ?? "Fetch failed");
  } finally {
    setLoading(false);
  }
};



  const addrEq = (a, b) => (a || "").toLowerCase() === (b || "").toLowerCase();
const tokenLabel = (addr) =>
  addrEq(addr, usdtAddr) ? usdtSym :
  addrEq(addr, usdcAddr) ? usdcSym :
  `${addr.slice(0,6)}…${addr.slice(-4)}`;


  const fmt = (wei) =>
    Number(formatUnits(wei)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  const tokensPerStableFrom1e18 = (v) => Number(v) / 1e18; // tokens per $1
  const usdPerToken = (v) => {
    const tps = tokensPerStableFrom1e18(v);
    if (!tps || !isFinite(tps)) return "0";
    return (1 / tps).toFixed(6); // display USD price per token
  };

  const priceUsdToTokensPerStable1e18 = (usd) => {
    // integer math like in your frontend contrib card
    const micro = Math.round(Number(usd) * 1_000_000); // e.g. 0.0100 -> 10000
    const DEN = BigInt(micro);
    const NUM = 1_000_000n * 10n ** 18n; // 1e24
    if (DEN === 0n) return 0n;
    return NUM / DEN; // floor
  };

  const refresh = async () => {
    if (!presale) return;
    try {
      setLoading(true);

      const [
  _owner, _switcher, _paused, _switch, _price, _net, _usdt, _usdc,
  _glen,
  _wlen,                            // 👈 NEW
  _wtotal                           // 👈 NEW
] = await Promise.all([
  presale.owner(),
  presale.switcher(),
  presale.paused(),
  presale.switchStatus(),
  presale.priceTokensPerStable_1e18(),
  presale.netContributed(),
  presale.USDT(),
  presale.USDC(),
  presale.getGlobalContributionsLength(),
  presale.getWithdrawalsLength(),         // 👈
  presale.totalWithdrawnUsd_1e18()        // 👈
]);

      setOwner(_owner);
      setSwitcher(_switcher);
      setPaused(_paused);
      setSwitchStatusState(_switch);
      setPrice1e18(BigInt(_price));
      setNetContribWei(BigInt(_net));
      setUsdtAddr(_usdt);
      setUsdcAddr(_usdc);
      setGlobalLen(Number(_glen));
      setWithdrawCount(Number(_wlen));
setWithdrawTotalUsdWei(BigInt(_wtotal));

      // read token balances (assume 18 decimals on BSC as in your app)
      if (provider) {
        const r = provider; // read-only provider
        const usdt = new Contract(_usdt, ERC20_ABI_MIN, r);
        const usdc = new Contract(_usdc, ERC20_ABI_MIN, r);

        // try to pick symbols/decimals from chain (fallbacks if fail)
        let [usdtDec, usdcDec, balUsdt, balUsdc] =
          await Promise.allSettled([
            usdt.decimals(),
            usdc.decimals(),
            usdt.balanceOf(presale.target ?? presale.address),
            usdc.balanceOf(presale.target ?? presale.address)
          ]);

        const decUSDT =
          usdtDec.status === "fulfilled" ? usdtDec.value : 18;
        const decUSDC =
          usdcDec.status === "fulfilled" ? usdcDec.value : 18;

        setUsdtSym("USDT");
        setUsdcSym("USDC");
        setUsdtBal(
          balUsdt.status === "fulfilled"
            ? Number(formatUnits(balUsdt.value, decUSDT)).toLocaleString()
            : "0"
        );
        setUsdcBal(
          balUsdc.status === "fulfilled"
            ? Number(formatUnits(balUsdc.value, decUSDC)).toLocaleString()
            : "0"
        );
      }
    } catch (e) {
      setStatusMsg(e?.shortMessage ?? e?.message ?? "Failed to load status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // also refresh periodically

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presale, provider, account]);

  /* ──────────── Actions ──────────── */
  const needSigner = async () => {
    if (!provider) throw new Error("Connect wallet first");
    return await provider.getSigner();
  };


  const actOwnerFetchSlice = async () => {
  try {
    if (!isOwner) return setStatusMsg("Only owner can fetch.");
    const s = parseInt(sliceStart, 10);
    const e = parseInt(sliceEnd, 10);
    if (!Number.isInteger(s) || !Number.isInteger(e) || s < 0 || e <= s) {
      return setStatusMsg("Enter a valid [start, end) range.");
    }
    if (!presale) return;

    setLoading(true);
    setStatusMsg("Fetching slice…");
    const rows = await presale.getGlobalContributionsSlice(s, e);

    // rows[i] = { user, token, amount, priceAtContribution }
    setSliceRows(rows.map(r => ({
      user: r.user,
      token: r.token,
      amount: r.amount,                   // BigInt (ethers v6)
      priceAtContribution: r.priceAtContribution,
    })));
    setSliceBase(s); 
    setStatusMsg(`✅ Fetched ${rows.length} records`);
  } catch (e) {
    setStatusMsg(e?.shortMessage ?? e?.message ?? "Fetch failed");
  } finally {
    setLoading(false);
  }
};


  const actOwnerPause = async () => {
    try {
      setLoading(true);
      setStatusMsg(paused ? "Resuming…" : "Pausing…");
      const signer = await needSigner();
      const tx = paused
        ? await presale.connect(signer).unpause()
        : await presale.connect(signer).pause();
      await tx.wait();
      setStatusMsg("✅ Done");
      refresh();
    } catch (e) {
      setStatusMsg(e?.shortMessage ?? e?.message ?? "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const actOwnerSetPrice = async () => {
    try {
      if (!newPriceUsd) return setStatusMsg("Enter USD price per token");
      if (!paused) return setStatusMsg("Contract must be paused");
      if (!switchStatus)
        return setStatusMsg("Switch must be ON to set price");
      const signer = await needSigner();
      setLoading(true);
      setStatusMsg("Setting price…");

      const p1e18 = priceUsdToTokensPerStable1e18(newPriceUsd);
      if (p1e18 === 0n) throw new Error("Invalid price");
      const tx = await presale
        .connect(signer)
        .setPrice(p1e18);
      await tx.wait();
      setStatusMsg("✅ Price updated");
      setNewPriceUsd("");
      refresh();
    } catch (e) {
      setStatusMsg(e?.shortMessage ?? e?.message ?? "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const actOwnerWithdrawAll = async () => {
    try {
      if (!paused) return setStatusMsg("Contract must be paused");
      if (!switchStatus)
        return setStatusMsg("Switch must be ON to withdraw");
      const signer = await needSigner();
      setLoading(true);
      setStatusMsg("Withdrawing all…");
      const tx = await presale.connect(signer).withdrawAll();
      await tx.wait();
      setStatusMsg("✅ Withdraw completed");
      refresh();
    } catch (e) {
      setStatusMsg(e?.shortMessage ?? e?.message ?? "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const actSwitcherToggle = async () => {
    try {
      const signer = await needSigner();
      setLoading(true);
      setStatusMsg("Toggling switch…");
      const tx = await presale.connect(signer).setSwitchStatus();
      await tx.wait();
      setStatusMsg("✅ Switch toggled");
      refresh();
    } catch (e) {
      setStatusMsg(e?.shortMessage ?? e?.message ?? "Action failed");
    } finally {
      setLoading(false);
    }
  };

  /* ──────────── UI ──────────── */
  const PriceRow = () => (
    <div className="kv">
      <div>Current Price</div>
      <div>
        {tokensPerStableFrom1e18(price1e18).toFixed(2)} tokens / $1
        {"  "}(
        ${usdPerToken(price1e18)} per token)
      </div>
    </div>
  );

  return (
    <>
    <div className="admin-grid">

      <section className="admin-panel">
        <h2>Status Panel</h2>

        <div className="kv"><div>Connected</div><div>{account || "—"}</div></div>
        <div className="kv"><div>Owner</div><div>{owner || "—"}</div></div>
        <div className="kv"><div>Switcher</div><div>{switcher || "—"}</div></div>
        <div className="kv"><div>Your Role</div>
          <div>{isOwner ? "Owner" : isSwitcher ? "Switcher" : "Viewer"}</div>
        </div>

        <div className="kv"><div>Paused</div><div>{paused ? "Yes" : "No"}</div></div>
        <div className="kv"><div>Switch</div><div>{switchStatus ? "ON" : "OFF"} (Should stay OFF) </div></div>
        <PriceRow />
        <div className="kv"><div>Net Contributed</div><div>${fmt(netContribWei)}</div></div>
        <div className="kv"><div>Global Contributions</div><div>{globalLen}</div></div>

<div className="kv"><div>Withdrawals</div><div>{withdrawCount}</div></div>
<div className="kv">
  <div>Total Withdrawn (USD)</div>
  <div>${Number(formatUnits(withdrawTotalUsdWei)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
</div>


        <div className="divider" />

        <div className="kv"><div>USDT Address</div><div>{usdtAddr || "—"}</div></div>
        <div className="kv"><div>USDC Address</div><div>{usdcAddr || "—"}</div></div>
        <div className="kv"><div>USDT Balance</div><div>{usdtBal}</div></div>
        <div className="kv"><div>USDC Balance</div><div>{usdcBal}</div></div>

        <div className="row">
          <button onClick={refresh} disabled={loading}>Refresh</button>
        </div>

        {statusMsg && <p className="status" style={{ marginTop: 10 }}>{statusMsg}</p>}
      </section>

      <section className="admin-panel">
        <h2>Owner Panel</h2>

        {!isOwner && <p>Connect with the <b>owner</b> wallet to use these actions.</p>}

        <div className="row">
          <button onClick={actOwnerPause} disabled={!isOwner || loading}>
            {paused ? "Unpause" : "Pause"}
          </button>
        </div>

        <div className="row">
          <input
            type="number"
            step="0.0001"
            placeholder="USD per token (e.g. 0.0100)"
            value={newPriceUsd}
            onChange={(e) => setNewPriceUsd(e.target.value)}
            disabled={!isOwner || loading}
          />
          <button
            onClick={actOwnerSetPrice}
            disabled={!isOwner || loading || !paused || !switchStatus}
            title={!paused ? "Contract must be paused" : (!switchStatus ? "Switch must be ON" : "")}
          >
            Set Price
          </button>
        </div>

        <div className="row">
          <button
            onClick={actOwnerWithdrawAll}
            disabled={!isOwner || loading || !paused || !switchStatus}
            title={!paused ? "Contract must be paused" : (!switchStatus ? "Switch must be ON" : "")}
          >
            Withdraw All (USDT & USDC)
          </button>
        </div>

<div className="row">
  Round Prices -->>
        <textarea
  readOnly
  className="rounds-pre"
  rows={ROUND_PRICES_USD.length + 1}
  value={ROUND_PRICES_USD.map((p, i) => `${i + 1}\t${p.toFixed(4)}`).join("\n")}
/>
</div>


{/* ---- links under the round prices ---- */}
<div className="row" style={{ display: "grid", gap: 6 }}>
  <div><b>USDT</b></div>
  <div>
    explorer:&nbsp;
    <a
      href="https://bscscan.com/token/0x55d398326f99059ff775485246999027b3197955"
      target="_blank"
      rel="noopener noreferrer"
    >
      https://bscscan.com/token/0x55d398326f99059ff775485246999027b3197955
    </a>
  </div>
  <div>
    coingecko:&nbsp;
    <a
      href="https://www.coingecko.com/en/coins/binance-bridged-usdt-bnb-smart-chain"
      target="_blank"
      rel="noopener noreferrer"
    >
      https://www.coingecko.com/en/coins/binance-bridged-usdt-bnb-smart-chain
    </a>
  </div>

  <div style={{ marginTop: 8 }}><b>USDC</b></div>
  <div>
    explorer:&nbsp;
    <a
      href="https://bscscan.com/token/0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"
      target="_blank"
      rel="noopener noreferrer"
    >
      https://bscscan.com/token/0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d
    </a>
  </div>
  <div>
    coingecko:&nbsp;
    <a
      href="https://www.coingecko.com/en/coins/binance-bridged-usdc-bnb-smart-chain"
      target="_blank"
      rel="noopener noreferrer"
    >
      https://www.coingecko.com/en/coins/binance-bridged-usdc-bnb-smart-chain
    </a>
  </div>
</div>

<div className="divider" />

<h3 style={{marginTop: 0}}>Global Contributions</h3>
<p style={{opacity:.8, marginTop: 0}}>
  First Record id is 0 but the count starts with 1.
</p>

<div className="row" style={{gap: 8, alignItems: "center", flexWrap: "wrap"}}>
  <input
    type="number"
    placeholder="start (inclusive)"
    value={sliceStart}
    onChange={(e) => setSliceStart(e.target.value)}
    disabled={!isOwner || loading}
    style={{minWidth: 160}}
  />
  <input
    type="number"
    placeholder="end (exclusive)"
    value={sliceEnd}
    onChange={(e) => setSliceEnd(e.target.value)}
    disabled={!isOwner || loading}
    style={{minWidth: 160}}
  />
  <button onClick={actOwnerFetchSlice} disabled={!isOwner || loading}>
    Fetch Slice
  </button>
</div>

{/* Results table */}
{sliceRows.length > 0 && (
  <div style={{overflowX: "auto", marginTop: 10}}>
    {/* Optional helper text */}
    <p style={{opacity:.8, margin: "0 0 6px"}}>
      Showing <b>{sliceBase + 1}</b>–<b>{sliceBase + sliceRows.length}</b> of <b>{globalLen}</b>
    </p>

    <table className="level-table">
      <thead>
        <tr>
          <th>#</th>
          <th>User</th>
          <th>Token</th>
          <th>Amount</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {sliceRows.map((r, i) => {
          const globalIndex = sliceBase + i; // 0-based global
          const displayNum  = globalIndex + 1; // 1-based for humans

          const amt = Number(formatUnits(r.amount, 18));
          const usd = usdPerToken(r.priceAtContribution);

          return (
            <tr key={globalIndex}>
              <td>{displayNum}</td> {/* 👈 now 21..50 for a 20..50 slice */}
              <td title={r.user}>{r.user}</td>
              <td title={r.token}>{tokenLabel(r.token)}</td>
              <td>{amt.toLocaleString(undefined, { maximumFractionDigits: 6 })}</td>
              <td><span title="USD per token">${usd}</span></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
)}

<div className="row">
  <button onClick={actOwnerListWithdrawals} disabled={!isOwner || loading}>
    List All Withdrawals (unsafe)
  </button>
</div>

{wdRows.length > 0 && (
  <div style={{ overflowX: "auto", marginTop: 10 }}>
    <p style={{ opacity: .8, margin: "0 0 6px" }}>
      Total rows: <b>{wdRows.length}</b>
    </p>
    <table className="level-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Time (UTC)</th>
          <th>Token</th>
          <th>Amount (USD)</th>
        </tr>
      </thead>
      <tbody>
        {wdRows.map((r, i) => {
          const ts = new Date(r.timestamp * 1000).toISOString().replace("T"," ").replace(".000Z"," UTC");
          const amt = Number(formatUnits(r.amount, 18)); // assumes 18d
          return (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{ts}</td>
              <td>{tokenLabel(r.token)}</td>
              <td>{amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
)}

      </section>

      <section className="admin-panel">
        <h2>Switcher Panel</h2>

        {!isSwitcher && <p>Connect with the <b>switcher</b> wallet to use these actions.</p>}

        <div className="row">
          <button onClick={actSwitcherToggle} disabled={!isSwitcher || loading}>
            Toggle Switch (currently {switchStatus ? "ON" : "OFF"})
          </button>
        </div>
      </section>
      </div>
    </>
  );
};


 

/* ─────────────────────────  ROOT APP  ─────────────────────────────── */
function App() {
  const [presale, setPresale]   = useState(null);
  const [provider, setProvider] = useState(null);
  const [isAdmin, setIsAdmin]   = useState(false);

  const [account, setAccount] = useState(null);
const [ownerAddr, setOwnerAddr]       = useState(null);
const [switcherAddr, setSwitcherAddr] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectMsg, setConnectMsg] = useState(""); // optional: surface to children if you want


  const connectWallet = async () => {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      window.open("https://metamask.io/download", "_blank", "noopener");
      return false;
    }
    if (isConnecting) {
      setConnectMsg("A connection request is already open in MetaMask.");
      return false;
    }
    setIsConnecting(true);
    setConnectMsg("");
    try {
      const accts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const selected = accts?.[0] ?? null;
      if (!selected) {
        setConnectMsg("No account selected.");
        return false;
      }
      setAccount(selected);
      const p = new BrowserProvider(window.ethereum);
      setProvider(p);
      recomputeIsAdmin(selected, ownerAddr, switcherAddr);
      return true;
    } catch (e) {
      // EIP-1193 / MetaMask codes:
      // 4001 = user rejected; -32002 = request already pending
      if (e && typeof e === "object") {
        if (e.code === 4001) setConnectMsg("Connection request was rejected.");
        else if (e.code === -32002) setConnectMsg("A connection request is already pending. Please open MetaMask to continue.");
        else setConnectMsg(e.message || "Failed to connect.");
      } else {
        setConnectMsg("Failed to connect.");
      }
      return false;
    } finally {
      // we still clear the flag so the button can be pressed again if the user closed MM window.
      setIsConnecting(false);
    }
  };

const recomputeIsAdmin = (acct, ownerA, switcherA) => {
  const a = (acct ?? "").toLowerCase();
  const o = (ownerA ?? "").toLowerCase();
  const s = (switcherA ?? "").toLowerCase();
  setIsAdmin(!!a && (a === o || a === s));
};



  useEffect(() => {
    

    setPresale(getContract());

    (async () => {
  const c = getContract();
  try {
    const [own, sw] = await Promise.all([c.owner(), c.switcher()]);
    setOwnerAddr(own);
    setSwitcherAddr(sw);
    // If an account is already known (silent connect), evaluate admin now:
    if (account) recomputeIsAdmin(account, own, sw);
  } catch (e) {
    console.warn("Failed to read owner/switcher:", e);
  }
})();


    // If MetaMask is present, check accounts silently (no prompt).
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then(async (accts) => {
        if (accts && accts.length) {
          setAccount(accts[0]);
          const p = new BrowserProvider(window.ethereum);
          setProvider(p);
        } else {
          setAccount(null); 
          setProvider(null);
          setIsAdmin(false);
        }
      });
    }

        if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accts) => {
        if (accts && accts.length) {
  setAccount(accts[0]);
  const p = new BrowserProvider(window.ethereum);
  setProvider(p);
  recomputeIsAdmin(accts[0], ownerAddr, switcherAddr);
} else {
  setAccount(null);
  setProvider(null);
  setIsAdmin(false);
}

      });
      window.ethereum.on("accountsChanged", (accts) => {
  const a0 = accts?.[0] ?? null;
  setAccount(a0);
  if (a0) {
    setProvider(new BrowserProvider(window.ethereum));
    recomputeIsAdmin(a0, ownerAddr, switcherAddr);
  } else {
    setProvider(null);
    setIsAdmin(false);
  }
});

     }
     return () => {
       if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
       }
     };

  }, [account, ownerAddr, switcherAddr]);

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
         <Route
   path="/token"
   element={
     <TokenPage
       presale={presale}
       provider={provider}
       account={account}
       connectWallet={connectWallet}
       isConnecting={isConnecting}
       connectMsg={connectMsg}
     />
   }
 />
 {isAdmin && (
   <Route
     path="/admin"
     element={<AdminPanel presale={presale} provider={provider} account={account} />}
   />
 )}
        <Route path="/profile" element={<ProfilePage presale={presale} provider={provider} account={account} connectWallet={connectWallet} />} />
      </Routes>
    </Router>
  );
}

export default App;
