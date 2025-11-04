import React from 'react';
import { motion } from 'framer-motion';
import { MotionDiv, MotionHeading, MotionText, fadeInVariants, scaleInVariants } from '../lib/motion-components';

interface HeroSectionProps {
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  title: string;
  subtitle?: string;
  isRevealed?: boolean;
}

export const EnhancedHeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  isRevealed = false,
  audioRef,
}) => {
  return (
    <MotionDiv
      className="relative min-h-screen flex flex-col items-center justify-center p-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }}
      transition={{ duration: 1 }}
    >
      {/* Background Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isRevealed ? 1 : 0.5 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-100/20 to-transparent" />
        onContinue: () => void;
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%]"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-conic from-rose-200/20 via-transparent to-rose-200/20 blur-3xl" />
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <MotionHeading
          className="text-4xl md:text-6xl lg:text-7xl font-great-vibes text-rose-800 mb-6"
          variants={scaleInVariants}
          initial="hidden"
          animate="visible"
        >
          {title.split('').map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: i * 0.05,
        onContinue,
                ease: [0.34, 1.56, 0.64, 1]
              }}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </MotionHeading>

        {subtitle && (
          <MotionText
            className="text-lg md:text-xl text-rose-700/80 font-light tracking-wide"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            {subtitle}
          </MotionText>
        )}
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-bounce"
        >
          <path
            d="M20 5L25 15L35 17L27.5 25L29 35L20 30L11 35L12.5 25L5 17L15 15L20 5Z"
            fill="rgba(244, 114, 182, 0.2)"
            stroke="rgba(244, 114, 182, 0.3)"
            strokeWidth="2"
          />
        </svg>
      </motion.div>

      {/* Floating Sparkles */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-rose-300/30"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * -100],
          }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </MotionDiv>
  );
};
              <motion.button
                onClick={onContinue}
                className="mt-8 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full 
                          shadow-lg hover:shadow-xl transition-all duration-300 ease-out
                          transform hover:scale-105 active:scale-95"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                Continue
              </motion.button>

export default EnhancedHeroSection;