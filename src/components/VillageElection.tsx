'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flag, Users, Megaphone, CheckSquare, BarChart2,
  ChevronLeft, ChevronRight, BookOpen, Home, X
} from 'lucide-react';

// ─── Types & Data ─────────────────────────────────────────────────────────────
interface Phase { id: string; title: string; subtitle: string; icon: React.ReactNode; accent: string; }

const PHASES: Phase[] = [
  { id: 'trigger',    title: 'Announcement',    subtitle: 'SEC Notification',      icon: <Flag className="w-4 h-4" />,        accent: '#FF6B35' },
  { id: 'candidates', title: 'Nominations',     subtitle: 'Local Candidates',      icon: <Users className="w-4 h-4" />,       accent: '#22c55e' },
  { id: 'campaign',   title: 'Campaign',        subtitle: 'Village Meetings',      icon: <Megaphone className="w-4 h-4" />,   accent: '#F59E0B' },
  { id: 'voting',     title: 'Voting Day',      subtitle: 'Ballot Paper',          icon: <CheckSquare className="w-4 h-4" />, accent: '#eab308' },
  { id: 'results',    title: 'Results',         subtitle: 'Panchayat Formed',      icon: <BarChart2 className="w-4 h-4" />,   accent: '#A855F7' },
];

const CANDIDATES = [
  { id: 'a', name: 'Ramesh Kumar', symbol: '🚜', symbolName: 'Tractor', color: '#3b82f6', votes: 450 },
  { id: 'b', name: 'Sunita Devi',  symbol: '🌳', symbolName: 'Tree',    color: '#22c55e', votes: 620 },
  { id: 'c', name: 'Kishan Lal',   symbol: '☕', symbolName: 'Cup',     color: '#F59E0B', votes: 210 },
];

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
    { label: 'Villages', value: '600k+' },
    { label: 'Wards', value: 'Many' },
    { label: 'Issues', value: 'Local' },
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
      {CANDIDATES.map(p => (
        <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/5">
            {p.symbol}
          </div>
          <div className="flex-1">
            <p className="text-base font-medium text-white">{p.name}</p>
            <p className="text-xs text-gray-500 font-medium">{p.symbolName}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CampaignPhase() {
  const events = [
    { label: 'Door-to-door',      pct: 95 },
    { label: 'Choupal Meetings',  pct: 80 },
    { label: 'Pamphlets',         pct: 70 },
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
    <div className="w-full max-w-sm rounded-xl overflow-hidden bg-[#fefce8] text-black shadow-2xl relative border-2 border-black/10">
      <div className="absolute top-0 right-0 w-12 h-12 bg-black/5 rounded-bl-full" />
      
      <div className="text-center border-b-2 border-black/20 pb-3 mb-3 pt-5">
        <p className="font-black text-lg uppercase tracking-widest text-black/80">Gram Panchayat</p>
        <p className="text-xs font-bold uppercase tracking-widest text-black/40 mt-1">Ballot Paper</p>
      </div>
      
      <div className="flex flex-col border-2 border-black/20 bg-white m-4">
        {CANDIDATES.map((candidate, idx) => (
          <div key={candidate.id}
            className="flex items-stretch border-b-2 border-black/20 last:border-b-0 h-[60px] cursor-pointer hover:bg-black/5 transition-colors relative"
            onClick={() => !votedFor && onVote(candidate.id)}
          >
            <div className="w-10 border-r-2 border-black/20 flex items-center justify-center font-bold text-lg text-black/60">
              {idx + 1}
            </div>
            <div className="flex-1 px-4 flex flex-col justify-center border-r-2 border-black/20">
              <span className="font-bold text-sm leading-tight text-black/80">{candidate.name}</span>
            </div>
            <div className="w-16 flex items-center justify-center text-2xl">
              {candidate.symbol}
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center bg-transparent pointer-events-none">
              {votedFor === candidate.id && (
                <motion.div
                  initial={{ scale: 0, rotate: -45, opacity: 0 }}
                  animate={{ scale: 1, rotate: -15, opacity: 1 }}
                  className="w-10 h-10 rounded-full border-[3px] border-purple-800 flex items-center justify-center opacity-90 shadow-sm bg-purple-100"
                >
                  <div className="w-5 h-5 border-t-[3px] border-l-[3px] border-purple-800 transform -rotate-45 -mt-1 -ml-1"></div>
                </motion.div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultsPhase() {
  const sorted = [...CANDIDATES].sort((a, b) => b.votes - a.votes);
  const winner = sorted[0];
  const totalVotes = CANDIDATES.reduce((acc, c) => acc + c.votes, 0);

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex flex-col gap-4">
        {sorted.map((c, i) => (
          <div key={c.id}>
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-white font-medium">{c.name} {i === 0 && <span className="ml-2 text-[10px] text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded-full">Winner</span>}</span>
              <span className="text-white font-bold">{c.votes} <span className="text-gray-500 font-normal text-xs uppercase">votes</span></span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(c.votes / totalVotes) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: c.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl p-8 text-center border border-white/5 bg-white/[0.02]">
        <p className="text-5xl mb-4">{winner.symbol}</p>
        <p className="text-2xl font-medium text-white mb-2 tracking-tight">{winner.name}</p>
        <p className="text-sm text-gray-400">
          Elected as the Sarpanch of the village
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
export default function VillageElection({ onBack }: { onBack?: () => void }) {
  const [idx, setIdx]         = useState(0);
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const phase  = PHASES[idx];
  const isLast = idx === PHASES.length - 1;
  const canNext = phase.id !== 'voting' || !!votedFor;

  const renderLeftText = () => {
    switch(phase.id) {
      case 'trigger': return "Panchayati Raj represents local self-government. Unlike national elections run by the ECI, the State Election Commission (SEC) organizes Panchayat elections.";
      case 'candidates': return "In villages, candidates often contest independently rather than on national party tickets. They are assigned free symbols by the SEC.";
      case 'campaign': return "Campaigns are highly localized and personal. Candidates go door-to-door discussing drains, village roads, water supply, and streetlights.";
      case 'voting': return "While some states use EVMs for panchayats, many still use traditional ballot papers and boxes. You stamp your vote next to the symbol.";
      case 'results': return "Votes are counted manually under the supervision of returning officers. The candidate with the most votes is elected Sarpanch.";
      default: return "";
    }
  };

  const renderFact = () => {
    switch(phase.id) {
      case 'trigger': return { title: "Three-Tier System", desc: "The system has 3 levels: Gram Panchayat (Village), Panchayat Samiti (Block), and Zila Parishad (District)." };
      case 'candidates': return { title: "Reservation", desc: "A significant portion of seats are reserved for SC, ST, and Women candidates to ensure inclusive local representation." };
      case 'campaign': return { title: "Close Knit Voting", desc: "Because the electorate is small, single votes matter immensely. Victory margins can sometimes be under 10 votes!" };
      case 'voting': return { title: "Indelible Ink", desc: "Just like central elections, polling officers mark your left index finger with purple indelible ink to prevent double voting." };
      case 'results': return { title: "Gram Sabha", desc: "Once the Panchayat is formed, they organize Gram Sabha meetings where all adult villagers can decide on local development work." };
      default: return { title: "", desc: "" };
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative text-white bg-transparent">
      {/* Minimal Header */}
      <div className="shrink-0 pt-2 pb-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Home className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Village Govt</span>
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
