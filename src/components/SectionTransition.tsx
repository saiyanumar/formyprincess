import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SectionTransitionProps {
  onContinue: () => void;
}

const SectionTransition = ({ onContinue }: SectionTransitionProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-8 pt-6 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          <Heart className="w-6 h-6 text-primary animate-heart-beat" fill="currentColor" />
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        </div>
        
        <Button
          onClick={onContinue}
          className="group px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-romantic hover:shadow-lg transition-all hover:scale-105 animate-pulse-glow"
        >
          <span className="font-poppins font-medium text-lg">Tap to continue</span>
          <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
        </Button>
      </div>
    </div>
  );
};

export default SectionTransition;
