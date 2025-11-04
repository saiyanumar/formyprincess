import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Sparkles, Clock } from 'lucide-react';
import { Button } from './ui/button';
import {
  countdownNumberVariants,
  magicalRevealVariants,
  sparkleVariants,
  pulseGlowVariants,
  fadeInVariants,
} from '../lib/motion-components';

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
        bg-gradient-romantic
        overflow-hidden transition-all duration-1000
        ${backgroundFlash ? 'reveal-bg-flash' : ''}
      `}
    >
      {/* Ambient Background Elements */}
      <motion.div 
        variants={sparkleVariants}
        className="absolute inset-0 pointer-events-none"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            variants={sparkleVariants}
            custom={i}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              scale: Math.random() * 0.5 + 0.5,
            }}
          />
        ))}
      </motion.div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div 
          variants={fadeInVariants}
          className="space-y-12"
        >
          <motion.div 
            variants={magicalRevealVariants}
            className="space-y-6"
          >
            <motion.div 
              className="inline-block relative"
              variants={pulseGlowVariants}
              animate="animate"
            >
              <Clock 
                className="w-20 h-20 text-rose-500 animate-pulse-slow" 
                strokeWidth={1.5} 
              />
              <Sparkles 
                className="absolute -right-4 -top-4 w-8 h-8 text-golden animate-twinkle" 
              />
              <Heart 
                className="absolute -left-4 -bottom-4 w-6 h-6 text-rose-400 animate-heart-beat" 
              />
            </motion.div>

            <motion.h2 
              className="font-dancing text-5xl md:text-7xl bg-gradient-to-r from-deep-rose via-rose-gold to-deep-rose bg-clip-text text-transparent sparkle"
              variants={magicalRevealVariants}
            >
              The Magic Begins Soon
            </motion.h2>

            <motion.p 
              className="font-poppins text-lg text-rose-700/80 max-w-2xl mx-auto"
              variants={fadeInVariants}
            >
              Every second brings us closer to something special
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(timeLeft).map(([unit, value], index) => (
              <motion.div
                key={unit}
                variants={countdownNumberVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={index}
                className="relative group"
              >
                <motion.div 
                  className={`
                    bg-white/80 backdrop-blur-sm rounded-2xl p-6
                    shadow-romantic border border-rose-200
                    group-hover:shadow-glow transition-all duration-500
                    ${timeLeft.seconds <= 11 ? 'romantic-glow' : ''}
                  `}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <motion.div 
                    className={`
                      font-poppins text-4xl md:text-5xl font-bold
                      bg-gradient-to-br from-deep-rose via-rose-gold to-deep-rose
                      bg-clip-text text-transparent mb-2
                      group-hover:scale-110 transition-transform duration-300
                    `}
                    key={value} // Force re-render on value change
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    {value.toString().padStart(2, '0')}
                  </motion.div>
                  <motion.div 
                    className="font-dancing text-xl bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent capitalize"
                    variants={fadeInVariants}
                  >
                    {unit}
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="flex justify-center mt-8"
            variants={fadeInVariants}
          >
            <Button
              onClick={handleReveal}
              disabled={!isComplete}
              className={`
                relative overflow-hidden px-8 py-4 rounded-full text-lg 
                font-semibold shadow-lg transition-all duration-500 
                ${isComplete 
                  ? 'bg-gradient-to-r from-rose-500 via-rose-400 to-rose-500 text-white reveal-glow hover:shadow-xl' 
                  : 'bg-rose-300/50 text-white/70 cursor-not-allowed'
                }
              `}
            >
              <motion.span
                initial={false}
                animate={isComplete ? "visible" : "hidden"}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                {isComplete ? 'Surprise Unlocked!' : 'Waiting for the moment...'}
              </motion.span>
              {isComplete && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    background: [
                      'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 50%)',
                      'radial-gradient(circle at center, rgba(255,255,255,0) 0%, transparent 50%)'
                    ]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CountdownSection;