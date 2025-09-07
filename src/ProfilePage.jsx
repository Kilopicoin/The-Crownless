/* eslint-env es2020, browser */

import React, { useEffect, useState, useMemo, useRef } from "react";
import { formatUnits } from "ethers";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
  PieChart,
  Pie,
  Cell,
  Sector,
  Tooltip,
} from "recharts";
import { QRCodeSVG } from "qrcode.react";






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
const priceForPart = (i) => 0.0075 + 0.0005 * i;

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

const clampPct = (v) => Math.max(0, Math.min(100, Math.round(v || 0)));

/* ==========================================================================
   TITAN GAUGE — Next Tier (PROFESSIONAL UPDATE)
   ========================================================================== */
function TitanGauge({ pct = 0, nextLabel = "", needUsd = 0 }) {
  const v = clampPct(pct);
  const data = [{ track: 100, progress: v, hotline: v }]; // 'hotline' eklendi

  // 11 tick (0..100 arası her 10%)
  const ticks = Array.from({ length: 11 }, (_, i) => 180 - i * 18);

  return (
    <div className="titan-gauge" role="img" aria-label={`Next tier progress ${v}%`}>
      <ResponsiveContainer width={220} height={160}>
        <RadialBarChart
          data={data}
          cx="50%"
          cy="100%"
          startAngle={180}
          endAngle={0}
          innerRadius="60%"
          outerRadius="100%"
          barSize={28}
        >
          <defs>
            {/* Progress Gradient */}
            <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={CROWNLESS.flame} />
              <stop offset="100%" stopColor={CROWNLESS.gold} />
            </linearGradient>
            
            {/* Hotline Gradient */}
            <linearGradient id="hotlineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={CROWNLESS.flame} stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#FFD700" /> {/* Bright Gold */}
            </linearGradient>

            {/* Track Pattern (Brushed Metal) */}
            <pattern id="trackPattern" patternUnits="userSpaceOnUse" width="6" height="6">
              <path d="M-1,1 l2,-2 M0,6 l6,-6 M5,7 l2,-2" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            </pattern>

            {/* Professional Glow Filter */}
            <filter id="professionalGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>

          {/* Arka Plan Track (Desenli) */}
          <RadialBar dataKey="track" cornerRadius={16} fill="url(#trackPattern)" background={{ fill: 'rgba(255,255,255,0.02)' }} isAnimationActive={false}/>
          
          {/* Ana İlerleme Çubuğu */}
          <RadialBar
            dataKey="progress"
            cornerRadius={16}
            fill="url(#gaugeGradient)"
            filter="url(#professionalGlow)"
            isAnimationActive
            animationDuration={950}
          />

          {/* İlerleme ucundaki parlak çizgi (Hotline) */}
          <RadialBar
            dataKey="hotline"
            cornerRadius={16}
            barSize={1} // Çok ince
            fill="url(#hotlineGradient)"
            isAnimationActive
            animationDuration={950}
          />
          
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />

          {/* Tick çizgileri (yüzdelik) */}
          <g>
            {ticks.map((ang, i) => (
              <line
                key={i}
                x1="50%" y1="100%" x2="50%" y2={i % 5 === 0 ? "82%" : "86%"}
                transform={`rotate(${ang} 50% 100%)`}
                stroke="rgba(255,255,255,.25)"
                strokeWidth={i % 5 === 0 ? 2 : 1}
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* Eksen Etiketleri (0 ve 100) */}
          <text x="8%" y="95%" textAnchor="middle" className="gauge-endpoint-label">0</text>
          <text x="92%" y="95%" textAnchor="middle" className="gauge-endpoint-label">100</text>
          
          {/* Merkez Yüzde */}
          <text x="50%" y="62%" textAnchor="middle" className="gauge-label">{v}%</text>
          
          {/* Alt Bilgi */}
          {nextLabel && (
            <text x="50%" y="76%" textAnchor="middle" className="gauge-sub">
              {needUsd > 0 ? `${needUsd.toLocaleString()} USD to ${nextLabel}` : nextLabel}
            </text>
          )}
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ==========================================================================
   AEGIS DONUT — Contributions (kalın halka, aktif dilim büyütme, dış etiket,
   yüzdeler, glow, legend)
   ========================================================================== */
function AegisDonut({ lop = 0, one = 0 }) {
  const [activeIndex, setActiveIndex] = useState(-1); // koşulsuz hook

  const total = (lop || 0) + (one || 0);
  if (total <= 0) return <p style={{ marginTop: "1rem" }}>—</p>;

  const data = [
    { name: "LOP", value: lop, key: "lop" },
    { name: "ONE", value: one, key: "one" },
  ];
  const percent = (v) => (total ? Math.round((v / total) * 100) : 0);

  const renderActive = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          filter="url(#donutGlow)"
        />
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={outerRadius + 8}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill="rgba(255,255,255,.1)"
        />
      </g>
    );
  };

  // Dış etiket renderer (isim + % + değer)
  const outerLabel = ({
    name, value, cx, cy, midAngle, outerRadius,
  }) => {
    if (!value) return null;
    const RAD = Math.PI / 180;
    const r = outerRadius + 18;
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    const pct = percent(value);
    return (
      <g>
        <text
          x={x}
          y={y}
          textAnchor={x >= cx ? "start" : "end"}
          dominantBaseline="middle"
          style={{ fill: "#fff", fontWeight: 800, fontSize: 12 }}
        >
          {name} • {pct}% • {Math.round(value).toLocaleString()}
        </text>
      </g>
    );
  };

  return (
    <div className="aegis-donut" role="img" aria-label="Contributions breakdown">
      <ResponsiveContainer width={180} height={180}>
        <PieChart>
          <defs>
            {/* Arka plan (tam halka, track) */}
            <linearGradient id="ringTrack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="rgba(255,255,255,.06)"/>
              <stop offset="100%" stopColor="rgba(255,255,255,.03)"/>
            </linearGradient>
            {/* Dilimler */}
            <linearGradient id="sliceLOP" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"  stopColor={CROWNLESS.flame}/>
              <stop offset="100%" stopColor={CROWNLESS.gold}/>
            </linearGradient>
            <linearGradient id="sliceONE" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor={CROWNLESS.steel}/>
              <stop offset="100%" stopColor={CROWNLESS.ice}/>
            </linearGradient>
            <filter id="donutGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Track ring */}
          <Pie
            data={[{ value: 1 }]}
            dataKey="value"
            innerRadius={54}
            outerRadius={78}
            fill="url(#ringTrack)"
            stroke="rgba(0,0,0,.25)"
            isAnimationActive={false}
          />

          {/* Asıl donut */}
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={54}
            outerRadius={78}
            stroke="rgba(0,0,0,.25)"
            strokeWidth={1}
            paddingAngle={data.filter(d=>d.value>0).length===2 ? 2 : 0}
            onMouseEnter={(_, i) => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(-1)}
            label={outerLabel}
            labelLine={false}
            isAnimationActive
          >
            {data.map((d) => (
              <Cell key={d.key} fill={d.key === "lop" ? "url(#sliceLOP)" : "url(#sliceONE)"} />
            ))}
            {activeIndex > -1 && (
              <Pie
                data={[data[activeIndex]]}
                dataKey="value"
                innerRadius={54}
                outerRadius={78}
                activeIndex={0}
                activeShape={renderActive}
                isAnimationActive={false}
              />
            )}
          </Pie>

          {/* merkez toplam */}
          <text x="50%" y="46%" textAnchor="middle" className="donut-total">
            {Math.round(total).toLocaleString()}
          </text>
          <text x="50%" y="61%" textAnchor="middle" className="donut-sub">
            USD-Eq
          </text>

          <Tooltip
            content={({active, payload})=>{
              if (!active || !payload || !payload.length) return null;
              const p = payload[0];
              return (
                <div className="chart-tooltip">
                  <div className="tt-name">{p.name}</div>
                  <div className="tt-value">
                    {Math.round(p.value).toLocaleString()} • {percent(p.value)}%
                  </div>
                </div>
              );
            }}
            wrapperStyle={{ outline: "none" }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="donut-legend" aria-hidden="true">
        <span className="lg lg-lop"><i /> LOP</span>
        <span className="lg lg-one"><i /> ONE</span>
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
  const [crwTotal,   setCrwTotal]   = useState(0);
  const [earnedLop,  setEarnedLop]  = useState(0n);
  const [earnedOne,  setEarnedOne]  = useState(0n);

  /* ─── Referral stats ─────────────────────────────── */
  const [refCount,   setRefCount]   = useState(0);
  const [l1Count,    setL1Count]    = useState(0);
  const [l2Count,    setL2Count]    = useState(0);

  /* ─── Diğer state ────────────────────────────────── */
  const [rows,       setRows]       = useState([]);
  const [copyMsg,    setCopyMsg]    = useState("");
  const [justLeveled,setJustLeveled]= useState(false);
  const [lopUsd,     setLopUsd]     = useState(0);
  const [oneUsd,     setOneUsd]     = useState(0);

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
     const ONEe18 = 10n ** 18n;

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
       setLopUsd(Number(formatUnits(sumUSDT, 18))); // reuse LOP slot for USDT
       setOneUsd(Number(formatUnits(sumUSDC, 18))); // reuse ONE slot for USDC
       setCrwTotal(Math.round(Number(formatUnits(sumCRLS, 18)))); // total CRLS
     }
   } catch {}



// ==== Referral earnings history (robust fetch) ====
try {
  const [usdtA, usdcA] = await Promise.all([presale.USDT(), presale.USDC()]);
  const usdtLc = usdtA.toLowerCase();
  const usdcLc = usdcA.toLowerCase();

  let items = null;

  // 1) If a batch getter exists, use it (safe no-op if absent)
  if (typeof presale.getReferralEarningsByReceiver === "function") {
    try { items = await presale.getReferralEarningsByReceiver(addr); } catch {}
  }

  if (!items) {
    // 2) Fall back to probing the auto getter: referralEarningsByReceiver(addr, i)
    const getAt = (i) => presale.referralEarningsByReceiver(addr, i);

    // Empty check
    try { await getAt(0); } catch { if (!dead) setRefRows([]); throw 0; }

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
  if (!dead) setRefRows(mapped);
} catch {}





  })();

  return () => { dead = true; };
}, [presale, addr]);

  /* ==== Level hesapları ==== */
  const levelObj = useMemo(() => {
    const usd = Number(formatUnits(eqTotal));
    for (let i = LEVELS.length - 1; i >= 0; i--)
      if (usd >= LEVELS[i].min) return LEVELS[i];
    return LEVELS[0];
  }, [eqTotal]);

  const currentUSD = useMemo(() => Number(formatUnits(eqTotal)), [eqTotal]);
  const nextObj = LEVELS.find(l => currentUSD < l.min);
  const pctToNext = nextObj
    ? Math.min(100, Math.round(((currentUSD - levelObj.min) / (nextObj.min - levelObj.min)) * 100))
    : 100;
  const needUsd = Math.max(0, (nextObj?.min ?? currentUSD) - currentUSD);
  const nextLabel = nextObj ? (typeof nextObj.lvl === "number" ? `Lv ${nextObj.lvl}` : nextObj.lvl) : "Max";

  /* ==== Copy ref link ==== */
  const copyRef = async () => {
    if (!addr) return;
    const url = `${window.location.origin}/?ref=${addr}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopyMsg("Copied ✔️");
      setTimeout(() => setCopyMsg(""), 1500);
    } catch { setCopyMsg("Blocked"); }
  };

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
        .profile-page .donut-legend .lg-lop i{ background: linear-gradient(90deg, ${CROWNLESS.flame}, ${CROWNLESS.gold}); }
        .profile-page .donut-legend .lg-one i{ background: linear-gradient(90deg, ${CROWNLESS.steel}, ${CROWNLESS.ice}); }
      `}</style>

      {/* HEADER */}
      <h2 className="sec-title">My&nbsp;Profile</h2>
      <code style={{display:"block",fontSize:".8rem",textAlign:"center",marginBottom:"1.5rem"}}>
        {addr ? `${addr.slice(0,6)}…${addr.slice(-4)}` : ""}
      </code>

      {/* ====== Ana kartlar ====== */}
      <div className="profile-cards">
        {/* Level */}
        <div className="card" style={{position:"relative"}}>
          <h4>Current Level</h4>
          <p
            className="lvl-badge"
            style={justLeveled ? { animation: "pulseGlow 1.6s ease-in-out 3" } : {}}
          >
            {typeof levelObj.lvl === "number" ? `Lv ${levelObj.lvl}` : levelObj.lvl}
          </p>
          <p>{crwTotal.toLocaleString()} CRW</p>
        </div>

        {/* Gauge (Next Tier) */}
        <div className="card" style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
          <h4 style={{marginBottom:"0.5rem"}}>Next Tier</h4>
          {nextObj ? (
            <TitanGauge pct={pctToNext} nextLabel={nextLabel} needUsd={Math.round(needUsd)} />
          ) : (
            <TitanGauge pct={100} nextLabel="Max" needUsd={0} />
          )}
        </div>

        {/* Donut (Contributions) */}
        <div className="card" style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
          <h4>Contributions<br/>(USD-Eq)</h4>
          <AegisDonut lop={lopUsd} one={oneUsd} />
          <p style={{fontSize:".8rem", marginTop:".25rem"}}>
            LOP {lopUsd.toLocaleString()} / ONE {oneUsd.toLocaleString()}
          </p>
        </div>

        {/* Referral earnings (toplam) */}
        <div className="card">
          <h4>Referral Earnings</h4>
          <p>
            {Number(formatUnits(earnedLop)).toLocaleString()} LOP<br />
            {Number(formatUnits(earnedOne)).toLocaleString()} ONE
          </p>
        </div>

        {/* Total referees (L1+L2) */}
        <div className="card">
          <h4>Total Referees</h4>
          <p>{refCount}</p>
        </div>
      </div>

      


    {/* ====== History (tabs) ====== */}
<h3 style={{ marginTop: "2rem" }}>History</h3>
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
            <th>USD</th>
            <th>CRLS</th>
            <th>Referrer</th>
            <th>Ref of Ref</th>
            <th>Price ($/CRLS)</th>
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
              <td title={`${r.price.toLocaleString(undefined,{maximumFractionDigits:6})} CRLS/$`}>
                {r.priceInv.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
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
