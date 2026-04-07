import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: (username: string) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onComplete(username.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f7f7f7] flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="space-y-2">
          <div className="w-16 h-16 bg-[#2a6df4] rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-[#2a6df4]/20 mb-6">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-[#14181f] tracking-tight">
            Smart Planner
          </h1>
          <p className="text-gray-500 font-medium">
            Organize your chaos into clarity.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-[#2a6df4] transition-all text-sm font-semibold"
              autoFocus
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!username.trim()}
            className="w-full py-4 bg-[#2a6df4] text-white font-bold rounded-2xl shadow-lg shadow-[#2a6df4]/30 hover:bg-[#1e5ad4] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Get Started
            <ArrowRight size={20} />
          </motion.button>
        </form>

        <p className="text-xs text-gray-400">
          Your data is stored locally on this device.
        </p>
      </motion.div>
    </div>
  );
}
