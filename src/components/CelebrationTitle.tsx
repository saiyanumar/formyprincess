import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface CelebrationTitleProps {
  isComplete: boolean;
  name: string;
  subtitle: string;
}

const CelebrationTitle: React.FC<CelebrationTitleProps> = ({ isComplete, name, subtitle }) => {
  // Stable cinematic bokeh positions generated once per mount
  const bokeh = useMemo(() => {
    return Array.from({ length: 15 }).map(() => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      top: `${Math.random() * 80 + 10}%`
    }));
  }, []);

  // Respect reduced motion preference
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderWithEmoji = (text: string) => {
    // Preserve emoji glyphs by rendering them in a dedicated span so they aren't background-clip: text
    const EMOJIS = ['💫', '❤️', '✨', '💖', '💗', '💓', '💞', '😍'];
    const re = new RegExp(`(${EMOJIS.map(e => escapeRegExp(e)).join('|')})`);
    const parts = text.split(re);
    return parts.map((part, idx) => {
      if (EMOJIS.includes(part)) {
        return (
          <span key={idx} className="celebration-emoji" aria-hidden>
            {part}
          </span>
        );
      }
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

  // escape emoji for regex
  function escapeRegExp(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  return (
    <>
      {/* Romantic Cinematic Title Sequence (decorative) */}
      <div className="cinematic-bokeh" aria-hidden>
        {bokeh.map((b, i) => (
          <span
            key={i}
            aria-hidden
            style={{
              left: b.left,
              top: b.top,
              animationDelay: b.animationDelay,
            }}
          />
        ))}
      </div>

      {/* Wrapper to provide a soft backdrop behind title for improved contrast */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.h2
            key="anticipation-title"
            className="romantic-title font-dancing text-5xl md:text-7xl text-center relative select-none"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.98 }}
            transition={{ duration: 1.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.span
              animate={prefersReduced ? undefined : {
                textShadow: [
                  '0 0 10px rgba(255, 182, 193, 0.6)',
                  '0 0 20px rgba(255, 105, 180, 0.8)',
                  '0 0 10px rgba(255, 182, 193, 0.6)'
                ],
                scale: [1, 1.03, 1]
              }}
              transition={{ duration: 2.5, repeat: prefersReduced ? 0 : Infinity, ease: 'easeInOut' }}
              className="inline-block bg-gradient-to-r from-pink-300 via-rose-400 to-amber-200 bg-clip-text text-transparent"
            >
              The Magic Begins Soon ✨
            </motion.span>

            <motion.div
              className="absolute inset-0 flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={prefersReduced ? { opacity: 0.4 } : { opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3, repeat: prefersReduced ? 0 : Infinity }}
            >
              <Sparkles className="text-pink-300 w-10 h-10" aria-hidden />
            </motion.div>
          </motion.h2>
          ) : (
            <motion.h2
            key="celebration-title"
            className="romantic-title text-center relative select-none"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.3, ease: 'easeInOut' }}
          >
            {/* First line – golden shimmer reveal */}
            <motion.div
              className="relative inline-block"
              animate={prefersReduced ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ duration: 3, repeat: prefersReduced ? 0 : Infinity, ease: 'easeInOut' }}
            >
              <motion.span
                className="block font-dancing celebration-title-main bg-clip-text text-transparent"
                style={{
                  fontSize: 'clamp(3rem, 8.5vw, 6.5rem)',
                  background: 'linear-gradient(120deg, #be123c, #e11d48, #be123c)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 2px 8px rgba(190,18,60,0.5))',
                  animation: 'shimmer-wave 3s linear infinite'
                }}
              >
                {renderWithEmoji(name)}
              </motion.span>
            </motion.div>

            {/* Second line – soft glowing love phrase */}
            <motion.div
              className="relative inline-block mt-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0, scale: prefersReduced ? 1 : [1, 1.02, 1] }}
              transition={{
                opacity: { duration: 1.2, delay: 0.8 },
                scale: { duration: 3, repeat: prefersReduced ? 0 : Infinity, ease: 'easeInOut', delay: 0.8 }
              }}
            >
              <motion.span
                className="block font-dancing celebration-title-sub"
                style={{ 
                  fontSize: 'clamp(1.5rem, 4vw, 2.8rem)',
                  background: 'linear-gradient(120deg, #be123c, #e11d48, #be123c)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  textShadow: '0 0 20px rgba(190,18,60,0.4)',
                  filter: 'drop-shadow(0 2px 6px rgba(190,18,60,0.4))',
                  animation: 'shimmer-wave 3s linear infinite',
                  animationDelay: '0.5s'
                }}
              >
                {renderWithEmoji(subtitle)}
              </motion.span>
            </motion.div>
          </motion.h2>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default CelebrationTitle;
