import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, Timer, Volume2 } from 'lucide-react';
import { formatTime } from '../lib/utils';

export default function RestTimer({ initialSeconds = 90, onClose }) {
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
          if (navigator.vibrate) {
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
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.error(e);
    }
  };

  const setPreset = (sec) => {
    setTimeLeft(sec);
    setIsRunning(true);
    setIsFinished(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        drag
        dragConstraints={{ left: -100, right: 100, top: -200, bottom: 50 }}
        className="fixed bottom-20 md:bottom-6 right-4 z-50 bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl shadow-emerald-500/20 backdrop-blur-md w-72 sm:w-80 select-none cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <Timer className="w-4 h-4 animate-spin-slow" />
            <span>Temporizador de Descanso</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center my-2">
          <motion.div
            animate={isFinished ? { scale: [1, 1.15, 1], rotate: [0, -2, 2, 0] } : {}}
            transition={{ repeat: isFinished ? Infinity : 0, duration: 0.8 }}
            className={`text-4xl font-black tracking-tight font-mono transition-colors ${
              isFinished ? 'text-rose-400' : 'text-white'
            }`}
          >
            {formatTime(timeLeft)}
          </motion.div>
          {isFinished && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-emerald-400 font-bold mt-1 flex items-center justify-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" /> ¡Tiempo de descanso completado!
            </motion.p>
          )}
        </div>

        <div className="grid grid-cols-4 gap-1.5 my-3">
          {[30, 60, 90, 120].map((sec) => (
            <button
              key={sec}
              onClick={() => setPreset(sec)}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeLeft === sec 
                  ? 'bg-emerald-500 text-slate-950 font-extrabold' 
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            onClick={() => {
              setTimeLeft(initialSeconds);
              setIsRunning(true);
              setIsFinished(false);
            }}
            className="p-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-all"
            title="Reiniciar"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
              isRunning 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'bg-emerald-500 text-slate-950 font-extrabold'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" /> Pausar
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Reanudar
              </>
            )}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
