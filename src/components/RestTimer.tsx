import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, Timer, Volume2 } from 'lucide-react';
import { formatTime } from '../lib/utils';

interface RestTimerProps {
  initialSeconds?: number;
  onClose: () => void;
}

export default function RestTimer({ initialSeconds = 90, onClose }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          setIsFinished(true);
          playAlertBeep();
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const playAlertBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio context warning:', e);
    }
  };

  const handleAddSeconds = (sec: number) => {
    setTimeLeft((prev) => prev + sec);
    if (isFinished) {
      setIsFinished(false);
      setIsRunning(true);
    }
  };

  const progressPercent = Math.min(100, Math.max(0, ((initialSeconds - timeLeft) / initialSeconds) * 100));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        drag
        dragConstraints={{ left: -100, right: 100, top: -200, bottom: 50 }}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-72 sm:w-80 bg-slate-900/95 border border-slate-800 backdrop-blur-xl rounded-2xl p-4 shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isFinished ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'}`}>
              <Timer className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {isFinished ? '¡Tiempo Cumplido!' : 'Temporizador de Descanso'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
            title="Cerrar temporizador"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative py-2 text-center">
          <motion.div
            key={timeLeft}
            animate={{ scale: isFinished ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: isFinished ? Infinity : 0, duration: 1 }}
            className={`text-4xl font-black tracking-tight ${
              isFinished ? 'text-rose-400' : 'text-white'
            }`}
          >
            {formatTime(timeLeft)}
          </motion.div>

          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-3 border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                isFinished ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-4 pt-2 border-t border-slate-800/60">
          <div className="flex gap-1">
            <button
              onClick={() => handleAddSeconds(30)}
              className="text-[11px] font-bold bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2 py-1 rounded-lg transition-all"
            >
              +30s
            </button>
            <button
              onClick={() => handleAddSeconds(60)}
              className="text-[11px] font-bold bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2 py-1 rounded-lg transition-all"
            >
              +60s
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setTimeLeft(initialSeconds);
                setIsRunning(true);
                setIsFinished(false);
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
              title="Reiniciar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`p-2 rounded-xl font-bold flex items-center justify-center transition-all ${
                isRunning
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              }`}
              title={isRunning ? 'Pausar' : 'Iniciar'}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
