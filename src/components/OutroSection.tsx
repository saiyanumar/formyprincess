import React, { useEffect, useState, useRef, useCallback } from 'react';
import './MemoryLane.css';
import { motion, AnimatePresence } from 'framer-motion';

interface MemoryLaneProps {
  onContinue: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

interface Memory {
  id: number;
  image: string;
  caption: string;
  rotate: number;
  emoji: string;
}

const memories: Memory[] = [
  {
    id: 1,
    image: '/memories/1.jpg',
    caption: 'Remember when we got lost hiking and found that amazing waterfall? Best wrong turn ever! 😂',
    rotate: -2,
    emoji: '🌊'
  },
  {
    id: 2,
    image: '/memories/2.jpeg',
    caption: 'That time we stayed up all night just talking and watching the sunrise. I\'ve never laughed so hard in my life!',
    rotate: 3,
    emoji: '🌅'
  },
  {
    id: 3,
    image: '/memories/3.jpg',
    caption: 'Our first road trip together! You fell asleep and I drew a tiny mustache on you with a marker. You didn\'t notice for HOURS!',
    rotate: -1,
    emoji: '🚗'
  },
  {
    id: 4,
    image: '/memories/4.jpg',
    caption: 'Remember our cooking disaster when we tried to make that fancy recipe? The smoke alarm going off, but the pizza we ordered after was the best ever!',
    rotate: 2,
    emoji: '🍕'
  },
  {
    id: 5,
    image: '/memories/5.jpg',
    caption: 'Our camping trip under the stars. You were terrified of that tiny spider and jumped so high! Still my favorite memory.',
    rotate: -6,
    emoji: '🏕️'
  }
];

const MemoryLane: React.FC<MemoryLaneProps> = ({ onContinue, audioRef }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(memories.length).fill(false));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < memories.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setShowNextButton(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const createConfetti = useCallback(() => {
    const container = document.getElementById('confetti-container');
    if (!container) return;

    // Add 50 pieces of confetti
    for (let i = 0; i < 50; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';

      // Random properties
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.width = `${5 + Math.random() * 15}px`;
      piece.style.height = `${5 + Math.random() * 15}px`;
      piece.style.background = [
        '#ff4e91',
        '#ff6ec4',
        '#7873f5',
        '#c175ff',
        '#a485ff',
        '#75c6ff'
      ][Math.floor(Math.random() * 6)];
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      piece.style.animation = `floatDown ${3 + Math.random() * 3}s ease-in ${
        Math.random() * 5
      }s infinite`;
      piece.style.opacity = '0';

      container.appendChild(piece);
    }
  }, []);

  useEffect(() => {
    createConfetti();
  }, [createConfetti]);

  const handleNext = () => {
    if (currentIndex < memories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onContinue();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="memory-lane-container">
      <div className="scrapbook-bg"></div>
      <div className="confetti" id="confetti-container"></div>

      {/* Header */}
      <motion.div
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Our Beautiful Journey</h1>
        <p>Every moment with you is a treasure to cherish forever ❤️</p>
      </motion.div>

      {/* Gallery */}
      <motion.div
        className="gallery-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        ref={containerRef}
      >
        <div className="gallery">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="memory-card"
              initial={{ opacity: 0, scale: 1.1, rotate: memories[currentIndex].rotate }}
              animate={{ opacity: 1, scale: 1, rotate: memories[currentIndex].rotate }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card-tape"></div>
              <img
                src={memories[currentIndex].image}
                alt={memories[currentIndex].caption}
                className="memory-img"
              />
              <div className="memory-caption">
                {memories[currentIndex].caption}
              </div>
              <div className="card-sticker">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="50" fill="#ff6ec4" />
                  <text
                    x="50"
                    y="65"
                    fontFamily="Arial"
                    fontSize="40"
                    textAnchor="middle"
                    fill="white"
                  >
                    {memories[currentIndex].emoji}
                  </text>
                </svg>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="navigation-buttons">
          <button
            className="btn"
            onClick={handleBack}
            disabled={currentIndex === 0}
            aria-label="Go back"
          >
            ← Previous Memory
          </button>
          <button
            className="btn"
            onClick={handleNext}
            aria-label="Continue"
          >
            {currentIndex === memories.length - 1 ? 'Continue Our Journey →' : 'Next Memory →'}
          </button>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="decorative-elements"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="sticker sticker1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
        >
          💖
        </motion.div>
        <motion.div
          className="sticker sticker2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2 }}
        >
          ✨
        </motion.div>
        <motion.div
          className="sticker sticker3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.4 }}
        >
          🌟
        </motion.div>
        <motion.div
          className="sticker sticker4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.6 }}
        >
          💝
        </motion.div>

        {/* Floating Balloons */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="balloon"
            initial={{ y: '100vh' }}
            animate={{ y: '-100vh' }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear'
            }}
            style={{
              left: `${Math.random() * 100}vw`,
              transform: `scale(${0.5 + Math.random() * 0.5})`
            }}
          />
        ))}
      </motion.div>
    </div>
  );

};

export default MemoryLane;