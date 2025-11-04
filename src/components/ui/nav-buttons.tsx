import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';
import { buttonVariants } from '../../lib/motion-components';
import { cn } from '@/lib/utils';

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: 'back' | 'next';
  glowing?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ 
  direction, 
  glowing = false,
  children,
  ...props 
}) => {
  const isNext = direction === 'next';

  return (
    <motion.div
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      variants={{
        idle: {
          scale: 1,
          boxShadow: "0 4px 20px hsla(350, 100%, 88%, 0.2)",
        },
        hover: {
          scale: 1.05,
          y: -2,
          boxShadow: "0 8px 30px hsla(350, 100%, 88%, 0.3)",
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        },
        tap: {
          scale: 0.95,
          y: 0,
          transition: {
            duration: 0.1,
            ease: "easeInOut",
          },
        },
      }}
      className="relative"
    >
      <Button
        variant={isNext ? "romantic" : "secondary"}
        size="lg"
        className={cn(
          "relative overflow-hidden",
          "group transition-all duration-500",
          isNext ? "pl-6 pr-8" : "pl-8 pr-6",
          glowing ? "romantic-glow" : ""
        )}
        {...props}
      >
        {/* Arrow */}
        <motion.span
          initial={{ x: 0 }}
          animate={{ x: isNext ? [0, 5, 0] : [0, -5, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`
            absolute text-xl
            ${isNext ? 'right-4' : 'left-4'}
          `}
        >
          {isNext ? '→' : '←'}
        </motion.span>

        {/* Button Text */}
        <span className="relative z-10">
          {children}
        </span>

        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
              'linear-gradient(90deg, rgba(255,255,255,0) 100%, rgba(255,255,255,0.2) 150%, rgba(255,255,255,0) 200%)'
            ],
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Sparkle Effects */}
        {glowing && Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [0, (i - 1) * 20],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeOut"
            }}
            style={{
              left: `${30 + i * 20}%`,
              top: '50%'
            }}
          />
        ))}
      </Button>

      {/* Hover Glow */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isNext 
            ? 'radial-gradient(circle at center, rgba(244, 114, 182, 0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle at center, rgba(167, 139, 250, 0.2) 0%, transparent 70%)'
        }}
      />
    </motion.div>
  );
};

export { NavButton };
