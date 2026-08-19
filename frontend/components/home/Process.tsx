"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Palette,
  Code2,
  Layout,
  TrendingUp,
} from "lucide-react";
import SplitText from "@/components/animations/SplitText";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

type ProcessStep = {
  number: string;
  timeframe: string;
  title: string;
  description: string;
  deliverables: string[];
};

type ServiceProcess = {
  id: string;
  label: string;
  icon: React.ElementType;
  tagline: string;
  steps: {
    left: [ProcessStep, ProcessStep];
    right: [ProcessStep, ProcessStep];
  };
};

const processes: ServiceProcess[] = [
  {
    id: "branding",
    label: "Branding",
    icon: Palette,
    tagline: "From identity discovery to a timeless brand system.",
    steps: {
      left: [
        {
          number: "01",
          timeframe: "2–4 Days",
          title: "Discovery & Archetype",
          description:
            "Deep-dive brand strategy, market positioning, target audience mapping, and competitive visual benchmarking.",
          deliverables: ["Strategy Brief", "Moodboard Direction", "Positioning Deck"],
        },
        {
          number: "02",
          timeframe: "1–2 Weeks",
          title: "Visual Identity System",
          description:
            "Exploration and crafting of the primary logo mark, color palettes, custom typography hierarchy, and visual rules.",
          deliverables: ["Primary & Secondary Marks", "Color System", "Typography Hierarchy"],
        },
      ],
      right: [
        {
          number: "03",
          timeframe: "1–2 Weeks",
          title: "Brand Guidelines & Kit",
          description:
            "Comprehensive multi-page brand guidelines with iconography, motion principles, and cross-channel marketing assets.",
          deliverables: ["Brand Style Guide", "Social Media Templates", "3D Brand Elements"],
        },
        {
          number: "04",
          timeframe: "2–3 Days",
          title: "Asset Delivery & Rollout",
          description:
            "Exporting production-ready vector assets across all formats with full commercial documentation and rollout support.",
          deliverables: ["Vector Master Files", "Print & Digital Pack", "Launch Support"],
        },
      ],
    },
  },
  {
    id: "web-dev",
    label: "Web Development",
    icon: Code2,
    tagline: "Engineering high-speed web platforms with Next.js 16.",
    steps: {
      left: [
        {
          number: "01",
          timeframe: "2–4 Days",
          title: "Architecture & Stack",
          description:
            "Detailed tech specification, database schema, API routing, and component hierarchy planning.",
          deliverables: ["Technical Scope", "Repository Setup", "Performance Targets"],
        },
        {
          number: "02",
          timeframe: "1–2 Weeks",
          title: "Frontend & Animation",
          description:
            "Pixel-perfect React component engineering with Tailwind CSS and silky-smooth 60fps GSAP micro-interactions.",
          deliverables: ["Responsive Layouts", "GSAP Interactions", "Design Token Sync"],
        },
      ],
      right: [
        {
          number: "03",
          timeframe: "1–2 Weeks",
          title: "Backend & CMS Flow",
          description:
            "Integration with headless CMS, server actions, webhooks, forms, dynamic metadata, and database models.",
          deliverables: ["CMS Dashboard", "API Endpoints", "Form Handling"],
        },
        {
          number: "04",
          timeframe: "2–3 Days",
          title: "QA & Cloud Deploy",
          description:
            "Stress testing, 99+ Core Web Vitals validation, cross-browser audits, domain DNS link, and continuous CI/CD.",
          deliverables: ["99+ Core Vitals", "Cross-Browser Audit", "Vercel / Cloud Launch"],
        },
      ],
    },
  },
  {
    id: "ui-ux",
    label: "UI / UX Design",
    icon: Layout,
    tagline: "Human-centered interfaces engineered to convert.",
    steps: {
      left: [
        {
          number: "01",
          timeframe: "2–4 Days",
          title: "User Research & Flow",
          description:
            "Analyzing user personas, competitive heuristic audits, information architecture, and core journey wireframes.",
          deliverables: ["User Journey Maps", "Heuristic Audit", "Lo-Fi Wireframes"],
        },
        {
          number: "02",
          timeframe: "1–2 Weeks",
          title: "Figma Component System",
          description:
            "Creating scalable auto-layout design systems with accessible contrast, dark mode variants, and responsive states.",
          deliverables: ["Figma UI Kit", "Component Tokens", "Design Architecture"],
        },
      ],
      right: [
        {
          number: "03",
          timeframe: "1–2 Weeks",
          title: "Interactive Prototype",
          description:
            "High-fidelity clickable Figma prototypes with realistic motion choreography, micro-states, and usability testing.",
          deliverables: ["Clickable Prototype", "User Testing Report", "Motion Specs"],
        },
        {
          number: "04",
          timeframe: "2–3 Days",
          title: "Developer Handoff",
          description:
            "Clean export of asset specs, CSS variables, responsive breakpoints, and organized engineering notes.",
          deliverables: ["Dev-Ready Specs", "Asset Export", "Handoff Walkthrough"],
        },
      ],
    },
  },
  {
    id: "digital-marketing",
    label: "Digital Marketing",
    icon: TrendingUp,
    tagline: "Data-driven campaigns and conversion optimization.",
    steps: {
      left: [
        {
          number: "01",
          timeframe: "2–4 Days",
          title: "Funnel & Market Audit",
          description:
            "Comprehensive conversion funnel audit, customer acquisition channel analysis, and competitor ad intelligence.",
          deliverables: ["Funnel Audit", "Keyword Strategy", "Targeting Blueprint"],
        },
        {
          number: "02",
          timeframe: "1–2 Weeks",
          title: "Creatives & Copywriting",
          description:
            "High-impact visual ad creatives, compelling sales copy, lead magnets, and conversion landing pages.",
          deliverables: ["Ad Creative Suite", "High-Converting Copy", "Landing Page Layout"],
        },
      ],
      right: [
        {
          number: "03",
          timeframe: "1–2 Weeks",
          title: "Multi-Channel Launch",
          description:
            "Setting up tracking pixels, conversion API, audience segmentation, and A/B split testing across Meta & Google.",
          deliverables: ["Conversion Tracking", "Live Campaigns", "A/B Testing Matrix"],
        },
        {
          number: "04",
          timeframe: "Ongoing",
          title: "ROAS Scaling & Growth",
          description:
            "Continuous bid optimization, creative fatigue cycling, performance dashboard reporting, and ROI scale-up.",
          deliverables: ["Weekly ROI Reports", "Creative Iterations", "Growth Strategy"],
        },
      ],
    },
  },
];

function ProcessCard({ step }: { step: ProcessStep }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111113] transition-all duration-500 hover:border-accent/30 hover:shadow-[0_0_40px_rgba(255,77,31,0.07)]">

      {/* Top accent line — slides in on hover */}
      <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-accent via-orange-400 to-transparent transition-transform duration-500 group-hover:scale-x-100" />

      <div className="relative flex flex-1 flex-col p-6 md:p-7">

        {/* Phase serial + timeframe row */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent/80">
            Phase {step.number}
          </span>
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] text-ink/50">
            <Clock className="h-2.5 w-2.5 text-accent/70" />
            <span>{step.timeframe}</span>
          </div>
        </div>

        {/* Giant watermark number */}
        <div className="pointer-events-none absolute right-5 top-3 select-none font-mono text-[72px] font-black leading-none text-white/[0.03] transition-all duration-500 group-hover:text-accent/[0.06]">
          {step.number}
        </div>

        {/* Title */}
        <h3 className="mt-5 font-display text-xl font-bold leading-tight tracking-tight text-ink transition-colors duration-300 group-hover:text-white md:text-2xl">
          {step.title}
        </h3>

        {/* Hairline divider */}
        <div className="mt-3 h-px w-10 bg-accent/50 transition-all duration-500 group-hover:w-16" />

        {/* Description */}
        <p className="mt-3.5 flex-1 text-[13px] leading-relaxed text-ink/55 md:text-sm">
          {step.description}
        </p>

        {/* Deliverables */}
        <div className="mt-5 space-y-1.5 border-t border-white/[0.05] pt-4">
          {step.deliverables.map((item, i) => (
            <div key={item} className="flex items-center gap-2.5">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-accent/20 bg-accent/5 font-mono text-[8px] font-bold text-accent/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-[11px] text-ink/60 transition-colors group-hover:text-ink/80">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default function Process() {
  const [activeTab, setActiveTab] = useState(processes[0].id);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentProcess = processes.find((p) => p.id === activeTab) || processes[0];
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const prevTabRef = useRef(processes[0].id);

  // Entrance animation on first mount
  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const items = cards.querySelectorAll(".process-card");
      gsap.fromTo(
        items,
        { opacity: 0, y: 30, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: "power3.out",
          stagger: { amount: 0.3, from: "start" },
        }
      );
    }, cards);

    return () => ctx.revert();
  }, []);

  // Tab switch handler with GSAP transition
  const handleTabSwitch = (id: string) => {
    if (id === activeTab || isAnimating) return;
    setIsAnimating(true);

    const cards = cardsRef.current;
    if (!cards || prefersReducedMotion()) {
      setActiveTab(id);
      setIsAnimating(false);
      return;
    }

    const items = cards.querySelectorAll(".process-card");

    // Phase 1: EXIT — cards fly out in stagger
    gsap.to(items, {
      opacity: 0,
      y: -18,
      scale: 0.96,
      filter: "blur(4px)",
      duration: 0.3,
      ease: "power2.in",
      stagger: { amount: 0.15, from: "start" },
      onComplete: () => {
        // Swap content
        setActiveTab(id);
        prevTabRef.current = id;

        // Phase 2: ENTER — new cards fly in from below with stagger
        requestAnimationFrame(() => {
          const newItems = cards.querySelectorAll(".process-card");
          gsap.fromTo(
            newItems,
            { opacity: 0, y: 28, scale: 0.97, filter: "blur(6px)" },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.5,
              ease: "power3.out",
              stagger: { amount: 0.25, from: "start" },
              onComplete: () => setIsAnimating(false),
            }
          );
        });
      },
    });
  };


  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative border-y border-ink/10 bg-[#0e0e0e] py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-14">
          <p className="eyebrow mx-auto mb-3 flex items-center justify-center gap-2 text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>Process &amp; Methodology</span>
          </p>

          <SplitText
            as="h2"
            text="How We Execute Every Discipline."
            className="display text-3xl font-bold leading-[1.08] tracking-tight text-ink sm:text-4xl md:text-5xl"
          />

          <p className="mx-auto mt-3 max-w-lg text-xs leading-relaxed text-ink/70 md:text-sm">
            {currentProcess.tagline}
          </p>

          {/* Interactive Service Filter Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {processes.map((proc) => {
              const active = proc.id === activeTab;
              const Icon = proc.icon;
              return (
                <button
                  key={proc.id}
                  onClick={() => handleTabSwitch(proc.id)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition-all duration-300 md:text-sm ${
                    active
                      ? "bg-accent text-[#0e0e0e] shadow-[0_5px_20px_rgba(255,77,31,0.3)]"
                      : "border border-ink/10 bg-card/60 text-ink/70 hover:border-ink/25 hover:text-ink"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{proc.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Layout: Left (2 Cards) | Center Logo Card | Right (2 Cards) */}
        <div className="process-content-grid relative grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-6">

          {/* Desktop: Realistic Signal Streak SVG */}
          <svg
            className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
            viewBox="0 0 1200 600"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              {/* Soft glow filter for anchor dots */}
              <filter id="dotGlow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Streak comet: bright core + soft wide blur blended */}
              <filter id="cometGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="softBlur" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="wideBlur" />
                <feMerge>
                  <feMergeNode in="wideBlur" />
                  <feMergeNode in="softBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Define paths in defs for reuse by animateMotion */}
              <path id="p1" d="M 400 150 C 470 150, 480 300, 520 300" />
              <path id="p2" d="M 400 450 C 470 450, 480 300, 520 300" />
              <path id="p3" d="M 680 300 C 720 300, 730 150, 800 150" />
              <path id="p4" d="M 680 300 C 720 300, 730 450, 800 450" />
            </defs>

            {/* ── Track rails (faint base lines) ── */}
            <use href="#p1" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
            <use href="#p2" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
            <use href="#p3" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
            <use href="#p4" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />

            {/* ── Anchor dot: left-top card ── */}
            <circle cx="400" cy="150" r="3.5" fill="#ff4d1f" filter="url(#dotGlow)" />
            <circle cx="400" cy="150" r="7" fill="none" stroke="#ff4d1f" strokeWidth="1" opacity="0.35">
              <animate attributeName="r" values="6;11;6" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* ── Anchor dot: left-bottom card ── */}
            <circle cx="400" cy="450" r="3.5" fill="#ff4d1f" filter="url(#dotGlow)" />
            <circle cx="400" cy="450" r="7" fill="none" stroke="#ff4d1f" strokeWidth="1" opacity="0.35">
              <animate attributeName="r" values="6;11;6" dur="2s" begin="0.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" begin="0.5s" repeatCount="indefinite" />
            </circle>

            {/* ── Anchor dot: right-top card ── */}
            <circle cx="800" cy="150" r="3.5" fill="#ff4d1f" filter="url(#dotGlow)" />
            <circle cx="800" cy="150" r="7" fill="none" stroke="#ff4d1f" strokeWidth="1" opacity="0.35">
              <animate attributeName="r" values="6;11;6" dur="2s" begin="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" begin="1s" repeatCount="indefinite" />
            </circle>

            {/* ── Anchor dot: right-bottom card ── */}
            <circle cx="800" cy="450" r="3.5" fill="#ff4d1f" filter="url(#dotGlow)" />
            <circle cx="800" cy="450" r="7" fill="none" stroke="#ff4d1f" strokeWidth="1" opacity="0.35">
              <animate attributeName="r" values="6;11;6" dur="2s" begin="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" begin="1.5s" repeatCount="indefinite" />
            </circle>

            {/* ── Center logo anchor dots (left & right entry points) ── */}
            <circle cx="520" cy="300" r="3" fill="rgba(255,255,255,0.6)" filter="url(#dotGlow)" />
            <circle cx="680" cy="300" r="3" fill="rgba(255,255,255,0.6)" filter="url(#dotGlow)" />

            {/*
              ── SIGNAL STREAKS ──
              Technique: strokeDasharray = [streakLen, totalPathLen - streakLen]
              SMIL animates strokeDashoffset from 0 → -totalPathLen (forward travel)
              Each path is ~200px; streak = 40px wide for a comet-like streak.
            */}

            {/* Path 1: left-top → center  (200px path, 40px streak, 160px gap) */}
            <use href="#p1" stroke="rgba(255,100,40,0.55)" strokeWidth="3"
              strokeDasharray="40 160" strokeLinecap="round" filter="url(#cometGlow)">
              <animate attributeName="stroke-dashoffset" from="0" to="-200"
                dur="1.8s" repeatCount="indefinite" />
            </use>
            {/* bright core of same streak */}
            <use href="#p1" stroke="rgba(255,255,220,0.95)" strokeWidth="1.5"
              strokeDasharray="14 186" strokeLinecap="round" filter="url(#cometGlow)">
              <animate attributeName="stroke-dashoffset" from="0" to="-200"
                dur="1.8s" repeatCount="indefinite" />
            </use>

            {/* Path 2: left-bottom → center  (begin offset for stagger) */}
            <use href="#p2" stroke="rgba(255,100,40,0.55)" strokeWidth="3"
              strokeDasharray="40 160" strokeLinecap="round" filter="url(#cometGlow)">
              <animate attributeName="stroke-dashoffset" from="0" to="-200"
                dur="1.8s" begin="0.65s" repeatCount="indefinite" />
            </use>
            <use href="#p2" stroke="rgba(255,255,220,0.95)" strokeWidth="1.5"
              strokeDasharray="14 186" strokeLinecap="round" filter="url(#cometGlow)">
              <animate attributeName="stroke-dashoffset" from="0" to="-200"
                dur="1.8s" begin="0.65s" repeatCount="indefinite" />
            </use>

            {/* Path 3: center → right-top */}
            <use href="#p3" stroke="rgba(255,100,40,0.55)" strokeWidth="3"
              strokeDasharray="40 160" strokeLinecap="round" filter="url(#cometGlow)">
              <animate attributeName="stroke-dashoffset" from="0" to="-200"
                dur="1.8s" begin="0.3s" repeatCount="indefinite" />
            </use>
            <use href="#p3" stroke="rgba(255,255,220,0.95)" strokeWidth="1.5"
              strokeDasharray="14 186" strokeLinecap="round" filter="url(#cometGlow)">
              <animate attributeName="stroke-dashoffset" from="0" to="-200"
                dur="1.8s" begin="0.3s" repeatCount="indefinite" />
            </use>

            {/* Path 4: center → right-bottom */}
            <use href="#p4" stroke="rgba(255,100,40,0.55)" strokeWidth="3"
              strokeDasharray="40 160" strokeLinecap="round" filter="url(#cometGlow)">
              <animate attributeName="stroke-dashoffset" from="0" to="-200"
                dur="1.8s" begin="0.95s" repeatCount="indefinite" />
            </use>
            <use href="#p4" stroke="rgba(255,255,220,0.95)" strokeWidth="1.5"
              strokeDasharray="14 186" strokeLinecap="round" filter="url(#cometGlow)">
              <animate attributeName="stroke-dashoffset" from="0" to="-200"
                dur="1.8s" begin="0.95s" repeatCount="indefinite" />
            </use>
          </svg>

          {/* Cards wrapper — GSAP targets .process-card inside this ref */}
          <div ref={cardsRef} className="contents">

            {/* Left Side: 2 Cards */}
            <div className="process-card relative z-10 flex flex-col gap-5 lg:col-span-4">
              {currentProcess.steps.left.map((step) => (
                <ProcessCard key={step.number} step={step} />
              ))}
            </div>

            {/* Center Column: Pure Clean Logo */}
            <div className="relative z-10 flex items-center justify-center py-8 lg:col-span-4 lg:py-0">
              <div className="relative flex items-center justify-center p-6">
                <Image
                  src="/images/Logo-00.png"
                  alt="Danie Design"
                  width={4167}
                  height={1468}
                  priority
                  className="invert h-12 w-auto object-contain md:h-14 transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>

            {/* Right Side: 2 Cards */}
            <div className="process-card relative z-10 flex flex-col gap-5 lg:col-span-4">
              {currentProcess.steps.right.map((step) => (
                <ProcessCard key={step.number} step={step} />
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
