import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkle, Star } from 'lucide-react';

interface ParticleSystemProps {
  type?: 'hearts' | 'sparkles' | 'mixed';
  density?: number;
  speed?: number;
  direction?: 'up' | 'down' | 'random';
  intensity?: 'low' | 'medium' | 'high';
  scale?: number;
  color?: 'rose' | 'gold' | 'pearl';
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({
  type = 'mixed',
  density = 20,
  speed = 1,
  direction = 'random',
  intensity = 'medium',
  scale = 1,
  color = 'rose',
}) => {
  const intensityMap = {
    low: Math.floor(density * 0.7),
    medium: density,
    high: Math.floor(density * 1.5)
  };

  const colorMap = {
    rose: 'text-rose-300',
    gold: 'text-amber-300',
    pearl: 'text-pink-200'
  };

  const particles = React.useMemo(() => {
    return Array.from({ length: intensityMap[intensity] }).map((_, i) => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 5;
      const size = (Math.random() * 0.5 + 0.5) * scale;
      const duration = (Math.random() * 5 + 5) / speed;
      const directionY = direction === 'random' 
        ? (Math.random() > 0.5 ? -1 : 1)
        : direction === 'up' ? -1 : 1;
      const rotation = Math.random() * 360;
      const pulse = Math.random() > 0.7;

      return {
        id: i,
        x,
        y,
        delay,
        size,
        duration,
        directionY,
        rotation,
        pulse,
      };
    });
  }, [intensity, scale, speed, direction]);

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
            rotate: particle.rotation,
          }}
          animate={{
            opacity: particle.pulse ? [0, 1, 1, 0] : [0, 1, 0],
            x: `${particle.x + (Math.random() * 10 - 5)}%`,
            y: direction === 'random' 
              ? [`${particle.y}%`, `${particle.y + particle.directionY * 20}%`]
              : (direction === 'up' ? '0%' : '100%'),
            scale: particle.pulse ? [0, particle.size, particle.size * 1.2, 0] : [0, particle.size, 0],
            rotate: [particle.rotation, particle.rotation + 360],
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
              className={`${colorMap[color]}/30 filter blur-[0.5px]`}
              size={Math.floor(16 * particle.size) + 8} 
              strokeWidth={1}
            />
          ) : (
            <Sparkle 
              className={`${colorMap[color]}/30 filter blur-[0.5px]`}
              size={Math.floor(12 * particle.size) + 6}
              strokeWidth={1}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

interface GlowOrbProps {
  theme: 'romantic' | 'magical' | 'celebration';
  intensity?: number;
}

const GlowOrb: React.FC<GlowOrbProps> = ({ theme, intensity = 1 }) => {
  const getGradient = () => {
    switch (theme) {
      case 'magical':
        return 'bg-gradient-to-br from-pink-300/20 via-rose-300/20 to-pink-300/20';
      case 'celebration':
        return 'bg-gradient-to-br from-amber-300/20 via-rose-300/20 to-amber-300/20';
      default:
        return 'bg-gradient-to-br from-rose-300/20 via-pink-300/20 to-rose-300/20';
    }
  };

  return (
    <motion.div
      className={`absolute w-[40vmax] h-[40vmax] rounded-full ${getGradient()}`}
      animate={{
        x: ['20%', '60%', '20%'],
        y: ['20%', '60%', '20%'],
        scale: [1, 1.2, 1],
        opacity: [0.1 * intensity, 0.2 * intensity, 0.1 * intensity],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        filter: `blur(${Math.floor(intensity * 50)}px)`,
      }}
    />
  );
};

interface AmbientBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  theme?: 'romantic' | 'magical' | 'celebration';
  particleScale?: number;
  particleSpeed?: number;
  glowIntensity?: number;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  intensity = 'medium',
  theme = 'romantic',
  particleScale = 1,
  particleSpeed = 1,
  glowIntensity = 1,
}) => {
  const densityMap = {
    low: 15,
    medium: 25,
    high: 40,
  };

  const getGradientByTheme = () => {
    switch (theme) {
      case 'magical':
        return 'bg-gradient-to-br from-pink-100 via-pink-200 to-rose-200';
      case 'celebration':
        return 'bg-gradient-to-br from-amber-200 via-rose-200 to-amber-200';
      default:
        return 'bg-gradient-to-br from-rose-200 via-pink-200 to-rose-300';
    }
  };

  const getParticleColor = (): 'rose' | 'gold' | 'pearl' => {
    switch (theme) {
      case 'magical':
        return 'pearl';
      case 'celebration':
        return 'gold';
      default:
        return 'rose';
    }
  };

  return (
    <div className={`fixed inset-0 ${getGradientByTheme()} overflow-hidden`}>
      {/* Soft blur overlay */}
      <div className="absolute inset-0 backdrop-blur-[100px]" />
      
      {/* Ambient Glow Orbs */}
      <div className="absolute inset-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <GlowOrb 
            key={i} 
            theme={theme} 
            intensity={glowIntensity * (1 - i * 0.2)} 
          />
        ))}
      </div>

      {/* Particles */}
      <ParticleSystem
        type="mixed"
        density={densityMap[intensity]}
        speed={particleSpeed}
        direction="random"
        scale={particleScale}
        intensity={intensity}
        color={getParticleColor()}
      />

      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-sm" />
    </div>
  );
};

export default AmbientBackground;