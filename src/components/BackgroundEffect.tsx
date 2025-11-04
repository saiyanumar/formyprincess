import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkle } from 'lucide-react';
import { particleVariants, sparkleVariants } from '../lib/motion-components';

interface ParticleSystemProps {
  type?: 'hearts' | 'sparkles' | 'mixed';
  density?: number;
  speed?: number;
  direction?: 'up' | 'down' | 'random';
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  type = 'mixed',
  density = 20,
  speed = 1,
  direction = 'random',
}) => {
  const particles = Array.from({ length: density }).map((_, i) => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 5;
    const size = Math.random() * 0.5 + 0.5;
    const duration = (Math.random() * 5 + 5) / speed;

    const directionY = direction === 'random' 
      ? (Math.random() > 0.5 ? -1 : 1)
      : direction === 'up' ? -1 : 1;

    return {
      id: i,
      x,
      y,
      delay,
      size,
      duration,
      directionY,
    };
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          initial={{ 
            opacity: 0,
            x: `${particle.x}%`,
            y: direction === 'random' ? `${particle.y}%` : (direction === 'up' ? '100%' : '0%'),
            scale: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            x: `${particle.x + (Math.random() * 10 - 5)}%`,
            y: direction === 'random' 
              ? [`${particle.y}%`, `${particle.y + particle.directionY * 20}%`]
              : (direction === 'up' ? '0%' : '100%'),
            scale: [0, particle.size, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            zIndex: Math.floor(particle.y),
          }}
        >
          {type === 'hearts' || (type === 'mixed' && Math.random() > 0.5) ? (
            <Heart 
              className="text-rose-300/30" 
              size={Math.floor(16 * particle.size) + 8} 
              strokeWidth={1}
            />
          ) : (
            <Sparkle 
              className="text-golden/30" 
              size={Math.floor(12 * particle.size) + 6}
              strokeWidth={1}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

interface AmbientBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  theme?: 'romantic' | 'magical' | 'celebration';
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  intensity = 'medium',
  theme = 'romantic',
}) => {
  const densityMap = {
    low: 15,
    medium: 25,
    high: 40,
  };

  const getGradientByTheme = () => {
    switch (theme) {
      case 'magical':
        return 'bg-gradient-pearl';
      case 'celebration':
        return 'bg-gradient-gold';
      default:
        return 'bg-gradient-romantic';
    }
  };

  return (
    <div className={`fixed inset-0 ${getGradientByTheme()} overflow-hidden`}>
      <div className="absolute inset-0 backdrop-blur-[100px]" />
      
      {/* Ambient Glow Orbs */}
      <div className="absolute inset-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[40vmax] h-[40vmax] rounded-full bg-gradient-glow opacity-20"
            animate={{
              x: ['20%', '60%', '20%'],
              y: ['20%', '60%', '20%'],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              delay: i * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${i * 30}%`,
              top: `${i * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Particles */}
      <ParticleSystem
        type="mixed"
        density={densityMap[intensity]}
        speed={1.2}
        direction="random"
      />

      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
    </div>
  );
};
