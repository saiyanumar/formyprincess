import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, Sparkles, Clock } from "lucide-react";
import { Button } from "./ui/button";
import "./CountdownSection.enhanced.css";

interface CountdownSectionProps {
  onComplete: () => void;
}

interface SparkleAnimation {
  id: number;
  left: number;
  top: number;
  scale: number;
  rotation: number;
  delay: number;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TARGET_DATE = new Date('2025-10-30T23:57:00');

const CountdownSection: React.FC<CountdownSectionProps> = ({ onComplete }) => {
  const [revealStarted, setRevealStarted] = useState(false);
  // Since we're past the target date (Oct 31, 2025), initialize as complete
  const [isComplete, setIsComplete] = useState(true);
  const [hasPlayedAlert, setHasPlayedAlert] = useState(false);
  const [hasPlayedCheer, setHasPlayedCheer] = useState(false);
  const [backgroundFlash, setBackgroundFlash] = useState(false);
  const [sparkles, setSparkles] = useState<SparkleAnimation[]>([]);
  const alertSoundRef = useRef<HTMLAudioElement | null>(null);
  const cheerSoundRef = useRef<HTMLAudioElement | null>(null);

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

  // Add optimized styles for effects
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }

      @keyframes pulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
        50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.4; }
      }

      @keyframes shimmer {
        100% { transform: translateX(100%); }
      }

      .time-unit-card {
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0 8px 32px rgba(244, 114, 182, 0.15);
        transition: all 0.3s ease;
      }

      .enhanced-sparkle {
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
        position: absolute;
        pointer-events: none;
      }

      .magic-button {
        transition: all 0.3s ease;
      }

      .magic-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(244, 114, 182, 0.2);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const calculateInitialTimeLeft = () => {
    const now = new Date();
    const difference = TARGET_DATE.getTime() - now.getTime();

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return {
      days: Math.max(0, days),
      hours: Math.max(0, hours),
      minutes: Math.max(0, minutes),
      seconds: Math.max(0, seconds)
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateInitialTimeLeft());

  // Handler that performs the reveal and calls onComplete
  const handleReveal = useCallback(() => {
    if (!isComplete) return;
    onComplete();
  }, [isComplete, onComplete]);

  // Tick the countdown
  useEffect(() => {
    // Since we're past the target date, set initial state
    if (!isComplete) {
      setIsComplete(true);
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      
      // Create optimized celebration sparkles
      const createSparkleWave = () => {
        const count = 16;
        return Array.from({ length: count }).map((_, i) => {
          const angle = (Math.PI * 2 * i) / count;
          const radius = 40 + (i % 3) * 20;
          return {
            id: Date.now() + i,
            left: 50 + Math.cos(angle) * radius,
            top: 50 + Math.sin(angle) * radius,
            scale: 0.8 + (i % 3) * 0.2,
            rotation: i * 45,
            delay: i * 0.05
          };
        });
      };

      setSparkles(createSparkleWave());
      
      // Clean up after animation
      setTimeout(() => {
        setSparkles([]);
      }, 2000);

      setRevealStarted(true);
      setBackgroundFlash(true);
      setTimeout(() => setBackgroundFlash(false), 3000);

      // Load and launch confetti
      const loadConfetti = async () => {
        try {
          const confetti = await import('canvas-confetti').then(m => m.default);
          const count = 150;
          const defaults = {
            origin: { y: 0.7 },
            gravity: 1,
            ticks: 200,
            decay: 0.94,
            startVelocity: 30,
            shapes: ['star', 'circle'],
            colors: ['#FFB7C5', '#FFC0CB', '#FFE4E1', '#FFD700']
          };

          function fire(particleRatio: number, opts: any) {
            confetti({
              ...defaults,
              ...opts,
              particleCount: Math.floor(count * particleRatio),
            });
          }

          fire(0.3, {
            spread: 40,
            startVelocity: 25,
            origin: { y: 0.75 }
          });

          setTimeout(() => {
            fire(0.2, {
              spread: 60,
              origin: { x: 0.4, y: 0.65 },
              colors: ['#FFD700', '#FFB7C5']
            });
            fire(0.2, {
              spread: 60,
              origin: { x: 0.6, y: 0.65 },
              colors: ['#FFC0CB', '#FFE4E1']
            });
          }, 300);

          setTimeout(() => {
            fire(0.15, {
              spread: 100,
              decay: 0.91,
              origin: { y: 0.7 },
              colors: ['#FFD700', '#FFE4E1']
            });
          }, 600);

        } catch (e) {
          console.error('Failed to load confetti:', e);
        }
      };
      
      loadConfetti();
    }

    // No need for interval since we're past the target date
    return () => {};
  }, [isComplete]);

  return (
    <section className={`relative min-h-screen py-24 px-6 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 overflow-hidden ${backgroundFlash ? 'reveal-bg-flash' : ''}`}>
      {isComplete && (
        <div className="fixed inset-0 pointer-events-none">
          <div 
            className="absolute rounded-full bg-gradient-to-r from-rose-300/30 via-pink-400/30 to-rose-300/30"
            style={{ 
              width: 200,
              height: 200,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(20px)',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
        </div>
      )}

      {[...Array(6)].map((_, i) => {
        const Icon = i % 3 === 0 ? Heart : i % 2 === 0 ? Star : Sparkles;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ 
              delay: i * 0.2,
              duration: 1,
              ease: "easeOut"
            }}
            className="absolute pointer-events-none"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              transform: `rotate(${i * 60}deg)`,
            }}
          >
            <Icon
              className="w-8 h-8 text-rose-200"
              style={{
                animation: `float ${8 + i}s infinite ease-in-out`,
                animationDelay: `${i * 0.5}s`,
              }}
              fill="currentColor"
            />
          </motion.div>
        );
      })}

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-12"
        >
          <div className="space-y-6">
            <motion.div 
              className="inline-block relative"
              animate={{
                rotate: [0, 360],
                transition: { duration: 20, repeat: Infinity, ease: "linear" }
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  filter: ["blur(0px)", "blur(1px)", "blur(0px)"],
                  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Clock className="w-20 h-20 text-rose-500" strokeWidth={1.5} />
              </motion.div>
              <motion.div
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [0.8, 1.2, 0.8],
                  transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute -right-4 -top-4"
              >
                <Sparkles className="w-8 h-8 text-rose-400" />
              </motion.div>
            </motion.div>
            
            <motion.h2 
              className="romantic-title font-dancing text-5xl md:text-7xl"
              animate={{
                filter: ["drop-shadow(0 0 20px rgba(244,114,182,0.3))", "drop-shadow(0 0 40px rgba(244,114,182,0.5))", "drop-shadow(0 0 20px rgba(244,114,182,0.3))"],
                transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              The Magic Begins Soon
            </motion.h2>
            
            <motion.p 
              className="font-poppins text-lg text-rose-700/80 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Every second brings us closer to something special
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(timeLeft).map(([unit, value], index) => (
              <motion.div
                key={unit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="time-unit-card rounded-2xl p-6 transition-all duration-300 group-hover:translate-y-[-4px]">
                  <motion.div
                    key={value}
                    className="number-display font-poppins text-4xl md:text-5xl font-bold mb-2"
                    initial={false}
                    animate={{ 
                      scale: value !== timeLeft[unit] ? [1.1, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {value.toString().padStart(2, "0")}
                  </motion.div>
                  
                  <div className="font-dancing text-xl text-rose-500 capitalize">
                    {unit}
                  </div>
                  
                  {isComplete && (
                    <motion.div
                      className="enhanced-sparkle"
                      style={{
                        left: '50%',
                        top: '50%',
                      }}
                      animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0.5, 1.2, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                  )}
                </div>
                
                {isComplete && (
                  <motion.div
                    className="absolute -top-2 -right-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart className="w-6 h-6 text-rose-400" fill="currentColor" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="relative">
              <motion.div
                className="h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent max-w-sm mx-auto"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scaleX: [0.95, 1.05, 0.95],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-50 px-4"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="w-6 h-6 text-rose-400" fill="currentColor" />
              </motion.div>
            </div>

            <motion.p
              className="font-dancing text-2xl text-rose-600/80"
              animate={{
                opacity: [0.7, 1, 0.7],
                scale: [0.98, 1.02, 0.98],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Preparing something magical for you...
            </motion.p>

            <motion.div 
              className="flex justify-center gap-2"
              animate={{
                y: [0, -2, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-5 h-5 text-rose-400" />
              </motion.div>
              <motion.p
                className="font-poppins text-rose-700/60 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {isComplete ? "Your journey awaits..." : "The anticipation builds..."}
              </motion.p>
              <motion.div
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  rotate: [0, -180, -360],
                }}
                transition={{ duration: 2, delay: 0.3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-5 h-5 text-rose-400" />
              </motion.div>
            </motion.div>

            <div className="flex justify-center mt-12 relative">
              <AnimatePresence>
                {isComplete && (
                  <>
                    <div
                      className="absolute rounded-full bg-gradient-to-r from-rose-300/30 via-pink-400/30 to-rose-300/30"
                      style={{ 
                        width: 200,
                        height: 200,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        filter: 'blur(20px)',
                        animation: 'pulse 2s ease-in-out infinite'
                      }}
                    />
                    
                    <motion.div
                      key="inner-glow"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute rounded-full bg-gradient-to-r from-rose-400/40 to-pink-400/40"
                      style={{ 
                        width: 160,
                        height: 160,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        filter: 'blur(15px)',
                      }}
                    />
                  </>
                )}
              </AnimatePresence>

              <motion.div 
                style={{ zIndex: 10 }}
                animate={revealStarted ? {
                  scale: [1, 1.06, 1],
                  transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                } : {}}
              >
                <Button
                  onClick={handleReveal}
                  disabled={!isComplete}
                  className={`magic-button px-8 py-4 rounded-full text-lg font-semibold shadow-lg
                    transition-all duration-300
                    ${isComplete 
                      ? "bg-rose-500 hover:bg-rose-600 text-white transform hover:-translate-y-1" 
                      : "bg-rose-300 text-white/70 cursor-not-allowed"
                    }`}
                >
                  {isComplete && (
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      style={{
                        animation: 'shimmer 2s linear infinite',
                        transform: 'translateX(-100%)'
                      }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-2 transition-transform duration-300">
                    {isComplete ? (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Surprise Unlocked!</span>
                        <Sparkles className="w-5 h-5" />
                      </>
                    ) : (
                      'Waiting for the moment...'
                    )}
                  </div>
                </Button>

                {isComplete && sparkles.map(s => (
                  <motion.div
                    key={s.id}
                    className="enhanced-sparkle"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, s.scale, 0],
                      rotate: [0, s.rotation, s.rotation * 2],
                    }}
                    style={{
                      left: `${s.left}%`,
                      top: `${s.top}%`,
                    }}
                    transition={{
                      duration: 1.2,
                      delay: s.delay,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CountdownSection;