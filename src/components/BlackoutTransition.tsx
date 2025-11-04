import { useEffect } from 'react';

interface BlackoutTransitionProps {
  onComplete: () => void;
}

const BlackoutTransition = ({ onComplete }: BlackoutTransitionProps) => {
  useEffect(() => {
    // Hold blackout for suspense, then trigger reveal
    const timer = setTimeout(() => {
      onComplete();
    }, 2000); // 2.0 seconds of suspense

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-foreground z-50 flex items-center justify-center animate-fade-in">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-primary mt-4 font-dancing text-2xl">Preparing your surprise...</p>
      </div>
    </div>
  );
};

export default BlackoutTransition;
