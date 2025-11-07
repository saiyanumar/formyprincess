import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
  type: "heart" | "sparkle" | "bokeh";
}

const EnhancedCelebration: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Initial confetti burst
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const colors = ["#FFB6C1", "#FFD700", "#FFC0CB", "#FFFFFF"];

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });
    }, 250);

    // Generate particles
    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
      size: 0.5 + Math.random() * 1.5,
      type: ["heart", "sparkle", "bokeh"][Math.floor(Math.random() * 3)] as Particle["type"],
    }));
    setParticles(newParticles);

    // Show message after 5 seconds
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const handleContinue = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50">
      {/* Aurora background animation */}
      <div 
        className="absolute inset-0 opacity-60 animate-aurora"
        style={{
          background: "linear-gradient(135deg, rgba(255, 182, 193, 0.4), rgba(255, 192, 203, 0.4), rgba(255, 215, 0, 0.4), rgba(255, 255, 255, 0.2))",
          backgroundSize: "400% 400%",
        }}
      />

      {/* Radial glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-rose-300/30 via-pink-200/20 to-transparent rounded-full blur-3xl animate-pulse-glow" />

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: `${particle.size}rem`,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: -100,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {particle.type === "heart" && (
            <Heart className="fill-rose-400 text-rose-400 opacity-70" />
          )}
          {particle.type === "sparkle" && (
            <Sparkles className="text-amber-300 opacity-80" />
          )}
          {particle.type === "bokeh" && (
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-300 to-amber-200 blur-sm opacity-50" />
          )}
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          {/* Main celebration text */}
          <motion.div
            className="relative"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="absolute inset-0 blur-2xl opacity-50">
              <h1 className="font-elegant text-8xl md:text-[12rem] lg:text-[14rem] bg-gradient-to-r from-rose-400 via-pink-300 to-white bg-clip-text text-transparent">
                She Said Yes!
              </h1>
            </div>
            
            <motion.h1
              className="relative font-elegant text-8xl md:text-[12rem] lg:text-[14rem] bg-gradient-to-r from-rose-500 via-amber-400 to-white bg-clip-text text-transparent animate-shimmer"
              style={{
                backgroundSize: "200% auto",
                textShadow: "0 0 40px rgba(255, 182, 193, 0.5)",
              }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              She Said Yes!
            </motion.h1>
          </motion.div>

          {/* Names with heartbeat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-8"
          >
            <motion.h2
              className="font-cursive text-4xl md:text-6xl text-rose-600 animate-heartbeat"
              style={{
                textShadow: "0 0 20px rgba(255, 182, 193, 0.6)",
              }}
            >
              Umar & Ruqayya ❤️
            </motion.h2>
          </motion.div>

          {/* Special message */}
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.5 }}
              className="mt-12"
            >
              <p className="font-cursive text-3xl md:text-5xl text-amber-600 animate-pulse-glow">
                A New Chapter Begins 💝
              </p>
            </motion.div>
          )}

          {/* Continue button */}
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-16"
            >
              <Button
                onClick={handleContinue}
                size="lg"
                className="relative overflow-hidden font-cursive text-2xl px-8 py-6 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 animate-pulse-glow"
                style={{
                  boxShadow: "0 0 30px rgba(255, 182, 193, 0.6)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Continue Our Journey ✨
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{ borderRadius: "50%" }}
                />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Bottom ambient glow */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-rose-200/40 to-transparent pointer-events-none" />
    </div>
  );
};

export default EnhancedCelebration;