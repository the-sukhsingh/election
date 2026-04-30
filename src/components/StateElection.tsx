'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flag, Users, Megaphone, CheckSquare, BarChart2,
  ChevronLeft, ChevronRight, BookOpen, Map, X
} from 'lucide-react';

// ─── Types & Data ─────────────────────────────────────────────────────────────
interface Phase { id: string; title: string; subtitle: string; icon: React.ReactNode; accent: string; }

const PHASES: Phase[] = [
  { id: 'trigger',    title: 'Announcement',    subtitle: 'SEC Notification',      icon: <Flag className="w-4 h-4" />,        accent: '#FF6B35' },
  { id: 'candidates', title: 'Candidates',      subtitle: 'MLA Nominations',       icon: <Users className="w-4 h-4" />,       accent: '#3b82f6' },
  { id: 'campaign',   title: 'Campaign',        subtitle: 'Local Promises',        icon: <Megaphone className="w-4 h-4" />,   accent: '#F59E0B' },
  { id: 'voting',     title: 'Voting Day',      subtitle: 'Secret Ballot',         icon: <CheckSquare className="w-4 h-4" />, accent: '#22c55e' },
  { id: 'results',    title: 'Results',         subtitle: 'State Govt',            icon: <BarChart2 className="w-4 h-4" />,   accent: '#A855F7' },
];

const PARTIES = [
  { id: 'a', name: 'State Democratic Party', abbr: 'SDP', symbol: '🚲', color: '#3b82f6', seats: 115 },
  { id: 'b', name: 'National Front',         abbr: 'NF',  symbol: '🦁', color: '#FF6B35', seats: 70 },
  { id: 'c', name: 'Regional Voice',         abbr: 'RV',  symbol: '🌾', color: '#A855F7', seats: 15 },
];
const TOTAL = 200;

// ─── Shared: Fact card ────────────────────────────────────────────────────────
function FactCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full rounded-2xl p-6 mt-4 flex gap-4 text-left border border-white/5 bg-white/[0.02]">
      <BookOpen className="w-5 h-5 text-gray-500 shrink-0" />
      <div>
        <p className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-widest">{title}</p>
        <p className="text-sm leading-relaxed text-gray-500">{children}</p>
      </div>
    </div>
  );
}

// ─── Phase content components ─────────────────────────────────────────────────

function TriggerPhase() {
  const stats = [
    { label: 'State Voters', value: '50M+' },
    { label: 'Seats', value: '200' },
    { label: 'Term Length', value: '5 Yrs' },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
      {stats.map((s, i) => (
        <div key={s.label} className={`rounded-3xl p-6 flex flex-col justify-center bg-white/[0.02] border border-white/5 ${i === 0 ? 'col-span-2 items-center' : 'items-center'}`}>
          <p className="text-4xl font-light text-white mb-1 tracking-tighter">{s.value}</p>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function CandidatesPhase() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      {PARTIES.map(p => (
        <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/5">
            {p.symbol}
          </div>
          <div className="flex-1">
            <p className="text-base font-medium text-white">{p.name}</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full text-white/80" style={{ background: `${p.color}40` }}>
            {p.abbr}
          </span>
        </div>
      ))}
    </div>
  );
}

function CampaignPhase() {
  const events = [
    { label: 'Door-to-door',      pct: 90 },
    { label: 'Local Rallies',     pct: 85 },
    { label: 'Regional Media',    pct: 75 },
  ];
  return (
    <div className="w-full max-w-md rounded-3xl p-8 flex flex-col gap-8 bg-white/[0.02] border border-white/5">
      {events.map(e => (
        <div key={e.label}>
          <div className="flex justify-between text-sm font-medium text-gray-400 mb-3 uppercase tracking-widest">
            <span>{e.label}</span><span className="text-white">{e.pct}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${e.pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-white"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function VotingPhase({ votedFor, onVote }: { votedFor: string | null; onVote: (id: string) => void }) {
  return (
    <div className="w-full max-w-sm rounded-3xl overflow-hidden bg-[#e2e8f0] shadow-2xl relative">
      {/* Screen */}
      <div className="m-4 rounded-xl overflow-hidden bg-[#0f172a] p-1">
        <div className="px-4 py-3 text-center bg-[#022c22] rounded-lg">
          <span className="font-mono text-xs tracking-widest font-bold" style={{ color: votedFor ? '#4ade80' : '#a7f3d0' }}>
            {votedFor ? 'RECORDED' : 'READY TO VOTE'}
          </span>
        </div>
      </div>
      
      {/* Ballot */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        {PARTIES.map(party => (
          <div key={party.id}
            className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200">
            <div className="flex items-center gap-4">
              <span className="text-2xl">{party.symbol}</span>
              <p className="text-gray-900 font-semibold text-sm">{party.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full transition-colors ${votedFor === party.id ? 'bg-red-500' : 'bg-gray-200'}`} />
              <button
                onClick={() => !votedFor && onVote(party.id)}
                disabled={!!votedFor}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white disabled:opacity-50 bg-blue-600 hover:bg-blue-500"
              >
                <div className="w-1 h-4 bg-white/30 rounded-full" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultsPhase() {
  const winner = PARTIES[0];
  const majority = Math.floor(TOTAL / 2) + 1;
  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <div className="flex justify-between text-xs font-medium text-gray-500 mb-4 uppercase tracking-widest">
          <span>0</span>
          <span className="text-white">{majority} majority</span>
          <span>{TOTAL}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden flex bg-white/5 relative">
          <div className="absolute top-0 bottom-0 left-[50%] w-px bg-white/20 z-10" />
          {PARTIES.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ width: 0 }}
              animate={{ width: `${(p.seats / TOTAL) * 100}%` }}
              transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
              className="h-full"
              style={{ background: p.color }}
            />
          ))}
        </div>
      </div>

      <div className="rounded-3xl p-8 text-center border border-white/5 bg-white/[0.02]">
        <p className="text-5xl mb-4">{winner.symbol}</p>
        <p className="text-2xl font-medium text-white mb-2 tracking-tight">{winner.name}</p>
        <p className="text-sm text-gray-400">
          Wins <strong className="text-white">{winner.seats} seats</strong> to form the state government
        </p>
      </div>
    </div>
  );
}

// ─── Step bar ─────────────────────────────────────────────────────────────────
function StepBar({ phases, current }: { phases: Phase[]; current: number }) {
  return (
    <div className="flex items-center justify-between relative w-full max-w-2xl mx-auto">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-white/5" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/30 transition-all duration-500" 
           style={{ width: `${(current / (phases.length - 1)) * 100}%` }} />

      {phases.map((p, i) => {
        const done   = i <= current;
        return (
          <div key={p.id} className="relative z-10 flex flex-col items-center group">
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 outline outline-4 outline-[#0d1117] ${done ? 'bg-white scale-110' : 'bg-gray-700'}`}
            />
            <span className={`absolute top-6 text-[10px] font-medium uppercase tracking-widest whitespace-nowrap transition-colors ${done ? 'text-white' : 'text-gray-600'}`}>
              {p.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function StateElection({ onBack }: { onBack?: () => void }) {
  const [idx, setIdx]         = useState(0);
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const phase  = PHASES[idx];
  const isLast = idx === PHASES.length - 1;
  const canNext = phase.id !== 'voting' || !!votedFor;

  const renderLeftText = () => {
    switch(phase.id) {
      case 'trigger': return "State elections determine the state government. A state is divided into smaller constituencies, each electing a Member of Legislative Assembly (MLA).";
      case 'candidates': return "Parties nominate candidates for each constituency. Here are the main contenders focusing on regional issues in our sample state.";
      case 'campaign': return "State campaigns focus heavily on regional problems like local infrastructure, water supply, agriculture, and state welfare schemes.";
      case 'voting': return "Citizens vote using EVMs, choosing their preferred MLA. These votes decide the composition of the State Legislative Assembly.";
      case 'results': return "The party or coalition securing a majority in the assembly forms the government. Their chosen leader becomes the Chief Minister.";
      default: return "";
    }
  };

  const renderFact = () => {
    switch(phase.id) {
      case 'trigger': return { title: "State vs Central", desc: "Lok Sabha decides the Prime Minister. Vidhan Sabha decides the Chief Minister handling day-to-day state affairs." };
      case 'candidates': return { title: "Qualifications", desc: "A candidate must be at least 25 years old and an elector for any assembly constituency in that state." };
      case 'campaign': return { title: "Code of Conduct", desc: "The incumbent state government cannot announce new schemes or use state machinery to influence voters." };
      case 'voting': return { title: "Timing", desc: "Usually managed independently on a 5-year cycle by the ECI, though sometimes held simultaneously with central elections." };
      case 'results': return { title: "The Governor", desc: "The Governor officially invites the leader of the majority party to form the government and takes their oath." };
      default: return { title: "", desc: "" };
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative text-white bg-transparent">
      {/* Minimal Header */}
      <div className="shrink-0 pt-2 pb-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Map className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-semibold text-gray-300 uppercase tracking-widest">State Govt</span>
        </div>
        <div className="flex-1 px-8 hidden md:block">
          <StepBar phases={PHASES} current={idx} />
        </div>
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/5 transition-colors text-gray-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="md:hidden w-full px-4 mb-12">
        <StepBar phases={PHASES} current={idx} />
      </div>

      {/* Split Content */}
      <div className="flex-1 flex flex-col md:flex-row items-center gap-12 md:gap-24 px-4 md:px-12 pb-24">
        {/* Left Column: Narrative */}
        <div className="flex-1 flex flex-col justify-center max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase.id + "-text"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-6">
                {phase.title}
              </h1>
              <p className="text-lg md:text-xl font-light leading-relaxed text-gray-400 mb-10">
                {renderLeftText()}
              </p>
              
              <FactCard title={renderFact().title}>
                {renderFact().desc}
              </FactCard>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Visual/Interactive Widget */}
        <div className="flex-1 flex justify-center items-center w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase.id + "-widget"}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              {phase.id === 'trigger' && <TriggerPhase />}
              {phase.id === 'candidates' && <CandidatesPhase />}
              {phase.id === 'campaign' && <CampaignPhase />}
              {phase.id === 'voting' && <VotingPhase votedFor={votedFor} onVote={setVotedFor} />}
              {phase.id === 'results' && <ResultsPhase />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Minimal Footer Navigation */}
      <div className="absolute bottom-6 right-6 md:right-12 flex items-center gap-4">
        <button
          onClick={() => setIdx(i => Math.max(0, i - 1))}
          className={`p-3 rounded-full border border-white/10 transition-colors ${idx === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-white/5 text-white'}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {isLast ? (
          <button
            onClick={onBack}
            className="px-8 py-3 rounded-full bg-white text-black font-semibold tracking-wide hover:scale-105 transition-transform"
          >
            Finish
          </button>
        ) : (
          <button
            onClick={() => canNext && setIdx(i => Math.min(PHASES.length - 1, i + 1))}
            disabled={!canNext}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black font-semibold tracking-wide hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {phase.id === 'voting' && !votedFor ? 'Vote First' : 'Continue'}
          </button>
        )}
      </div>
    </div>
  );
}
