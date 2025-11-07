import React, { useRef, useEffect, useState } from 'react';
import DiwaliFireworks from '@/components/DiwaliFireworks';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import StoryGallery from '@/components/StoryGallery';
import RomanticLetter from '@/components/RomanticLetter';
import ILoveYou from '@/components/ILoveYou';
import WillYouBeMyWife from '@/components/WillYouBeMyWife';
import CountdownSection from '@/components/CountdownSection';
import DiarySection from '@/components/DiarySection';
import OutroSection from '@/components/OutroSection';
import AuthGate from '@/components/AuthGate';
import { Analytics } from "@vercel/analytics/next"

type Stage = 'countdown' | 'auth' | 'hero' | 'story' | 'letter' | 'diary' | 'proposal' | 'fireworks' | 'celebration' | 'outro';

const pageVariants: any = {
  initial: {
    opacity: 0,
    y: 50,
    transition: {
      duration: 0.3
    }
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.645, 0.045, 0.355, 1.000]
    }
  },
  exit: {
    opacity: 0,
    y: -50,
    transition: {
      duration: 0.3,
      ease: [0.645, 0.045, 0.355, 1.000]
    }
  }
};

const Index = () => {
  // Flow: auth -> countdown -> fireworks -> hero -> ...
  const [stage, setStage] = useState<Stage>('auth');
  // Index-level blackout to smooth transitions between major stages (e.g., countdown -> fireworks)
  const [indexBlackout, setIndexBlackout] = useState(false);
  const [showFireworksContent, setShowFireworksContent] = useState(false);
  const indexTimers = useRef<number[]>([]);

  // When the stage becomes 'fireworks' we show a short blackout then reveal the fireworks content
  useEffect(() => {
    // clear any existing timers
    indexTimers.current.forEach(t => clearTimeout(t));
    indexTimers.current = [];

    if (stage === 'fireworks') {
      // start blackout immediately
      setIndexBlackout(true);
      setShowFireworksContent(false);

      // after a short delay, render fireworks content
      const revealTimer = window.setTimeout(() => {
        setShowFireworksContent(true);
      }, 1000);
      indexTimers.current.push(revealTimer);

      // ensure blackout is removed shortly after content is shown
      const releaseTimer = window.setTimeout(() => {
        setIndexBlackout(false);
      }, 1400);
      indexTimers.current.push(releaseTimer);
    } else {
      // ensure fireworks content is hidden when not in fireworks stage
      setShowFireworksContent(false);
      setIndexBlackout(false);
    }

    return () => {
      indexTimers.current.forEach(t => clearTimeout(t));
      indexTimers.current = [];
    };
  }, [stage]);
  
  const handleStageChange = (newStage: Stage) => {
    // First, scroll to top smoothly
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Change stage after scroll animation
    setTimeout(() => {
      setStage(newStage);
      // Force another scroll to ensure we're at the top
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
        // keep silent in prod builds; consider using a logger
      });
      setIsPlaying(true);
    }
  };

  const renderPage = () => {
    // If user is not authenticated, show AuthGate first (FullScreenGate happens in main.tsx)
    if (!isAuthenticated) {
      return (
        <motion.div
          key="auth"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="min-h-screen"
        >
          <AuthGate 
            onAuthenticated={() => {
              setIsAuthenticated(true);
              // proceed to countdown after successful auth
              setStage('countdown');
            }}
          />
        </motion.div>
      );
    }

    switch (stage) {
      case 'countdown':
        return (
          <motion.div
            key="countdown"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <CountdownSection
              onComplete={() => setStage('fireworks')}
            />
          </motion.div>
        );

      case 'hero':
        return (
          <motion.div
            key="hero"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen"
          >
            <HeroSection
              audioRef={audioRef}
              onContinue={() => handleStageChange('story')}
            />
          </motion.div>
        );

      case 'story':
        return (
          <motion.div
            key="story"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen"
          >
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
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen"
          >
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
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen"
          >
            <DiarySection 
              onContinue={() => setStage('proposal')} 
              onBack={() => setStage('letter')}
            />
          </motion.div>
        );


      case 'proposal':
        return (
          <motion.div
            key="proposal"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen"
          >
            <WillYouBeMyWife onComplete={() => setStage('celebration')} />
          </motion.div>
        );

      case 'fireworks':
        // We render the fireworks content only after a short blackout transition
        if (!showFireworksContent) {
          // render an empty container (blackout overlay will be visible at the root)
          return (
            <motion.div
              key="fireworks"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            />
          );
        }

        return (
          <motion.div
            key="fireworks"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <DiwaliFireworks
              onComplete={() => {
                // start background music and continue to hero
                startMusic();
                handleStageChange('hero');
              }}
            />
          </motion.div>
        );

      case 'celebration':
        return (
          <motion.div
            key="celebration"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ILoveYou />
          </motion.div>
        );

      case 'outro':
        return (
          <motion.div
            key="outro"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <OutroSection />
          </motion.div>
        );

      default:
        return null;
    }
  };


  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        {renderPage()}
      </AnimatePresence>

      {/* Index-level blackout overlay */}
      <AnimatePresence>
        {indexBlackout && (
          <motion.div
            key="index-blackout"
            className="absolute inset-0 z-50 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ background: '#000' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
