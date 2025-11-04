import { useState, useEffect } from 'react';
import { Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FullscreenGateProps {
  onFullscreen: () => void;
}

const FullscreenGate = ({ onFullscreen }: FullscreenGateProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
      if (document.fullscreenElement !== null) {
        // Small delay to let fullscreen render properly
        setTimeout(onFullscreen, 1500);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [onFullscreen]);

  // Only toggle body overflow while the component is mounted and when fullscreen state changes.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = previousOverflow;
    }

    return () => {
      // Restore the original overflow when the component unmounts
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  const enterFullscreen = async () => {
    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      }
    } catch (err) {
      console.error('Error attempting to enable fullscreen:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-romantic">
      <div className="text-center px-6 max-w-lg animate-fade-in-up">
        <div className="mb-8 inline-block">
          <div className="w-20 h-20 bg-primary/30 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse-glow">
            <Maximize className="w-10 h-10 text-primary animate-bounce" />
          </div>
        </div>

        <h1 className="font-dancing text-4xl md:text-5xl text-foreground mb-6">
          A Special Surprise Awaits
        </h1>

        <div className="bg-card/90 backdrop-blur-xl rounded-3xl shadow-romantic p-8 border-2 border-primary/20">
          <p className="font-poppins text-lg text-muted-foreground mb-6 leading-relaxed">
            Madam Ruqayya, pa fullscreen mode mane click ka 💖
          </p>

          <Button 
            size="lg"
            onClick={enterFullscreen}
            disabled={isFullscreen}
            className={`inline-flex items-center gap-2 ${
              isFullscreen 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-primary/20 hover:bg-primary/30'
            }`}
          >
            <Maximize className="w-5 h-5" />
            <span className="font-medium">
              {isFullscreen 
                ? 'Der Kha ! Please wait...' 
                : 'Click to Enter Fullscreen'}
            </span>
          </Button>
        </div>
      </div>

      {/* Body overflow is now scoped via effect to avoid hiding scroll for the entire app always. */}
    </div>
  );
};

export default FullscreenGate;