'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Building2, Landmark, ArrowLeft, ChevronRight,  ShieldAlert } from 'lucide-react';
import CentralElection from '@/components/CentralElection';
import StateElection from '@/components/StateElection';
import VillageElection from '@/components/VillageElection';
import FactChecker from '@/components/FactChecker';
import GoogleTranslate from '@/components/GoogleTranslate';

type Level = 'overview' | 'central' | 'state' | 'village' | 'factcheck';

// ─── Fade transition config (used everywhere) ─────────────────────────────────
const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
  transition: { duration: 0.2 },
};

// ─── Level Card ───────────────────────────────────────────────────────────────
interface LevelCardProps {
  icon: React.ReactNode;
  tag: string;
  title: string;
  subtitle: string;
  accent: string;
  onClick: () => void;
}

function LevelCard({ icon, tag, title, subtitle, accent, onClick }: LevelCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative w-60 text-left rounded-2xl p-6 transition-colors duration-200"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = accent + '50')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
    >
      {/* Accent line */}
      <div className="absolute top-0 left-6 right-6 h-px" style={{ background: accent, opacity: 0.6 }} />

      <div className="flex flex-col gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: accent + '15' }}
        >
          {icon}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: accent }}>
            {tag}
          </p>
          <h3 className="text-base font-bold text-white mb-1">{title}</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{subtitle}</p>
        </div>

        <div className="flex items-center gap-1 text-sm font-medium" style={{ color: accent }}>
          Explore <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
        </div>
      </div>
    </button>
  );
}



// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DemocracyEngine() {
  const [level, setLevel] = useState<Level>('overview');

  return (
    <div className="relative w-full h-screen overflow-hidden text-white" style={{ background: '#0d1117' }}>

      {/* Subtle top gradient */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,107,53,0.15)' }}>
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
                onClick={() => setLevel('overview')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors duration-150"
                style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Map
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 w-full h-[calc(100vh-57px)] flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {/* Overview */}
          {level === 'overview' && (
            <motion.div key="overview" {...fade} className="flex flex-col items-center gap-10 w-full">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">India&apos;s Democracy, Explained</h1>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Every vote shapes a different layer of your life. Choose where to begin.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center gap-4">
                <LevelCard
                  icon={<Landmark className="w-5 h-5 text-orange-400" />}
                  tag="Lok Sabha"
                  title="Central Government"
                  subtitle="How the Prime Minister is chosen through national elections."
                  accent="#FF6B35"
                  onClick={() => setLevel('central')}
                />
                <LevelCard
                  icon={<Building2 className="w-5 h-5 text-blue-400" />}
                  tag="Vidhan Sabha"
                  title="State Government"
                  subtitle="How your state is governed through the Vidhan Sabha."
                  accent="#4169E1"
                  onClick={() => setLevel('state')}
                />
                <LevelCard
                  icon={<Home className="w-5 h-5 text-green-400" />}
                  tag="Panchayat"
                  title="Village Government"
                  subtitle="Democracy at your doorstep — roads, water, local disputes."
                  accent="#22c55e"
                  onClick={() => setLevel('village')}
                />
                <LevelCard
                  icon={<ShieldAlert className="w-5 h-5 text-pink-500" />}
                  tag="Mini Game"
                  title="Fact Guard"
                  subtitle="Spot fake news and misinformation before it spreads."
                  accent="#ec4899"
                  onClick={() => setLevel('factcheck')}
                />
              </div>

            </motion.div>
          )}

          {/* Central */}
          {level === 'central' && (
            <motion.div key="central" {...fade} className="w-full h-full py-4 px-2 md:px-8">
              <CentralElection onBack={() => setLevel('overview')} />
            </motion.div>
          )}

          {/* State */}
          {level === 'state' && (
            <motion.div key="state" {...fade} className="w-full h-full py-4 px-2 md:px-8">
              <StateElection onBack={() => setLevel('overview')} />
            </motion.div>
          )}

          {/* Village */}
          {level === 'village' && (
            <motion.div key="village" {...fade} className="w-full h-full py-4 px-2 md:px-8">
              <VillageElection onBack={() => setLevel('overview')} />
            </motion.div>
          )}

          {/* Fact Check Mini-Game */}
          {level === 'factcheck' && (
            <motion.div key="factcheck" {...fade} className="w-full h-full max-w-2xl py-4">
              <FactChecker onBack={() => setLevel('overview')} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

    </div>
  );
}