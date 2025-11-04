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
import BlackoutTransition from '@/components/BlackoutTransition';
import AuthGate from '@/components/AuthGate';
import { Analytics } from "@vercel/analytics/next"

type Stage = 'countdown' | 'auth' | 'hero' | 'story' | 'letter' | 'diary' | 'proposal' | 'celebration' | 'outro';

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
  const [showBlackout, setShowBlackout] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [stage, setStage] = useState<Stage>('countdown');
  
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
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <CountdownSection 
            onComplete={() => setStage('auth')}
          />
        </motion.div>
      );
    }
    
    if (!isAuthenticated) {
      if (showBlackout) {
        if (showFireworks) {
          // Render the Diwali fireworks sequence; when it finishes, finalize auth and proceed
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
              // After blackout, show the fireworks sequence
              setShowFireworks(true);
            }}
          />
        );
      }
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
    <div className="min-h-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        {renderPage()}
      </AnimatePresence>
    </div>
  );
};

export default Index;
