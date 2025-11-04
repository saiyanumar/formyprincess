import React, { useRef, useEffect, useState } from 'react';
import DiwaliFireworks from '@/components/DiwaliFireworks';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import EnhancedHeroSection from '@/components/EnhancedHeroSection';
import StoryGallery from '@/components/StoryGallery';
import RomanticLetter from '@/components/RomanticLetter';
import EnhancedCelebration from '@/components/EnhancedCelebration';
import EnhancedCountdownSection from '@/components/EnhancedCountdown';
import DiarySection from '@/components/DiarySection';
import OutroSection from '@/components/OutroSection';
import BlackoutTransition from '@/components/BlackoutTransition';
import AuthGate from '@/components/AuthGate';
import EnhancedBackground from '@/components/EnhancedBackground';
const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

type Stage = 'countdown' | 'auth' | 'hero' | 'story' | 'letter' | 'diary' | 'celebration' | 'outro';

const Index = () => {
  const [showBlackout, setShowBlackout] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [stage, setStage] = useState<Stage>('countdown');
  
  const handleStageChange = (newStage: Stage) => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      setStage(newStage);
      window.scrollTo(0, 0);
    }, 500);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio('/background-music.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const startMusic = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch(() => {
        console.log('Audio playback failed');
      });
      setIsPlaying(true);
    }
  };

  const renderPage = () => {
    if (stage === 'countdown') {
      return (
        <motion.div
          key="countdown"
          variants={pageTransitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative min-h-screen"
        >
          <EnhancedBackground
            theme="romantic"
            intensity="medium"
            particleScale={1}
            particleSpeed={1}
            glowIntensity={1}
          />
          <EnhancedCountdownSection 
            onComplete={() => setStage('auth')}
            days={7}
            hours={12}
            minutes={30}
            seconds={0}
          />
        </motion.div>
      );
    }
    
    if (!isAuthenticated) {
      if (showBlackout) {
        if (showFireworks) {
          return (
            <DiwaliFireworks
              onComplete={() => {
                setIsAuthenticated(true);
                handleStageChange('hero');
                startMusic();
                setShowBlackout(false);
                setShowFireworks(false);
              }}
            />
          );
        }

        return (
          <BlackoutTransition
            onComplete={() => {
              setShowFireworks(true);
            }}
          />
        );
      }
      return (
        <motion.div
          key="auth"
          variants={pageTransitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="min-h-screen"
        >
          <EnhancedBackground
            theme="magical"
            intensity="low"
            particleScale={0.8}
            particleSpeed={0.8}
            glowIntensity={0.8}
          />
          <AuthGate 
            onAuthenticated={() => setShowBlackout(true)}
          />
        </motion.div>
      );
    }

    switch (stage) {
      case 'hero':
        return (
          <motion.div
            key="hero"
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen"
          >
            <EnhancedBackground
              theme="romantic"
              intensity="medium"
              particleScale={1.2}
              particleSpeed={1}
              glowIntensity={1.2}
            />
            <EnhancedHeroSection
              audioRef={audioRef}
              onContinue={() => handleStageChange('story')}
              title="Welcome to Our Story"
              subtitle="A journey of love and memories"
            />
          </motion.div>
        );

      case 'story':
        return (
          <motion.div
            key="story"
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen"
          >
            <EnhancedBackground
              theme="magical"
              intensity="medium"
              particleScale={1}
              particleSpeed={1.2}
              glowIntensity={1}
            />
            <StoryGallery 
              onContinue={() => setStage('letter')} 
              onBack={() => setStage('hero')} 
            />
          </motion.div>
        );

      case 'letter':
        return (
          <motion.div
            key="letter"
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen"
          >
            <EnhancedBackground
              theme="romantic"
              intensity="low"
              particleScale={0.8}
              particleSpeed={0.8}
              glowIntensity={0.8}
            />
            <RomanticLetter 
              onContinue={() => setStage('diary')} 
              onBack={() => setStage('story')}
            />
          </motion.div>
        );

      case 'diary':
        return (
          <motion.div
            key="diary"
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen"
          >
            <EnhancedBackground
              theme="magical"
              intensity="medium"
              particleScale={1}
              particleSpeed={1}
              glowIntensity={1}
            />
            <DiarySection 
              onContinue={() => setStage('countdown')} 
              onBack={() => setStage('letter')}
            />
          </motion.div>
        );

      case 'celebration':
        return (
          <motion.div
            key="celebration"
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <EnhancedBackground
              theme="celebration"
              intensity="high"
              particleScale={1.5}
              particleSpeed={1.5}
              glowIntensity={1.5}
            />
            <EnhancedCelebration
              onComplete={() => handleStageChange('outro')}
            />
          </motion.div>
        );

      case 'outro':
        return (
          <motion.div
            key="outro"
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <EnhancedBackground
              theme="celebration"
              intensity="medium"
              particleScale={1.2}
              particleSpeed={1.2}
              glowIntensity={1.2}
            />
            <OutroSection />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-transparent overflow-hidden">
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        {renderPage()}
      </AnimatePresence>
    </div>
  );
};

export default Index;