import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Timer, Volume2 } from 'lucide-react';
import { formatTime } from '../lib/utils';

export default function RestTimer({ initialSeconds = 90, onClose }) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsFinished(true);
      playAlertBeep();
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

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
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl shadow-emerald-500/20 backdrop-blur-md w-72 sm:w-80 animate-in fade-in slide-in-from-bottom-5">
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
        <div className={`text-4xl font-black tracking-tight font-mono transition-all ${
          isFinished ? 'text-rose-400 animate-bounce' : 'text-white'
        }`}>
          {formatTime(timeLeft)}
        </div>
        {isFinished && (
          <p className="text-xs text-emerald-400 font-bold mt-1 flex items-center justify-center gap-1">
            <Volume2 className="w-3.5 h-3.5" /> ¡Tiempo de descanso completado!
          </p>
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
    </div>
  );
}
