'use client';

import React, { useState, lazy, Suspense, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Building2, Landmark, ArrowLeft, ChevronRight, ShieldAlert } from 'lucide-react';
import GoogleTranslate from '@/components/GoogleTranslate';
import AaravChat from '@/components/AaravChat';
import ErrorBoundary from '@/components/ErrorBoundary';

// ── Lazy-load heavy modules (code-splitting for perf) ─────────────────────────
const CentralElection = lazy(() => import('@/components/CentralElection'));
const StateElection   = lazy(() => import('@/components/StateElection'));
const VillageElection = lazy(() => import('@/components/VillageElection'));
const FactChecker     = lazy(() => import('@/components/FactChecker'));

type Level = 'overview' | 'central' | 'state' | 'village' | 'factcheck';

// ── Shared animation config ───────────────────────────────────────────────────
const fade = {
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  exit:       { opacity: 0 },
  transition: { duration: 0.2 },
} as const;

// ── Module loading skeleton ───────────────────────────────────────────────────
function ModuleSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center" role="status" aria-label="Loading module">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Loading…</p>
      </div>
    </div>
  );
}

// ── Level Card ────────────────────────────────────────────────────────────────
interface LevelCardProps {
  id: string;
  icon: React.ReactNode;
  tag: string;
  title: string;
  subtitle: string;
  accent: string;
  onClick: () => void;
}

const LevelCard = memo(function LevelCard({ id, icon, tag, title, subtitle, accent, onClick }: LevelCardProps) {
  return (
    <button
      id={id}
      onClick={onClick}
      aria-label={`Explore ${title}: ${subtitle}`}
      className="group relative w-60 text-left rounded-2xl p-6 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0d1117]"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        // @ts-expect-error CSS custom property for focus ring
        '--tw-ring-color': accent,
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = accent + '50')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
    >
      {/* Accent line */}
      <div className="absolute top-0 left-6 right-6 h-px" style={{ background: accent, opacity: 0.6 }} aria-hidden="true" />

      <div className="flex flex-col gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: accent + '15' }}
          aria-hidden="true"
        >
          {icon}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: accent }}>
            {tag}
          </p>
          <h2 className="text-base font-bold text-white mb-1">{title}</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{subtitle}</p>
        </div>

        <div className="flex items-center gap-1 text-sm font-medium" style={{ color: accent }} aria-hidden="true">
          Explore <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
        </div>
      </div>
    </button>
  );
});

const LEVEL_CARDS = [
  {
    id: 'card-central',
    level: 'central' as Level,
    icon: <Landmark className="w-5 h-5 text-orange-400" aria-hidden="true" />,
    tag: 'Lok Sabha',
    title: 'Central Government',
    subtitle: 'How the Prime Minister is chosen through national elections.',
    accent: '#FF6B35',
  },
  {
    id: 'card-state',
    level: 'state' as Level,
    icon: <Building2 className="w-5 h-5 text-blue-400" aria-hidden="true" />,
    tag: 'Vidhan Sabha',
    title: 'State Government',
    subtitle: 'How your state is governed through the Vidhan Sabha.',
    accent: '#4169E1',
  },
  {
    id: 'card-village',
    level: 'village' as Level,
    icon: <Home className="w-5 h-5 text-green-400" aria-hidden="true" />,
    tag: 'Panchayat',
    title: 'Village Government',
    subtitle: 'Democracy at your doorstep — roads, water, local disputes.',
    accent: '#22c55e',
  },
  {
    id: 'card-factcheck',
    level: 'factcheck' as Level,
    icon: <ShieldAlert className="w-5 h-5 text-pink-500" aria-hidden="true" />,
    tag: 'Mini Game',
    title: 'Fact Guard',
    subtitle: 'Spot fake news and misinformation before it spreads.',
    accent: '#ec4899',
  },
] as const;

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DemocracyEngine() {
  const [level, setLevel] = useState<Level>('overview');

  const goBack = useCallback(() => setLevel('overview'), []);
  const goTo   = useCallback((l: Level) => setLevel(l), []);

  return (
    <div className="relative w-full h-screen overflow-hidden text-white" style={{ background: '#0d1117' }}>

      {/* ── Skip navigation link (a11y) ───────────────────────────────────── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-white focus:text-black focus:font-semibold focus:text-sm"
      >
        Skip to main content
      </a>

      {/* Subtle top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} aria-hidden="true" />

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header
        className="relative z-10 flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,107,53,0.15)' }} aria-hidden="true">
            <Landmark className="w-4 h-4 text-orange-400" />
          </div>
          <span className="text-sm font-semibold text-white">Democracy Engine</span>
        </div>

        <div className="flex items-center gap-4">
          <GoogleTranslate />
          <AnimatePresence mode="wait">
            {level !== 'overview' && (
              <motion.button
                key="back"
                {...fade}
                onClick={goBack}
                aria-label="Back to module overview"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-white/30"
                style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Map
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 w-full h-[calc(100vh-57px)] flex items-center justify-center px-4"
      >
        <AnimatePresence mode="wait">

          {/* Overview */}
          {level === 'overview' && (
            <motion.div
              key="overview"
              {...fade}
              className="flex flex-col items-center gap-10 w-full"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">India&apos;s Democracy, Explained</h1>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Every vote shapes a different layer of your life. Choose where to begin.
                </p>
              </div>

              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                role="list"
                aria-label="Election modules"
              >
                {LEVEL_CARDS.map(card => (
                  <div key={card.id} role="listitem">
                    <LevelCard
                      id={card.id}
                      icon={card.icon}
                      tag={card.tag}
                      title={card.title}
                      subtitle={card.subtitle}
                      accent={card.accent}
                      onClick={() => goTo(card.level)}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Election modules (lazy-loaded with error boundary) */}
          {level !== 'overview' && level !== 'factcheck' && (
            <motion.div key={level} {...fade} className="w-full h-full py-4 px-2 md:px-8">
              <ErrorBoundary onReset={goBack}>
                <Suspense fallback={<ModuleSkeleton />}>
                  {level === 'central' && <CentralElection onBack={goBack} />}
                  {level === 'state'   && <StateElection   onBack={goBack} />}
                  {level === 'village' && <VillageElection onBack={goBack} />}
                </Suspense>
              </ErrorBoundary>
            </motion.div>
          )}

          {level === 'factcheck' && (
            <motion.div key="factcheck" {...fade} className="w-full h-full max-w-2xl py-4">
              <ErrorBoundary onReset={goBack}>
                <Suspense fallback={<ModuleSkeleton />}>
                  <FactChecker onBack={goBack} />
                </Suspense>
              </ErrorBoundary>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ── Aarav: Gemini-powered floating AI assistant ───────────────────── */}
      <AaravChat />
    </div>
  );
}