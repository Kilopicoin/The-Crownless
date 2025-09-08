/* eslint-env es2020, browser */

import React, { useEffect, useState, useMemo, useRef } from "react";
import { formatUnits } from "ethers";
import {
  PieChart,
  Pie,
  Cell,
} from "recharts";






/* ------------------------------------------------------------------
   LOCAL CONSTANTS
-------------------------------------------------------------------*/
export const LEVELS = [
  { lvl: 1,        min: 100,    max: 499,     nft: "Bronze Shield"  },
  { lvl: 2,        min: 500,    max: 1_999,   nft: "Silver Dagger"  },
  { lvl: 3,        min: 2_000,  max: 6_999,   nft: "Golden Helm"    },
  { lvl: 4,        min: 7_000,  max: 19_999,  nft: "Platinum Armor" },
  { lvl: 5,        min: 20_000, max: 49_999,  nft: "Diamond Crown"  },
  { lvl: "Premium",min: 50_000, max: Infinity,nft: "Premium Relic"  },
];


/* ------------------------------------------------------------------
   CROWNLESS THEME TOKENS (grafikler için)
-------------------------------------------------------------------*/
const CROWNLESS = {
  gold:  "#C9A24B",
  flame: "#FF4800",
  ember: "#B73228",
  steel: "#2C3440",
  ice:   "#AFC3D6",
  obs:   "#0B0B0B",
};







/* ==========================================================================
   AEGIS DONUT — Contributions (kalın halka, aktif dilim büyütme, dış etiket,
   yüzdeler, glow, legend)
   ========================================================================== */
function AegisDonut({ usdt = 0, usdc = 0 }) {
  const total = (usdt || 0) + (usdc || 0);
  if (total <= 0) return <p style={{ marginTop: "1rem" }}>—</p>;

  const data = [
    { name: "USDT", value: usdt, key: "usdt" },
    { name: "USDC", value: usdc, key: "usdc" },
  ];

  return (
    <div className="aegis-donut" role="img" aria-label="Contributions breakdown">
      <PieChart width={180} height={180}>
        <defs>
          <linearGradient id="ringTrack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,.06)" />
            <stop offset="100%" stopColor="rgba(255,255,255,.03)" />
          </linearGradient>
          <linearGradient id="sliceUSDT" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={CROWNLESS.flame} />
            <stop offset="100%" stopColor={CROWNLESS.gold} />
          </linearGradient>
          <linearGradient id="sliceUSDC" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CROWNLESS.steel} />
            <stop offset="100%" stopColor={CROWNLESS.ice} />
          </linearGradient>
          <filter id="donutGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* track */}
        <Pie
          data={[{ value: 1 }]}
          dataKey="value"
          innerRadius={54}
          outerRadius={78}
          fill="url(#ringTrack)"
          stroke="rgba(0,0,0,.25)"
          isAnimationActive={false}
        />

        {/* donut */}
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={54}
          outerRadius={78}
          stroke="rgba(0,0,0,.25)"
          strokeWidth={1}
          paddingAngle={data.filter(d => d.value > 0).length === 2 ? 2 : 0}
          labelLine={false}
          isAnimationActive={false}
        >
          {data.map((d) => (
            <Cell
              key={d.key}
              fill={d.key === "usdt" ? "url(#sliceUSDT)" : "url(#sliceUSDC)"}
              filter="url(#donutGlow)"
            />
          ))}
        </Pie>

        {/* center text */}
        <text x="50%" y="46%" textAnchor="middle" className="donut-total">
          {Math.round(total).toLocaleString()}
        </text>
        <text x="50%" y="61%" textAnchor="middle" className="donut-sub">USD</text>
      </PieChart>

      {/* Legend */}
      <div className="donut-legend" aria-hidden="true">
        <span className="lg lg-usdt"><i /> USDT</span>
        <span className="lg lg-usdc"><i /> USDC</span>
      </div>
    </div>
  );
}




/* ------------------------------------------------------------------
   PROFILE PAGE
-------------------------------------------------------------------*/
export default function ProfilePage({ presale, provider }) {


  const ZERO = "0x0000000000000000000000000000000000000000";
const shortAddr = (a) =>
  !a || a.toLowerCase() === ZERO ? "—" : `${a.slice(0,6)}…${a.slice(-4)}`;

// NEW:
const [activeTab, setActiveTab] = useState("purchases"); // "purchases" | "referrals"
const [refRows, setRefRows] = useState([]);              // referral earnings rows


  const [addr,       setAddr]       = useState("");
  const [eqTotal,    setEqTotal]    = useState(0n);
  const [crlsTotal,   setCrlsTotal]   = useState(0);
 const [earnedUsdt, setEarnedUsdt] = useState(0n);
 const [earnedUsdc, setEarnedUsdc] = useState(0n);


  /* ─── Diğer state ────────────────────────────────── */
  const [rows,       setRows]       = useState([]);
  const [justLeveled,setJustLeveled]= useState(false);
  const [usdtUsd, setUsdtUsd] = useState(0);
const [usdcUsd, setUsdcUsd] = useState(0);


  /* signer address (ethers v6 güvenli yöntem) */
  useEffect(() => {
    if (!provider) return;
    (async () => {
      try {
        const s = await provider.getSigner();
        const a = await s.getAddress();
        setAddr(a);
      } catch { setAddr(""); }
    })();
  }, [provider]);
  

  /* pull data ----------------------------------------------------------------- */
 useEffect(() => {
  if (!presale || !addr) return;
  let dead = false;

  (async () => {
   // 0) Single source of truth for level (gross USD-eq, 18 decimals)
   try {
     const total = await presale.contributed(addr);
     if (!dead) setEqTotal(total);
   } catch {}

   // 1) Fetch USDT/USDC and this user’s contribution list
   try {
     const [usdtAddr, usdcAddr, list] = await Promise.all([
       presale.USDT(),
       presale.USDC(),
       presale.getAllContributions(addr),
     ]);
     const usdtLc = usdtAddr.toLowerCase();
     const usdcLc = usdcAddr.toLowerCase();

     let sumUSDT = 0n, sumUSDC = 0n, sumCRLS = 0n;
     const out = [];

     for (const c of list) {
  const tsSec   = BigInt(c.timestamp ?? 0n);
  const token   = String(c.token ?? "").toLowerCase();
  const amount  = BigInt(c.amount ?? 0n);                 // USD-eq (18d)
  const tps     = BigInt(c.priceAtContribution ?? 0n);    // CRLS per $ * 1e18
  const ref1    = String(c.referrer ?? ZERO);
  const ref2    = String(c.referrerOfReferrer ?? ZERO);

  const isUSDT  = token === usdtLc;
  const sym     = isUSDT ? "USDT" : (token === usdcLc ? "USDC" : "UNKNOWN");

  // Tokens bought = USD * (CRLS/$)
  const crlsWei = (amount * tps) / (10n ** 18n);

  if (isUSDT) sumUSDT += amount;
  else if (token === usdcLc) sumUSDC += amount;
  sumCRLS += crlsWei;

  // Inverted price: $ per 1 CRLS (keep 18d precision): (1e36 / tps) -> scaled 1e18
  const invScaled = tps > 0n ? (10n ** 36n) / tps : 0n;
  const priceInv  = Number(formatUnits(invScaled, 18));    // $ / CRLS
  const price     = Number(formatUnits(tps, 18));          // CRLS / $

  out.push({
    tsNum: Number(tsSec) * 1000,
    ts: new Date(Number(tsSec) * 1000).toLocaleString(),
    token: sym,
    usd: Number(formatUnits(amount, 18)),
    crls: Number(formatUnits(crlsWei, 18)),
    ref1, ref2,
    priceInv,  // NEW: $ per CRLS
    price,     // (optional) keep original for tooltip
  });
}


     out.sort((a, b) => b.tsNum - a.tsNum);

     if (!dead) {
       setRows(out);                               // table rows
       setUsdtUsd(Number(formatUnits(sumUSDT, 18)));
setUsdcUsd(Number(formatUnits(sumUSDC, 18)));

       setCrlsTotal(Math.round(Number(formatUnits(sumCRLS, 18)))); // total CRLS
     }
   } catch {}



// ==== Referral earnings history (robust fetch) ====
try {
  const [usdtA, usdcA] = await Promise.all([presale.USDT(), presale.USDC()]);
  const usdtLc = usdtA.toLowerCase();
  const usdcLc = usdcA.toLowerCase();
  let sumUsdt = 0n;
  let sumUsdc = 0n;
  let items = null;

  // 1) If a batch getter exists, use it (safe no-op if absent)
  if (typeof presale.getReferralEarningsByReceiver === "function") {
    try { items = await presale.getReferralEarningsByReceiver(addr); } catch {}
  }

  if (!items) {
    // 2) Fall back to probing the auto getter: referralEarningsByReceiver(addr, i)
    const getAt = (i) => presale.referralEarningsByReceiver(addr, i);

    // Empty check
 try {
   await getAt(0);
 } catch {
   if (!dead) setRefRows([]);
   // Nothing to fetch; stop this async routine here.
   return;
 }

    // Exponential grow to find an upper bound that fails
    let hi = 1;
    for (;;) {
      try {
        await getAt(hi);
        hi *= 2;
        if (hi > 4096) break; // hard cap
      } catch {
        break;
      }
    }

    // Binary search to find first failing index => length
    let lo = hi >> 1;
    let fail = hi;
    while (lo + 1 < fail) {
      const mid = (lo + fail) >> 1;
      try { await getAt(mid); lo = mid; } catch { fail = mid; }
    }
    const len = fail;

    // Fetch latest up to MAX (keep it reasonable)
    const MAX = 300;
    const start = Math.max(0, len - MAX);
    const idxs = Array.from({ length: len - start }, (_, k) => start + k);

    const raws = await Promise.all(idxs.map(i => getAt(i).catch(() => null)));
    items = raws.filter(Boolean);
  }

  // Map to display rows
  const mapped = (items || []).map((e) => {
    const ts     = BigInt(e.timestamp ?? 0n);
    const token  = String(e.token ?? "").toLowerCase();
    const amount = BigInt(e.amount ?? 0n);

    const sym  = token === usdtLc ? "USDT" : (token === usdcLc ? "USDC" : "UNKNOWN");
    const from = String(e.contributor ?? ZERO);
    const l1   = String(e.layer1Referrer ?? ZERO);


        if (token === usdtLc) sumUsdt += amount;
    else if (token === usdcLc) sumUsdc += amount;

    return {
      tsNum: Number(ts) * 1000,
      ts: new Date(Number(ts) * 1000).toLocaleString(),
      token: sym,
      usd: Number(formatUnits(amount, 18)),
      from,
      l1,
      tier: l1.toLowerCase() === addr.toLowerCase() ? "L1" : "L2",
    };
  });

  mapped.sort((a, b) => b.tsNum - a.tsNum);
  if (!dead) {
    setRefRows(mapped);
    setEarnedUsdt(sumUsdt);
    setEarnedUsdc(sumUsdc);
  }
} catch {}





  })();

  return () => { dead = true; };
}, [presale, addr]);

  /* ==== Level hesapları ==== */
  const levelObj = useMemo(() => {
    const usd = Number(formatUnits(eqTotal));
    // If below the first tier min, treat as Level 0
    if (usd < LEVELS[0].min) {
      return { lvl: 0, min: 0, max: LEVELS[0].min - 1, nft: "—" };
    }
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (usd >= LEVELS[i].min) return LEVELS[i];
    }
    // Fallback (shouldn't hit)
    return { lvl: 0, min: 0, max: LEVELS[0].min - 1, nft: "—" };
  }, [eqTotal]);

  const currentUSD = useMemo(() => Number(formatUnits(eqTotal)), [eqTotal]);


  // ---- Tier progress (same logic/UX as round-progress) ----
const isLevelZero = currentUSD < LEVELS[0].min;
const levelIndex = useMemo(() => {
  if (isLevelZero) return -1; // Level 0
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (currentUSD >= LEVELS[i].min) return i;
  }
  return -1;
}, [currentUSD, isLevelZero]);

const currTier = useMemo(() => {
  return isLevelZero
    ? { lvl: 0, min: 0, max: LEVELS[0].min - 1, nft: "—" }
    : LEVELS[levelIndex];
}, [isLevelZero, levelIndex]);

const nextTier = useMemo(() => {
  return isLevelZero ? LEVELS[0] : (LEVELS[levelIndex + 1] || null);
}, [isLevelZero, levelIndex]);

// % within the CURRENT tier (min..next.min). Premium (Infinity) => 100%
const pctInTier = useMemo(() => {
  // Premium (no next tier)
  if (!nextTier) return 100;
  const span = nextTier.min - currTier.min; // for Lv0: next.min - 0
  if (span <= 0) return 100;
  const done = currentUSD - currTier.min;   // for Lv0: current - 0
  return Math.max(0, Math.min(100, Math.round((done / span) * 100)));
}, [currentUSD, currTier, nextTier]);

// Labels like the rounds widget
const currTierLabel = typeof currTier.lvl === "number" ? `Tier ${currTier.lvl}` : String(currTier.lvl);
const prevTierLabel = levelIndex > 0
  ? (typeof LEVELS[levelIndex - 1].lvl === "number" ? `Tier ${LEVELS[levelIndex - 1].lvl}` : String(LEVELS[levelIndex - 1].lvl))
  : "—";
const nextTierLabel = nextTier
  ? (typeof nextTier.lvl === "number" ? `Tier ${nextTier.lvl}` : String(nextTier.lvl))
  : "Max";




  const nextObj = LEVELS.find(l => currentUSD < l.min);
  const needUsd = Math.max(0, (nextObj?.min ?? currentUSD) - currentUSD);



  /* ==== Seviye atlama animasyonu ==== */
  const prevLevel = useRef(levelObj.lvl);
  useEffect(() => {
    if (prevLevel.current !== levelObj.lvl) {
      setJustLeveled(true);
      prevLevel.current = levelObj.lvl;
      const t = setTimeout(() => setJustLeveled(false), 3000);
      return () => clearTimeout(t);
    }
  }, [levelObj.lvl]);

  /* ------------------------------------------------------------------
       RENDER
  -------------------------------------------------------------------*/
  return (
    <div className="profile-page single-col">
      {/* Grafik tipografisi ve küçük yardımcı stiller (scope: sadece .profile-page) */}
      <style>{`

.profile-page .ref-link-wrap code.copyable{
  cursor: pointer;
  border-bottom: 1px dashed currentColor;
  user-select: all;
  padding: 0 .2rem;
}
.profile-page .ref-link-wrap code.copyable:active{
  transform: scale(0.99);
}

        .profile-page .gauge-label{
          font: 900 1.15rem/1 Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial;
          fill: var(--ink-1, #e4e1da);
          text-shadow: 0 0 10px rgba(201,162,75,.35);
          letter-spacing: .3px;
        }
        .profile-page .gauge-sub{
          font: 700 .78rem/1 Inter, system-ui;
          fill: var(--ink-2, #b9b2a7);
        }
        .profile-page .donut-total{
          font: 900 1.08rem/1 Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial;
          fill: var(--ink-1, #e4e1da);
        }
        .profile-page .donut-sub{
          font: 700 .76rem/1 Inter, system-ui;
          fill: var(--ink-2, #b9b2a7);
        }
        .profile-page .chart-tooltip{
          background: linear-gradient(180deg, rgba(0,0,0,.72), rgba(0,0,0,.68));
          border: 1px solid rgba(201,162,75,.35);
          box-shadow: 0 10px 20px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.04);
          color: var(--ink-1, #e4e1da);
          padding: .5rem .6rem;
          border-radius: .6rem;
          min-width: 140px;
        }
        .profile-page .chart-tooltip .tt-name{
          font-weight: 800; letter-spacing:.3px; margin-bottom:.15rem; color:#fff0d8;
        }
        .profile-page .chart-tooltip .tt-value{
          font-weight: 700; color: var(--ink-1, #e4e1da);
        }
        .profile-page .donut-legend{
          display:flex; gap:.9rem; margin-top:.5rem; font-size:.8rem; opacity:.92;
        }
        .profile-page .donut-legend .lg{ display:inline-flex; align-items:center; gap:.4rem; }
        .profile-page .donut-legend .lg i{
          width:12px; height:12px; border-radius:3px; display:inline-block;
          box-shadow: 0 0 10px rgba(0,0,0,.25) inset;
        }
        .profile-page .donut-legend .lg-usdt i{ 
  background: linear-gradient(90deg, #FF4800, #C9A24B); 
}
.profile-page .donut-legend .lg-usdc i{ 
  background: linear-gradient(90deg, #2C3440, #AFC3D6); 
}

      `}</style>

      {/* HEADER */}
      <h2 className="sec-title">My&nbsp;Profile</h2>
      <code style={{display:"block",fontSize:"1rem",textAlign:"center",marginBottom:"1.5rem"}}>
        Connected Address: {addr ? `${addr.slice(0,6)}…${addr.slice(-4)}` : ""} <p>Pending CRLS: {crlsTotal.toLocaleString()}</p>
      </code>

      {/* ====== Ana kartlar ====== */}
      <div className="profile-cards profile-cards--three">
        {/* Level */}
        <div className="card" style={{position:"relative"}}>
          <h4>Current Tier</h4>
          <p
            className="lvl-badge"
            style={justLeveled ? { animation: "pulseGlow 1.6s ease-in-out 3" } : {}}
          >
            {typeof levelObj.lvl === "number" ? `Tier ${levelObj.lvl}` : levelObj.lvl}
          </p>
          


            <div
    className="round-progress"
    role="progressbar"
    aria-valuenow={pctInTier}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label={`Tier progress ${pctInTier}%. ${prevTierLabel ? `Previous ${prevTierLabel}. ` : ""}${nextTierLabel ? `Next ${nextTierLabel}.` : ""}`}
    style={{ marginTop: ".75rem" }}
  >
    <progress value={pctInTier} max="100" />

    {/* LEFT: previous tier */}
    <span className="round-progress__edge round-progress__edge--left">
      ← {prevTierLabel}
    </span>

    {/* CENTER: percent */}
    <span className="round-progress__label">
      {currTierLabel}: {pctInTier}%
    </span>

    {/* RIGHT: next tier */}
    <span className="round-progress__edge round-progress__edge--right">
      {nextTierLabel} →
    </span>
  </div>

<p className="lvl-note" style={{ marginTop: ".4rem" }}>
  {nextTier ? `${Math.round(needUsd).toLocaleString()} USD to ${nextTierLabel}` : `Max tier reached`}
</p>


        </div>



        {/* Donut (Contributions) */}
        <div className="card" style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
          <h4>Total Contribution</h4>
<AegisDonut usdt={usdtUsd} usdc={usdcUsd} />
<p style={{fontSize:".8rem", marginTop:".25rem"}}>
  USDT {usdtUsd.toLocaleString()} / USDC {usdcUsd.toLocaleString()}
</p>

        </div>

        {/* Referral earnings (toplam) */}
 <div className="card">
   <h4>Referral Earnings</h4>
   <p style={{marginBottom:".25rem"}}>
     USDT&nbsp;<strong>{Number(formatUnits(earnedUsdt, 18)).toLocaleString()}</strong><br/>
     USDC&nbsp;<strong>{Number(formatUnits(earnedUsdc, 18)).toLocaleString()}</strong>
   </p>
   <hr style={{opacity:.15, margin:"6px 0"}}/>
   <p>
     Total&nbsp;<strong>
       {Number(
         formatUnits((earnedUsdt + earnedUsdc), 18)
       ).toLocaleString()}
     </strong>&nbsp;USD
   </p>
 </div>

      </div>

      


    {/* ====== History (tabs) ====== */}
<div className="chip-list" role="tablist" aria-label="History tabs" style={{ marginBottom: ".75rem" }}>
  <button
    className={`chip ${activeTab === "purchases" ? "active" : ""}`}
    role="tab"
    aria-selected={activeTab === "purchases"}
    onClick={() => setActiveTab("purchases")}
  >
    Purchase History
  </button>
  <button
    className={`chip ${activeTab === "referrals" ? "active" : ""}`}
    role="tab"
    aria-selected={activeTab === "referrals"}
    onClick={() => setActiveTab("referrals")}
  >
    Referral Earnings History
  </button>
</div>

{activeTab === "purchases" ? (
  rows.length === 0 ? (
    <p>No contributions yet.</p>
  ) : (
    <div className="table-wrap">
      <table className="level-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Token</th>
            <th>Amount</th>
            <th>CRLS</th>
            <th>Referrer L1</th>
            <th>Referrer L2</th>
            <th>Price $</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.ts}</td>
              <td>{r.token}</td>
              <td>{r.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
              <td>{Math.round(r.crls).toLocaleString()}</td>
              <td title={r.ref1}><code>{shortAddr(r.ref1)}</code></td>
              <td title={r.ref2}><code>{shortAddr(r.ref2)}</code></td>
              <td title={`${r.price.toLocaleString(undefined,{maximumFractionDigits:4})} CRLS/$`}>
                {r.priceInv.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
) : (
  refRows.length === 0 ? (
    <p>No referral earnings yet.</p>
  ) : (
    <div className="table-wrap">
      <table className="level-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>From</th>
            <th>Token</th>
            <th>USD</th>
            <th>L1 Referrer</th>
            <th>Tier</th>
          </tr>
        </thead>
        <tbody>
          {refRows.map((r, i) => (
            <tr key={i}>
              <td>{r.ts}</td>
              <td title={r.from}><code>{shortAddr(r.from)}</code></td>
              <td>{r.token}</td>
              <td>{r.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
              <td title={r.l1}><code>{shortAddr(r.l1)}</code></td>
              <td>{r.tier}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
)}


    </div>
  );
}
