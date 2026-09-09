import React, { useState, useEffect, useMemo } from "react";
import {
  Cpu,
  Car,
  HeartPulse,
  LineChart,
  Flame,
  FlaskConical,
  Landmark,
  Trophy,
  Clock,
  Globe2,
  Radio,
  ArrowRight,
  Check,
  Mail,
} from "lucide-react";

const SECTORS = [
  { id: "tech", label: "Technology", icon: Cpu, color: "#4C8DFF" },
  { id: "auto", label: "Automobile", icon: Car, color: "#E08A2C" },
  { id: "health", label: "Health", icon: HeartPulse, color: "#3FAE6B" },
  { id: "finance", label: "Finance", icon: LineChart, color: "#9B6BD9" },
  { id: "energy", label: "Energy", icon: Flame, color: "#E0552C" },
  { id: "science", label: "Science", icon: FlaskConical, color: "#33B6C9" },
  { id: "politics", label: "Politics", icon: Landmark, color: "#7C8AA0" },
  { id: "sports", label: "Sports", icon: Trophy, color: "#D9B23F" },
];

const DISPATCH_SAMPLE = [
  { sector: "tech", time: "09:14", headline: "Chipmakers unveil next-gen AI accelerators" },
  { sector: "auto", time: "09:02", headline: "EV makers race to cut battery costs" },
  { sector: "health", time: "08:47", headline: "Study links sleep regularity to recovery times" },
  { sector: "finance", time: "08:55", headline: "Markets hold steady ahead of rate decision" },
  { sector: "energy", time: "08:30", headline: "Grid operators expand storage capacity" },
  { sector: "science", time: "08:12", headline: "Researchers map a deep-sea ecosystem" },
];

const FREQUENCIES = [
  { id: "hourly", label: "Hourly", desc: "A dispatch every hour, on the hour", perDay: 24 },
  { id: "six", label: "Every 6 hours", desc: "Four dispatches, spaced through the day", perDay: 4 },
  { id: "daily", label: "Daily", desc: "One dispatch each morning, your time", perDay: 1 },
];

const WORLD_CLOCKS = [
  { city: "New York", zone: "America/New_York" },
  { city: "London", zone: "Europe/London" },
  { city: "Dubai", zone: "Asia/Dubai" },
  { city: "Singapore", zone: "Asia/Singapore" },
  { city: "Sydney", zone: "Australia/Sydney" },
];

function computeNextDispatch(frequencyId, now) {
  const next = new Date(now);
  if (frequencyId === "hourly") {
    next.setMinutes(0, 0, 0);
    next.setHours(next.getHours() + 1);
  } else if (frequencyId === "six") {
    const currentHour = next.getHours();
    const nextBlock = Math.ceil((currentHour + 1) / 6) * 6;
    next.setMinutes(0, 0, 0);
    next.setHours(nextBlock);
  } else {
    next.setHours(8, 0, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
  }
  return next;
}

export default function MeridianDispatch() {
  const [selectedSectors, setSelectedSectors] = useState(["tech", "auto", "health"]);
  const [frequency, setFrequency] = useState("daily");
  const [now, setNow] = useState(new Date());
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  const nextDispatch = useMemo(() => computeNextDispatch(frequency, now), [frequency, now]);

  const toggleSector = (id) => {
    setSelectedSectors((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const sectorById = (id) => SECTORS.find((s) => s.id === id);

  return (
    <div className="md-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .md-wrap {
          --ink: #0E1524;
          --ink-raised: #161F33;
          --wire: #EDEBE2;
          --wire-dim: #8B93A8;
          --line: #2A3550;
          --signal: #E0552C;
          background: var(--ink);
          color: var(--wire);
          font-family: 'Archivo', ui-sans-serif, system-ui, 'Helvetica Neue', Arial, sans-serif;
          min-height: 100vh;
          width: 100%;
        }
        .md-wrap .mono {
          font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
        }
        .md-wrap a, .md-wrap button { font-family: inherit; }

        .md-nav {
          border-bottom: 1px solid var(--line);
        }

        .md-hairline { border-color: var(--line); }

        .md-dot {
          width: 7px; height: 7px; border-radius: 999px;
          background: var(--signal);
          animation: md-pulse 1.8s ease-in-out infinite;
        }
        @keyframes md-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(224,85,44,0.45); }
          50% { opacity: 0.55; box-shadow: 0 0 0 5px rgba(224,85,44,0); }
        }

        .md-ticker-track {
          animation: md-scroll 22s linear infinite;
        }
        .md-ticker-outer:hover .md-ticker-track {
          animation-play-state: paused;
        }
        @keyframes md-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .md-ticker-track { animation: none; }
          .md-dot { animation: none; }
        }

        .md-card {
          background: var(--ink-raised);
          border: 1px solid var(--line);
        }

        .sector-card {
          border: 1px solid var(--line);
          background: var(--ink-raised);
          transition: border-color 150ms ease, transform 150ms ease;
        }
        .sector-card:hover { transform: translateY(-2px); }
        .sector-card.selected {
          border-color: var(--accent);
          box-shadow: 0 0 0 1px var(--accent) inset;
        }

        .freq-card {
          border: 1px solid var(--line);
          background: var(--ink-raised);
        }
        .freq-card.selected {
          border-color: var(--wire);
          background: #1C2640;
        }

        .md-input {
          background: var(--ink-raised);
          border: 1px solid var(--line);
          color: var(--wire);
        }
        .md-input::placeholder { color: var(--wire-dim); }
        .md-input:focus-visible, .md-btn:focus-visible, .sector-card:focus-visible, .freq-card:focus-visible {
          outline: 2px solid var(--wire);
          outline-offset: 2px;
        }

        .md-btn-primary {
          background: var(--wire);
          color: var(--ink);
        }
        .md-btn-primary:hover { opacity: 0.9; }
      `}</style>

      {/* NAV */}
      <nav className="md-nav sticky top-0 z-10 flex items-center justify-between px-6 py-4 md:px-10" style={{ background: "rgba(14,21,36,0.9)", backdropFilter: "blur(6px)" }}>
        <a href="#top" className="flex items-center gap-2">
          <Globe2 className="w-5 h-5" style={{ color: "var(--signal)" }} />
          <span className="text-lg font-bold tracking-tight">Meridian Dispatch</span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "var(--wire-dim)" }}>
          <a href="#sectors" className="hover:text-white transition">Sectors</a>
          <a href="#schedule" className="hover:text-white transition">Schedule</a>
          <a href="#coverage" className="hover:text-white transition">Coverage</a>
        </div>
        <a href="#subscribe" className="md-btn-primary px-4 py-2 rounded-md text-sm font-semibold">
          Get started
        </a>
      </nav>

      {/* HERO */}
      <header id="top" className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6 md:px-10 py-16 md:py-24 max-w-7xl mx-auto">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
            The world, sorted into{" "}
            <span style={{ color: "#4C8DFF" }}>tech</span>,{" "}
            <span style={{ color: "#E08A2C" }}>auto</span>,{" "}
            <span style={{ color: "#3FAE6B" }}>health</span>
            {" "}— on your clock.
          </h1>
          <p className="mt-6 text-lg max-w-md" style={{ color: "var(--wire-dim)" }}>
            Pick the sectors you track and how often you want them. We hold the wire; you decide when it rings.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {FREQUENCIES.slice(0, 2).concat(FREQUENCIES[2]).map((f) => (
              <button
                key={f.id}
                onClick={() => setFrequency(f.id)}
                className={`freq-card px-4 py-2 rounded-full text-sm ${frequency === f.id ? "selected" : ""}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <a href="#subscribe" className="md-btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-md text-sm font-semibold">
              Start my dispatch <ArrowRight className="w-4 h-4" />
            </a>
            <span className="mono text-sm" style={{ color: "var(--wire-dim)" }}>
              Next dispatch: {nextDispatch.toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

        {/* WIRE PANEL */}
        <div className="md-card rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--line)" }}>
            <div className="flex items-center gap-2">
              <span className="md-dot" />
              <span className="text-sm font-semibold">Live wire</span>
            </div>
            <span className="mono text-xs" style={{ color: "var(--wire-dim)" }}>sample dispatch</span>
          </div>
          <div className="md-ticker-outer relative h-80 overflow-hidden">
            <div className="md-ticker-track">
              {[...DISPATCH_SAMPLE, ...DISPATCH_SAMPLE].map((item, i) => {
                const s = sectorById(item.sector);
                const Icon = s.icon;
                return (
                  <div key={i} className="flex items-start gap-3 px-5 py-4" style={{ borderBottom: "1px solid var(--line)" }}>
                    <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: s.color }} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold" style={{ color: s.color }}>{s.label}</span>
                        <span className="mono text-xs" style={{ color: "var(--wire-dim)" }}>{item.time}</span>
                      </div>
                      <p className="text-sm mt-1 truncate">{item.headline}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* SECTORS */}
      <section id="sectors" className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Choose your sectors</h2>
          <span className="text-sm" style={{ color: "var(--wire-dim)" }}>{selectedSectors.length} selected</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {SECTORS.map((s) => {
            const Icon = s.icon;
            const selected = selectedSectors.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleSector(s.id)}
                style={{ "--accent": s.color }}
                className={`sector-card rounded-lg px-4 py-4 text-left ${selected ? "selected" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <Icon className="w-5 h-5" style={{ color: s.color }} />
                  {selected && <Check className="w-4 h-4" style={{ color: s.color }} />}
                </div>
                <p className="mt-3 text-sm font-semibold">{s.label}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* SCHEDULE */}
      <section id="schedule" className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Set your rhythm</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FREQUENCIES.map((f) => (
            <button
              key={f.id}
              onClick={() => setFrequency(f.id)}
              className={`freq-card rounded-lg px-5 py-5 text-left ${frequency === f.id ? "selected" : ""}`}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">{f.label}</p>
                <span className="mono text-xs" style={{ color: "var(--wire-dim)" }}>{f.perDay}/day</span>
              </div>
              <p className="text-sm mt-2" style={{ color: "var(--wire-dim)" }}>{f.desc}</p>
            </button>
          ))}
        </div>
        <div className="md-card rounded-lg mt-6 px-5 py-4 flex items-center gap-3">
          <Clock className="w-4 h-4" style={{ color: "var(--signal)" }} />
          <p className="mono text-sm">
            Next dispatch lands {nextDispatch.toLocaleString([], { weekday: "long", hour: "2-digit", minute: "2-digit" })}, your local time
          </p>
        </div>
      </section>

      {/* COVERAGE */}
      <section id="coverage" className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Coverage, wherever the story breaks</h2>
        <p className="text-sm mb-6" style={{ color: "var(--wire-dim)" }}>Dispatch times below are live, computed from your device's clock.</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {WORLD_CLOCKS.map((c) => (
            <div key={c.city} className="md-card rounded-lg px-4 py-4 text-center">
              <p className="text-sm font-semibold">{c.city}</p>
              <p className="mono text-lg mt-1">
                {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: c.zone })}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section id="subscribe" className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="md-card rounded-xl px-6 py-10 md:px-12 md:py-14 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Your dispatch, built above.</h2>
            <p className="mt-3 text-sm" style={{ color: "var(--wire-dim)" }}>
              {selectedSectors.length === 0
                ? "Pick at least one sector to get started."
                : `${selectedSectors.map((id) => sectorById(id).label).join(", ")} — ${FREQUENCIES.find((f) => f.id === frequency).label.toLowerCase()}.`}
            </p>
          </div>
          <div>
            {subscribed ? (
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#3FAE6B" }} />
                <p className="text-sm">
                  You're set. First dispatch arrives{" "}
                  {nextDispatch.toLocaleString([], { weekday: "long", hour: "2-digit", minute: "2-digit" })}. Sectors and frequency can be changed anytime.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email && selectedSectors.length > 0) setSubscribed(true);
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="md-input rounded-md flex items-center gap-2 px-3 py-3 flex-1">
                  <Mail className="w-4 h-4 shrink-0" style={{ color: "var(--wire-dim)" }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="bg-transparent outline-none text-sm w-full"
                  />
                </div>
                <button type="submit" className="md-btn-primary px-5 py-3 rounded-md text-sm font-semibold whitespace-nowrap">
                  Start my dispatch
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 md:px-10 py-8 border-t max-w-7xl mx-auto flex items-center justify-between md-hairline">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4" style={{ color: "var(--wire-dim)" }} />
          <span className="text-sm" style={{ color: "var(--wire-dim)" }}>Meridian Dispatch</span>
        </div>
        <span className="mono text-xs" style={{ color: "var(--wire-dim)" }}>Built for readers on every meridian</span>
      </footer>
    </div>
  );
}
