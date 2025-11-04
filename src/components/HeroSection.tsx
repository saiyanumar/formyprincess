import { useState, useEffect, RefObject } from 'react';
import { Volume2, VolumeX, Heart, Stars, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import './HeroSection.css';

interface HeroSectionProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  onContinue: () => void;
}

const HeroSection = ({ audioRef, onContinue }: HeroSectionProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Try to play audio on mount
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        setIsMuted(true);
      });
    }

    // Trigger content animation after a small delay
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [audioRef]);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play();
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-rose-200 to-pink-300">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Hearts */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(40)].map((_, i) => (
            <Heart
              key={i}
              className="absolute text-rose-500 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                fontSize: `${Math.random() * 40 + 20}px`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
              fill="currentColor"
            />
          ))}
        </div>

        {/* Sparkle Effects */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <Sparkles
              key={`sparkle-${i}`}
              className="absolute text-yellow-400 animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                fontSize: `${Math.random() * 20 + 10}px`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-40 animate-pulse-slow" />

      {/* Audio Control */}
      <Button
        onClick={toggleMute}
        className="fixed top-6 right-6 z-50 rounded-full w-14 h-14 bg-white/90 backdrop-blur-md shadow-xl hover:shadow-rose-200/50 transition-all border border-rose-200"
        variant="outline"
      >
        {isMuted ? <VolumeX className="w-6 h-6 text-rose-500" /> : <Volume2 className="w-6 h-6 text-rose-500" />}
      </Button>

      {/* Hero Content */}
    <div className={`relative z-10 text-center px-6 pb-32 max-w-4xl transition-all duration-1000 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Main Heart Icon */}
        <div className="mb-12 inline-block animate-float">
          <div className="w-24 h-24 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse-slow border-2 border-rose-300 shadow-xl">
            <Heart className="w-12 h-12 text-rose-500 animate-heart-beat" fill="currentColor" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-dancing text-6xl md:text-8xl lg:text-9xl text-rose-600 mb-8 leading-tight drop-shadow-lg animate-title-fade-in">
          Dear Ruqayya
        </h1>
        
        {/* Subtitle Card */}
        <div className="inline-block px-10 py-5 bg-white/40 backdrop-blur-md rounded-xl mb-10 border border-rose-200 shadow-xl hover:shadow-rose-200/50 transition-all hover:scale-105 animate-fade-in-up">
          <p className="font-poppins text-xl md:text-3xl text-rose-600 font-medium">
            Ta zama da zra armaan ye, and zama sakoon ye ✨
          </p>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-4 mb-12 animate-fade-in">
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent"></div>
          <Stars className="w-8 h-8 text-rose-400" fill="currentColor" />
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent"></div>
        </div>

        {/* Message */}
        <p className="font-poppins text-lg md:text-xl text-rose-700/90 max-w-2xl mx-auto leading-relaxed mb-12 animate-fade-in-delayed">
          On this special day, I want to celebrate not just your birthday, but the incredible blessing 
          you are in my life. Ta zama da khushale sabab ye, sta muske zama da zra saaz de.
Har lamha ta sara da yao khob pa shaan da — naazuk, khushbudar, ao da meene pa ranguno rang.
I Miss u Alottttt 😭❤️. May u get every success in ur Life Aameen !
        </p>
        {/* Continue Button (inline) */}
        <div className="nav-buttons-inline">
          <button
            onClick={onContinue}
            className="nav-button nav-button-next"
            aria-label="Continue to next section"
          >
            Continue to Our Journey
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
