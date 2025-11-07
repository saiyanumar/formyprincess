import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Sparkles, Clock } from 'lucide-react';
import { Button } from './ui/button';

interface CountdownSectionProps {
  onComplete: () => void;
}

// Set target date for testing (30 seconds from now)
const TARGET_DATE = new Date(Date.now() + 30000);

const CountdownSection: React.FC<CountdownSectionProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [isComplete, setIsComplete] = useState(false);
  const [revealStarted, setRevealStarted] = useState(false);
  const [backgroundFlash, setBackgroundFlash] = useState(false);
  
  // Sound references
  const alertSoundRef = useRef<HTMLAudioElement | null>(null);
  const cheerSoundRef = useRef<HTMLAudioElement | null>(null);

  // Clean up sounds on unmount
  useEffect(() => {
    return () => {
      if (alertSoundRef.current) {
        alertSoundRef.current.pause();
        alertSoundRef.current = null;
      }
      if (cheerSoundRef.current) {
        cheerSoundRef.current.pause();
        cheerSoundRef.current = null;
      }
    };
  }, []);

  // Handle countdown and sounds
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const difference = TARGET_DATE.getTime() - now.getTime();

      // Handle countdown completion
      if (difference <= 0) {
        if (!isComplete) {
          setIsComplete(true);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          
          // Play cheer sound
          if (!cheerSoundRef.current) {
            const audio = new Audio('/cheering.wav');
            audio.volume = 0.8;
            audio.play().catch(() => {});
            cheerSoundRef.current = audio;
          }

          // Visual effects
          setBackgroundFlash(true);
          setTimeout(() => setBackgroundFlash(false), 3000);
          setRevealStarted(true);
        }
        return;
      }

      // Handle alert sound at 12 seconds
      if (difference <= 12000 && difference > 0) {
        if (!alertSoundRef.current) {
          const audio = new Audio('/countdown-alert.mp3');
          audio.volume = 0.7;
          audio.play().catch(() => {});
          alertSoundRef.current = audio;
        }
      } else if (alertSoundRef.current) {
        alertSoundRef.current.pause();
        alertSoundRef.current.remove();
        alertSoundRef.current = null;
      }

      // Update countdown values
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      setTimeLeft({
        days: Math.max(0, days),
        hours: Math.max(0, hours),
        minutes: Math.max(0, minutes),
        seconds: Math.max(0, seconds)
      });
    };

    // Start ticking
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [isComplete]);

  // Handle reveal button click
  const handleReveal = useCallback(() => {
    if (!isComplete) return;
    onComplete();
  }, [isComplete, onComplete]);

  return (
        <motion.section 
      initial="hidden"
      animate="visible"
      className={`
        relative min-h-screen py-24 px-6 
        overflow-hidden transition-all duration-1000
        ${backgroundFlash ? 'reveal-bg-flash' : ''}
      `}
    >
      <AmbientBackground 
        intensity={timeLeft.seconds <= 11 ? "high" : "medium"}
        theme={isComplete ? "celebration" : "romantic"}
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-12"
        >
          <div className="space-y-6">
            <div className="inline-block relative">
              <Clock className="w-20 h-20 text-rose-500 animate-pulse-slow" strokeWidth={1.5} />
              <Sparkles className="absolute -right-4 -top-4 w-8 h-8 text-rose-400 animate-twinkle" />
            </div>
            <h2 className="font-dancing text-5xl md:text-7xl text-rose-600 sparkle">
              The Magic Begins Soon
            </h2>
            <p className="font-poppins text-lg text-rose-700/80 max-w-2xl mx-auto">
              Every second brings us closer to something special
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(timeLeft).map(([unit, value], index) => (
              <motion.div
                key={unit}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-rose-200 group hover:shadow-rose-200/50 transition-all duration-500">
                  <div className="font-poppins text-4xl md:text-5xl font-bold text-rose-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {value.toString().padStart(2, '0')}
                  </div>
                  <div className="font-dancing text-xl text-rose-500 capitalize">
                    {unit}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={handleReveal}
              disabled={!isComplete}
              className={`px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all duration-500 
                ${isComplete 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                  : 'bg-rose-300 text-white/70 cursor-not-allowed'
                }`}
            >
              {isComplete ? 'Surprise Unlocked!' : 'Waiting for the moment...'}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CountdownSection;