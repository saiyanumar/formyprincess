import { useEffect, useState, useRef } from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface FireworksCelebrationProps {
  onComplete: () => void;
}

const FireworksCelebration = ({ onComplete }: FireworksCelebrationProps) => {
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Play celebration sound (user needs to add their own audio file)
    try {
      audioRef.current = new Audio('/celebration.mp3');
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {
        // Autoplay might be blocked
      });
    } catch (error) {
      // Audio file not found
    }

    // Show text after brief moment
    setTimeout(() => setShowText(true), 500);
    
    // Show tap button after animations
    setTimeout(() => setShowButton(true), 2000);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-gradient-to-br from-rose-blush via-rose-gold to-primary flex items-center justify-center overflow-hidden cursor-pointer"
      onClick={showButton ? onComplete : undefined}
    >
      {/* Confetti Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti rounded-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              width: `${Math.random() * 10 + 6}px`,
              height: `${Math.random() * 10 + 6}px`,
              backgroundColor: ['#FFB6C1', '#FFD700', '#F4C2C2', '#FFF8F0', '#FF69B4'][Math.floor(Math.random() * 5)],
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${2.5 + Math.random() * 1.5}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      {/* Sparkle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-cream animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              fontSize: `${Math.random() * 30 + 20}px`,
            }}
          />
        ))}
      </div>

      {/* Floating Hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-cream/60 animate-float"
            fill="currentColor"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${Math.random() * 40 + 15}px`,
            }}
          />
        ))}
      </div>

      {/* Firework Bursts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse-glow rounded-full"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 70}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              background: `radial-gradient(circle, hsl(${Math.random() * 60 + 330} 100% 80% / 0.6) 0%, transparent 70%)`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`,
            }}
          />
        ))}
      </div>

      {/* Main Message */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        <div className={`transition-all duration-1000 ${showText ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <h1 className="font-dancing text-6xl md:text-8xl lg:text-9xl text-cream mb-8 animate-heart-beat drop-shadow-2xl leading-tight">
            Happy Birthday,
            <br />
            "Hidden" 💖
          </h1>
          
          <div className="flex items-center justify-center gap-4 mb-8 animate-float">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-cream/90 rounded-full flex items-center justify-center animate-heart-beat text-3xl md:text-4xl shadow-lg">
              ❤️
            </div>
          </div>

          {showButton && (
            <div className="animate-fade-in-up mt-12">
              <div className="inline-flex items-center gap-2 px-8 py-4 bg-cream/20 backdrop-blur-md rounded-full border-2 border-cream/40 shadow-lg hover:bg-cream/30 transition-all">
                <span className="font-poppins text-cream font-medium text-lg">
                  Tap to continue
                </span>
                <span className="text-cream text-xl animate-pulse">→</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FireworksCelebration;
