import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';
import { fireConfetti } from '@/lib/confetti';
import '@/components/WillYouBeMyWife.css';

const lines = [
  'Ruqayya, the girl jisme meri jaan hai...',
  'Will you be my wife? ❤️',
];

const WillYouBeMyWife: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const yesAudioRef = useRef<HTMLAudioElement | null>(null);
  const thinkAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 1000);
    const timer2 = setTimeout(() => setStep(2), 3000);
    const timer3 = setTimeout(() => setShowButtons(true), 5000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleYes = () => {
    setAccepted(true);
    setShowConfetti(true);
    try {
      if (yesAudioRef.current) {
        yesAudioRef.current.currentTime = 0;
        yesAudioRef.current.play().catch(() => {});
      }
    } catch {}
    fireConfetti();
    // show follow-up text briefly then call onComplete
    setTimeout(() => {
      setShowConfetti(false);
      if (onComplete) onComplete();
    }, 8000);
  };

  const handleThink = () => {
    setThinking(true);
    try {
      if (thinkAudioRef.current) {
        thinkAudioRef.current.currentTime = 0;
        thinkAudioRef.current.play().catch(() => {});
      }
    } catch {}
    setTimeout(() => setThinking(false), 2000);
  };

  // initialize audio elements once
  useEffect(() => {
    try {
      yesAudioRef.current = new Audio('/yesforever.mp3');
      thinkAudioRef.current = new Audio('/letmethink.mp3');
      if (yesAudioRef.current) yesAudioRef.current.volume = 0.7;
      if (thinkAudioRef.current) thinkAudioRef.current.volume = 0.7;
    } catch {}

    return () => {
      try {
        yesAudioRef.current?.pause();
        thinkAudioRef.current?.pause();
      } catch {}
      yesAudioRef.current = null;
      thinkAudioRef.current = null;
    };
  }, []);

  // Floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 3,
  }));

  return (
    <div 
      ref={containerRef}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-1000 ${
        accepted 
          ? 'bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600' 
          : 'bg-gradient-to-br from-rose-100 via-pink-200 to-pink-300'
      }`}
    >
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
          colors={['#fb7185', '#f43f5e', '#fda4af', '#fbbf24', '#ffffff']}
        />
      )}

      {/* Ambient glow layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-300/30 rounded-full blur-3xl animate-float" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{ left: particle.left }}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ 
              y: '-20vh', 
              opacity: [0, 1, 1, 0],
              x: [0, 20, -20, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {particle.id % 2 === 0 ? (
              <Heart className="w-4 h-4 md:w-6 md:h-6 text-rose-400/60 fill-rose-400/60" />
            ) : (
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-pink-400/60" />
            )}
          </motion.div>
        ))}
      </div>

{/* Floating hearts & text AT THE TOP of the screen */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1.5 }}
  className="absolute inset-x-0 bottom-10 flex items-center justify-center z-0 pointer-events-none overflow-hidden"
>
  {/* Soft glowing aura */}
  <div className="absolute w-[500px] h-[500px] rounded-full bg-rose-300/20 blur-3xl animate-pulse" />

  {/* Floating hearts animation */}
  {[...Array(10)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute text-rose-400/60 text-2xl"
      style={{
  top: `${50 + Math.random() * 50}%`,
  // Avoid the middle 30–70% zone (keeps center clear)
  left: `${Math.random() < 0.6 
    ? 5 + Math.random() * 25 
    : 90 + Math.random() * 25}%`,
}}

      animate={{
        y: [0, -20, 0],
        opacity: [0.5, 1, 0.5],
        scale: [1, 1.1, 1],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: 6 + Math.random() * 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      ❤️
    </motion.div>
  ))}

  {/* Umar ❤️ Ruqayya floating text */}
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{
      opacity: [0.4, 1, 0.4],
      y: [0, -5, 0],
    }}
    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    className="font-dancing text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-pink-500 to-rose-600 drop-shadow-lg"
  >
    Umar ❤️ Ruqayya
  </motion.div>
</motion.div>




      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pre-acceptance content */}
        {!accepted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 md:space-y-12"
          >
            {/* First line */}
            <AnimatePresence>
              {step >= 1 && (
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-3xl md:text-5xl lg:text-6xl font-dancing text-rose-700 leading-tight"
                >
                  {lines[0]}
                </motion.h2>
              )}
            </AnimatePresence>

            {/* Main question */}
            <AnimatePresence>
              {step >= 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-400/20 to-transparent blur-xl"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-dancing font-bold text-rose-800 animate-pulse-glow">
                    {lines[1]}
                  </h1>
                  <motion.div
                    className="absolute -inset-4 border-2 border-rose-400/30 rounded-3xl"
                    animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <AnimatePresence>
              {showButtons && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center pt-8"
                >
                  <motion.button
                    onClick={handleYes}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xl md:text-2xl font-playfair font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                    <span className="relative flex items-center gap-2">
                      <Heart className="w-6 h-6 fill-white" />
                      Yes, forever ❤️
                    </span>
                  </motion.button>

                  <motion.button
                    onClick={handleThink}
                    animate={thinking ? { x: [-5, 5, -5, 5, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 md:px-12 py-4 md:py-5 bg-white/80 backdrop-blur-sm text-rose-600 text-xl md:text-2xl font-playfair font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300"
                  >
                    🥺 Let me think…
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Thinking message */}
            <AnimatePresence>
              {thinking && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-lg md:text-xl font-playfair text-rose-700 italic"
                >
                  Hahaha tm toh gyi ab khair nhi tmhari… Raze ba na mala 😉
                </motion.p>
              )}
            </AnimatePresence>

            {/* Quote */}
            {showButtons && !thinking && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="text-base md:text-lg font-playfair text-rose-600/80 italic max-w-2xl mx-auto"
              >
                "Every heartbeat, every second — it's all for you."
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Post-acceptance content */}
        {accepted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 md:space-y-8"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-20 h-20 md:w-32 md:h-32 mx-auto text-white fill-white drop-shadow-lg" />
            </motion.div>
            
            <motion.h1
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-5xl md:text-7xl lg:text-8xl font-dancing font-bold text-white drop-shadow-2xl"
            >
             Qurban Sham Tana Zama Janana 😭❤️
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl md:text-3xl font-playfair text-white/90"
            >
              You've made me the happiest person alive
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex gap-4 justify-center pt-6"
            >
              <Heart className="w-12 h-12 text-white fill-white animate-pulse-glow" />
              <Heart className="w-12 h-12 text-white fill-white animate-pulse-glow" style={{ animationDelay: '0.2s' }} />
              <Heart className="w-12 h-12 text-white fill-white animate-pulse-glow" style={{ animationDelay: '0.4s' }} />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WillYouBeMyWife;