import React, { useState, useEffect } from 'react';
import { Book, Heart, Sparkles, Stars, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiaryEntry {
  id: number;
  date: string;
  title: string;
  content: string;
  emotion: string;
}

const diaryEntries: DiaryEntry[] = [
  {
    id: 1,
    date: "The Day We Met",
    title: "When My World Changed Forever",
    content: "I never knew my life could change so drastically in just one moment. The instant I saw you, it felt like time stood still. Your grace, your beauty, your gentle demeanor - everything about you captivated my heart. The way you smiled shyly, the sparkle in your eyes, the sweetness in your voice... I knew right then that Allah had answered my prayers in the most beautiful way.",
    emotion: "Pure Joy 💝",
  },
  {
    id: 2,
    date: "Our Growing Love",
    title: "Falling Deeper Each Day",
    content: "With each passing day, my love for you grows stronger. Your kindness knows no bounds, your heart pure as morning dew. You bring out the best in me, inspire me to be a better person, and make me want to move mountains just to see you smile. Your presence in my life is proof that Allah's plans are more beautiful than our dreams.",
    emotion: "Endless Love 💖",
  },
  {
    id: 3,
    date: "Dreams of Forever",
    title: "Our Beautiful Future",
    content: "When I think about our future together, my heart dances with joy. I dream of building a home filled with love and laughter, of sharing life's adventures big and small, of growing old together while our love grows stronger. With you, every moment feels like a blessing, and every tomorrow looks brighter than today.",
    emotion: "Hopeful Dreams ✨",
  },
  {
    id: 4,
    date: "Birthday Reflections",
    title: "Celebrating You",
    content: "Today is more than just your birthday - it's a celebration of the light you bring into this world. Your smile brightens the darkest days, your love heals the deepest wounds, and your presence makes life infinitely more beautiful. I thank Allah every day for blessing me with someone as precious as you. Happy Birthday, my love.",
    emotion: "Infinite Gratitude 🌟",
  },
];

interface DiarySectionProps {
  onContinue: () => void;
  onBack: () => void;
}

const DiarySection = ({ onContinue, onBack }: DiarySectionProps) => {
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealedText, setRevealedText] = useState('');
  const [activeEntryIndex, setActiveEntryIndex] = useState(0);

  useEffect(() => {
    if (selectedEntry && isRevealing) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= selectedEntry.content.length) {
          setRevealedText(selectedEntry.content.slice(0, currentIndex));
          currentIndex += 2;
        } else {
          setIsRevealing(false);
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [selectedEntry, isRevealing]);

  const openEntry = (entry: DiaryEntry, index: number) => {
    setSelectedEntry(entry);
    setIsRevealing(true);
    setRevealedText('');
    setActiveEntryIndex(index);
  };

  const closeEntry = () => {
    setSelectedEntry(null);
    setRevealedText('');
  };

  const navigateEntry = (direction: 'next' | 'prev') => {
    const newIndex = direction === 'next'
      ? (activeEntryIndex + 1) % diaryEntries.length
      : (activeEntryIndex - 1 + diaryEntries.length) % diaryEntries.length;
    
    openEntry(diaryEntries[newIndex], newIndex);
  };

  return (
    <section className="relative min-h-screen py-24 px-6 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 overflow-hidden">
      {/* Floating Decorations */}
      {[...Array(15)].map((_, i) => {
        const Icon = i % 3 === 0 ? Heart : i % 2 === 0 ? Stars : Sparkles;
        return (
          <Icon
            key={i}
            className="absolute text-rose-200 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: 0.3,
            }}
            fill="currentColor"
          />
        );
      })}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block relative mb-6">
            <BookOpen className="w-20 h-20 text-rose-500" strokeWidth={1.5} />
            <Sparkles className="absolute -right-4 -top-4 w-8 h-8 text-rose-400 animate-twinkle" />
          </div>
          <h2 className="font-dancing text-5xl md:text-7xl text-rose-600 mb-4 sparkle">
            Pages of Our Love
          </h2>
          <p className="font-poppins text-lg text-rose-700/80 max-w-2xl mx-auto">
            Each entry is a chapter of our beautiful story together
          </p>
        </div>

        {/* Diary Entries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {diaryEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              onClick={() => openEntry(entry, index)}
              className="group cursor-pointer"
            >
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-rose-200/50 border border-rose-100 transition-all duration-500 hover:-translate-y-2">
                <div className="absolute top-4 right-4">
                  <Heart 
                    className="w-6 h-6 text-rose-400 group-hover:text-rose-500 group-hover:scale-110 transition-all" 
                    fill="currentColor"
                  />
                </div>
                <div className="mb-4">
                  <h3 className="font-dancing text-2xl text-rose-600 mb-2">{entry.date}</h3>
                  <p className="font-poppins text-lg font-medium text-rose-800">{entry.title}</p>
                </div>
                <p className="font-poppins text-rose-600/80 line-clamp-3 group-hover:text-rose-700/90 transition-colors">
                  {entry.content}
                </p>
                <div className="mt-4 pt-4 border-t border-rose-100">
                  <p className="font-dancing text-lg text-rose-500">{entry.emotion}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Diary Entry Modal */}
        <AnimatePresence>
          {selectedEntry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={closeEntry}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative max-w-3xl w-full bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                {/* Navigation Buttons */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateEntry('prev');
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-rose-500 hover:text-rose-600 transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateEntry('next');
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-rose-500 hover:text-rose-600 transition-colors"
                >
                  →
                </button>

                <button
                  onClick={closeEntry}
                  className="absolute top-4 right-4 p-2 text-rose-400 hover:text-rose-600 transition-colors"
                >
                  <span className="sr-only">Close</span>
                  ✕
                </button>

                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Heart className="w-8 h-8 text-rose-500 animate-heart-beat" fill="currentColor" />
                    <h3 className="font-dancing text-3xl text-rose-600">{selectedEntry.date}</h3>
                  </div>
                  <h4 className="font-poppins text-2xl font-medium text-rose-800 mb-2">
                    {selectedEntry.title}
                  </h4>
                  <p className="text-rose-500 font-dancing text-xl">{selectedEntry.emotion}</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-200 via-rose-300 to-rose-200 rounded-full" />
                  <div className="font-poppins text-lg leading-relaxed text-rose-700 whitespace-pre-wrap pl-6">
                    {revealedText}
                    {isRevealing && (
                      <span className="inline-block w-0.5 h-6 bg-rose-400 ml-1 animate-pulse"></span>
                    )}
                  </div>
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue Button (inline, not overlay) */}
        <div className="flex justify-center mt-12 mb-8">
          <div className="flex gap-4">
            <button
              onClick={onBack}
              className="nav-button nav-button-back"
            >
              ← Back
            </button>
            <button
              onClick={onContinue}
              className="nav-button nav-button-next"
            >
              Idhar click karein
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiarySection;
