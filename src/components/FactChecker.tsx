'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, ArrowRight, Forward, Share2, CornerDownRight } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  isTrue: boolean;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "⚠️ URGENT: EVMs are connected to the internet and can be hacked from abroad! Forward to everyone to save democracy! 🔄",
    isTrue: false,
    explanation: "EVMs are standalone machines, like calculators. They have no wireless communication capabilities (no Wi-Fi, Bluetooth, or RF) and cannot be connected to any network."
  },
  {
    id: 2,
    text: "✅ Did you know? You can still vote even if you lost your Voter ID card, as long as your name is on the electoral roll.",
    isTrue: true,
    explanation: "The ECI allows 11 alternative photo identity documents (like Aadhar, PAN card, Driving License) if your name is present in the electoral roll."
  },
  {
    id: 3,
    text: "🚨 If NOTA (None Of The Above) gets the highest votes, the election is cancelled and new candidates must be chosen! 🗳️",
    isTrue: false,
    explanation: "NOTA does not have a 'right to reject'. Even if NOTA gets the maximum votes, the candidate with the next highest number of votes is declared the winner."
  },
  {
    id: 4,
    text: "📱 The ruling party has promised free 5G laptops to all students in tomorrow's election! Vote for them!",
    isTrue: false,
    explanation: "Once the Model Code of Conduct (MCC) is enforced, governments cannot announce any new financial grants, promises, or schemes that could influence voters."
  },
  {
    id: 5,
    text: "🔍 You can verify if your candidate has a criminal record by checking the 'Know Your Candidate' (KYC) app by the Election Commission.",
    isTrue: true,
    explanation: "The KYC app and the ECI website mandate all candidates to publicly declare their criminal antecedents, assets, and liabilities."
  }
];

export default function FactChecker({ onBack }: { onBack: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  const question = QUESTIONS[currentIndex];

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === question.isTrue) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(i => i + 1);
      setShowResult(false);
      setSelectedAnswer(null);
    } else {
      setGameFinished(true);
    }
  };

  if (gameFinished) {
    const isPerfect = score === QUESTIONS.length;
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-[#0B0F19] border border-white/5 shadow-2xl">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-xl"
          style={{ background: isPerfect ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
          {isPerfect ? <ShieldCheck className="w-12 h-12 text-white" /> : <ShieldAlert className="w-12 h-12 text-white" />}
        </motion.div>
        
        <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
          {isPerfect ? 'Digital Defender' : 'Voter In Training'}
        </h2>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
          You scored <strong className="text-white">{score} out of {QUESTIONS.length}</strong>. <br /><br />
          {isPerfect 
            ? "Perfect score! You can spot misinformation easily. Democracy is safe in your hands." 
            : "Misinformation is designed to trick you. Always verify claims before forwarding them!"}
        </p>

        <div className="flex gap-4 w-full max-w-sm">
          <button onClick={onBack} className="flex-1 py-4 rounded-xl text-base font-bold transition-colors bg-white/5 hover:bg-white/10 text-white border border-white/10">
            Exit
          </button>
          <button onClick={() => { setScore(0); setCurrentIndex(0); setGameFinished(false); setShowResult(false); setSelectedAnswer(null); }} 
            className="flex-1 py-4 rounded-xl text-base font-bold text-white transition-transform active:scale-95 shadow-lg shadow-pink-500/25"
            style={{ background: 'linear-gradient(135deg, #EC4899, #BE185D)' }}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const progressPct = ((currentIndex) / QUESTIONS.length) * 100;

  return (
    <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden relative bg-[#0B0F19] border border-white/5 shadow-2xl">
      
      {/* Progress Bar Top */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5 z-20">
        <motion.div 
          className="h-full bg-pink-500" 
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Header */}
      <div className="shrink-0 px-6 py-5 flex items-center justify-between border-b border-white/5 bg-white/5 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-pink-500/10 border border-pink-500/20">
            <ShieldAlert className="w-5 h-5 text-pink-500" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight">Fact Guard</h2>
            <p className="text-xs text-gray-400 font-medium">Spot the Fake News</p>
          </div>
        </div>
        <div className="text-sm font-bold px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white">
          Score: <span className={score > 0 ? "text-green-400" : ""}>{score}</span> / {QUESTIONS.length}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6 md:p-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-lg"
          >
            {/* The Message Bubble (High Contrast, Clean) */}
            <div className="relative bg-white rounded-3xl rounded-tl-sm p-6 md:p-8 mb-8 shadow-xl">
              {/* Fake message tail */}
              <div className="absolute top-0 -left-3 w-4 h-4 bg-white" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
              
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold mb-3 italic uppercase tracking-widest">
                <Forward className="w-3.5 h-3.5" /> Forwarded many times
              </div>
              
              <p className="text-lg md:text-xl leading-relaxed text-gray-900 font-medium">
                {question.text}
              </p>
            </div>

            {/* Answer Buttons */}
            {!showResult ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer(false)}
                  className="group relative flex items-center justify-center gap-3 py-5 rounded-2xl font-extrabold text-lg text-white bg-[#EF4444] hover:bg-[#DC2626] transition-all active:scale-95 shadow-[0_4px_0_#991B1B] hover:shadow-[0_2px_0_#991B1B] hover:translate-y-[2px] active:shadow-[0_0px_0_#991B1B] active:translate-y-[4px]"
                >
                  <XCircle className="w-6 h-6" /> FAKE
                </button>
                <button
                  onClick={() => handleAnswer(true)}
                  className="group relative flex items-center justify-center gap-3 py-5 rounded-2xl font-extrabold text-lg text-white bg-[#10B981] hover:bg-[#059669] transition-all active:scale-95 shadow-[0_4px_0_#065F46] hover:shadow-[0_2px_0_#065F46] hover:translate-y-[2px] active:shadow-[0_0px_0_#065F46] active:translate-y-[4px]"
                >
                  <CheckCircle2 className="w-6 h-6" /> REAL
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="rounded-2xl p-6 md:p-8 border-2 shadow-2xl relative overflow-hidden"
                style={{
                  backgroundColor: '#1E293B',
                  borderColor: selectedAnswer === question.isTrue ? '#10B981' : '#EF4444'
                }}
              >
                {/* Subtle background glow */}
                <div className="absolute top-0 left-0 w-full h-1 opacity-20" style={{ background: selectedAnswer === question.isTrue ? '#10B981' : '#EF4444' }} />

                <div className="flex items-center gap-3 mb-4">
                  {selectedAnswer === question.isTrue ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-red-400 shrink-0" />
                  )}
                  <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                    {selectedAnswer === question.isTrue ? 'Spot on!' : 'Don\'t fall for it!'}
                  </h3>
                </div>
                
                <div className="bg-white/5 rounded-xl p-5 mb-6 border border-white/5">
                  <p className="text-base md:text-lg leading-relaxed text-gray-200">
                    {question.explanation}
                  </p>
                </div>
                
                <button
                  onClick={handleNext}
                  className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-bold text-white transition-transform active:scale-95"
                  style={{ background: selectedAnswer === question.isTrue ? '#10B981' : '#EF4444' }}
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
