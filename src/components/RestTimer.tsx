import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, Timer } from 'lucide-react';
import { formatTime } from '../lib/utils';

interface RestTimerProps {
  initialSeconds?: number;
  onClose: () => void;
}

export default function RestTimer({ initialSeconds = 90, onClose }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

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
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
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
      console.log('[RestTimer] Audio notification error:', e);
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
        role="timer"
        aria-label="Temporizador de descanso entre series"
        aria-live="polite"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        drag
        dragConstraints={{ left: -100, right: 100, top: -200, bottom: 50 }}
        className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-50 w-72 sm:w-80 bg-surface/95 border border-border backdrop-blur-xl rounded-2xl p-4 shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing text-foreground transition-colors"
      >
        <div className="flex items-center justify-between mb-3 border-b border-border pb-2.5">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isFinished ? 'bg-rose-500/20 text-rose-500 animate-pulse' : 'bg-emerald-500/20 text-emerald-500'}`}>
              <Timer className="w-4 h-4" aria-hidden="true" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-foreground">
              {isFinished ? '¡Tiempo Cumplido!' : 'Descanso'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar temporizador de descanso"
            className="text-muted hover:text-foreground p-1 rounded-lg hover:bg-surface-secondary transition-all cursor-pointer"
            title="Cerrar temporizador"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="relative py-2 text-center">
          <motion.div
            key={timeLeft}
            animate={{ scale: isFinished ? [1, 1.08, 1] : 1 }}
            transition={{ repeat: isFinished ? Infinity : 0, duration: 1 }}
            className={`text-4xl font-black tracking-tight tabular-nums font-mono ${
              isFinished ? 'text-rose-500' : 'text-foreground'
            }`}
          >
            {formatTime(timeLeft)}
          </motion.div>

          <div className="w-full bg-surface-secondary h-2.5 rounded-full overflow-hidden mt-3 border border-border">
            <div
              className={`h-full transition-all duration-300 ${
                isFinished ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-4 pt-2 border-t border-border">
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => handleAddSeconds(30)}
              aria-label="Sumar 30 segundos de descanso"
              className="text-[11px] font-bold bg-surface hover:bg-surface-secondary text-foreground border border-border px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs"
            >
              +30&nbsp;s
            </button>
            <button
              type="button"
              onClick={() => handleAddSeconds(60)}
              aria-label="Sumar 60 segundos de descanso"
              className="text-[11px] font-bold bg-surface hover:bg-surface-secondary text-foreground border border-border px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs"
            >
              +60&nbsp;s
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setTimeLeft(initialSeconds);
                setIsRunning(true);
                setIsFinished(false);
              }}
              aria-label="Reiniciar temporizador"
              className="p-2 text-muted hover:text-foreground rounded-xl hover:bg-surface-secondary transition-all cursor-pointer border border-border"
              title="Reiniciar"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setIsRunning(!isRunning)}
              aria-label={isRunning ? 'Pausar temporizador' : 'Iniciar temporizador'}
              className={`h-9 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isRunning
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30 hover:bg-amber-500/30'
                  : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-sm'
              }`}
              title={isRunning ? 'Pausar' : 'Iniciar'}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" aria-hidden="true" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                  <span>Iniciar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
