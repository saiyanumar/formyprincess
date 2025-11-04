import { useEffect, useState } from 'react';
import { Heart, Sparkles, Stars } from 'lucide-react';

const letter = `My Sweetheart Ruqayya Jaan, 

I miss u soooo muchhhh 😭❤️, When u r not with me, I feel incomplete. Please come to meeee... Every time I think of you, my heart races and my world tilts.
There’s a fire in you I can’t resist — You’ve taken over my thoughts, my heartbeat, my every desire… and honestly, I wouldn’t have it any other way. ❤️‍🔥

Hamesha tumhari muskurahat meri zindagi ka sabse khoobsurat hissa hai. Tumhari khushi meri khushi hai, aur main har pal tumhare saath apni zindagi bitana chahta hoon. Tum meri zindagi mein ek aisi roshni ho jo har andhere ko mita deti hai. Tumhare bina meri zindagi adhoori hai.

Mujhe tumse milne ka intezar hai, tumhari baatein sunne ka, tumhare saath waqt bitane ka. Tum meri zindagi ka sabse khoobsurat hissa ho, 

Tumhari yaadon mein khoya rehta hoon, aur har pal tumhare saath hone ki tamanna karta hoon. Tum meri zindagi ka sabse khoobsurat sapna ho, aur main har din tumse pyaar karta hoon.

Aapki jaan 
Umar ❤️`;

interface FloatingElement {
  id: number;
  Icon: any;
  style: {
    top: string;
    left: string;
    animationDelay: string;
    animationDuration: string;
    opacity: number;
  };
}

interface RomanticLetterProps {
  onContinue: () => void;
  onBack: () => void;
}

const RomanticLetter = ({ onContinue, onBack }: RomanticLetterProps) => {
  const [revealedText, setRevealedText] = useState('');
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    // Create floating elements
    const elements: FloatingElement[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      Icon: i % 2 === 0 ? Heart : i % 3 === 0 ? Stars : Sparkles,
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${3 + Math.random() * 2}s`,
        opacity: 0.1 + Math.random() * 0.3,
      },
    }));
    setFloatingElements(elements);

    // Reveal text animation
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= letter.length) {
        setRevealedText(letter.slice(0, currentIndex));
        currentIndex += 2;
      } else {
        setIsFullyRevealed(true);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen py-24 px-6 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 overflow-hidden">
      {/* Floating Background Elements */}
      {floatingElements.map(({ id, Icon, style }) => (
        <Icon
          key={id}
          className="absolute text-rose-300 animate-float pointer-events-none"
          style={style}
          fill="currentColor"
        />
      ))}

      {/* Main Content */}
    <div className="max-w-4xl mx-auto relative z-10 pb-32">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block relative">
            <Heart className="w-20 h-20 mx-auto text-rose-500 animate-heart-beat" fill="currentColor" />
            <Sparkles className="absolute -right-4 -top-4 w-8 h-8 text-rose-400 animate-twinkle" />
            <Sparkles className="absolute -left-4 -bottom-4 w-8 h-8 text-rose-400 animate-twinkle" style={{ animationDelay: '1s' }} />
          </div>
          <h2 className="font-dancing text-5xl md:text-7xl text-rose-600 mt-6 mb-4 sparkle">
            My Love Letter to You
          </h2>
          <p className="font-poppins text-lg text-rose-700/80">
            Words from the depths of my heart
          </p>
        </div>

        {/* Letter Container */}
        <div className="relative">
          {/* Decorative Corner Elements */}
          <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-rose-300 rounded-tl-xl" />
          <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-rose-300 rounded-tr-xl" />
          <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-rose-300 rounded-bl-xl" />
          <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-rose-300 rounded-br-xl" />

          {/* Letter Content */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 md:p-12 border border-rose-200">
            <div className="relative font-poppins text-base md:text-lg leading-relaxed text-rose-800 whitespace-pre-wrap">
              {revealedText}
              {!isFullyRevealed && (
                <span className="inline-block w-0.5 h-6 bg-rose-400 ml-1 animate-pulse"></span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        {isFullyRevealed && (
          <div className="text-center mt-12 animate-fade-in-delayed">
            <div className="inline-block px-8 py-4 bg-white/60 backdrop-blur-sm rounded-full border border-rose-200 shadow-lg">
              <p className="font-dancing text-xl text-rose-600">
                Sealed with eternal love and devotion �
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {isFullyRevealed && (
          <div className="flex justify-center mt-12 mb-8">
            <div className="flex gap-4">
              <button
                onClick={onBack}
                className="nav-button nav-button-back"
              >
                ← Back to Stories
              </button>
              <button
                onClick={onContinue}
                className="nav-button nav-button-next"
              >
                Open Our Diary →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RomanticLetter;
