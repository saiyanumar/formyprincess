import React from 'react';
import { motion } from 'framer-motion';
import { buttonVariants, fadeInVariants, glowPulse, countdownNumberVariants } from '../lib/motion-components';

interface CountdownSectionProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  onComplete?: () => void;
  isCompleted?: boolean;
}

const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <motion.div
    className="relative group"
    variants={fadeInVariants}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-rose-200/50 to-pink-300/50 rounded-2xl blur-xl transform group-hover:scale-110 transition-transform duration-200" />
    
    <div className="relative glass-card p-4 md:p-6 rounded-2xl min-w-[120px] backdrop-blur-md">
      <motion.div
        className="text-3xl md:text-5xl font-bold text-rose-700"
        variants={countdownNumberVariants}
      >
        {value.toString().padStart(2, '0')}
      </motion.div>
      <div className="text-sm md:text-base text-rose-600/80 font-light mt-2">
        {label}
      </div>
    </div>

    <motion.div
      className="absolute -inset-1 bg-gradient-to-r from-rose-300/0 via-rose-300/30 to-rose-300/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      animate={{
        backgroundPosition: ['200% 50%', '-200% 50%'],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  </motion.div>
);

export const EnhancedCountdownSection: React.FC<CountdownSectionProps> = ({
  days,
  hours,
  minutes,
  seconds,
  onComplete,
  isCompleted = false,
}) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
      {/* Ambient Background Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-100/20 to-transparent"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <motion.h2 
          className="text-3xl md:text-4xl lg:text-5xl font-great-vibes text-rose-700 mb-12"
          variants={glowPulse}
        >
          Counting down to something special...
        </motion.h2>

        <motion.div 
          className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          <TimeUnit value={days} label="Days" />
          <TimeUnit value={hours} label="Hours" />
          <TimeUnit value={minutes} label="Minutes" />
          <TimeUnit value={seconds} label="Seconds" />
        </motion.div>

        <motion.button
          className={`romantic-button ${isCompleted ? 'glow-border' : ''}`}
          variants={buttonVariants}
          whileHover={isCompleted ? "hover" : undefined}
          whileTap={isCompleted ? "tap" : undefined}
          disabled={!isCompleted}
          onClick={onComplete}
        >
          <span className="relative z-10">
            {isCompleted ? "Continue to Your Surprise" : "Preparing something magical..."}
          </span>
          
          {/* Button Glow Effect */}
          {isCompleted && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-rose-300/0 via-rose-300/30 to-rose-300/0"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </motion.button>
      </motion.div>

      {/* Floating Elements */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-rose-300/30"
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            delay: i * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

export default EnhancedCountdownSection;