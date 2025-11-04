import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AuthGateProps {
  onAuthenticated: () => void;
}

const AuthGate = ({ onAuthenticated }: AuthGateProps) => {
  const [pin, setPin] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const CORRECT_PIN = '111111'; // Change this to your secret PIN
  const MAX_ATTEMPTS = 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin === CORRECT_PIN) {
      toast.success('Welcome, sweetheart 💖');
      setAttempts(0); // Reset attempts on success
      setTimeout(() => {
        onAuthenticated();
      }, 800);
    } else {
      setAttempts(prev => prev + 1);
      setIsShaking(true);
      if (attempts + 1 >= MAX_ATTEMPTS) {
        toast.error('Too many attempts. Please wait a moment 💝');
        setTimeout(() => {
          setAttempts(0);
          setPin('');
        }, 30000); // 30 second cooldown
      } else {
        toast.error(`Wrong PIN, try again 💗 (${MAX_ATTEMPTS - attempts - 1} attempts left)`);
      }
      setTimeout(() => setIsShaking(false), 500);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-romantic relative overflow-hidden font-poppins">
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-rose-blush opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${Math.random() * 30 + 20}px`,
            }}
            fill="currentColor"
          />
        ))}
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-scale-in">
        <div className="bg-card/90 backdrop-blur-xl rounded-3xl shadow-romantic p-8 border-2 border-primary/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-romantic rounded-full mb-4 animate-heart-beat">
              <Heart className="w-12 h-12 text-primary-foreground" fill="currentColor" />
            </div>
            <h1 className="font-dancing text-4xl md:text-5xl text-foreground mb-3">
              This is for Baby Ruqayya
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Enter the secret to open your surprise
            </p>
          </div>

          {/* PIN Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`transition-transform ${isShaking ? 'animate-[wiggle_0.3s_ease-in-out]' : ''}`}>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN"
                className="text-center text-2xl tracking-[0.5em] font-semibold h-16 rounded-2xl border-2 border-primary/30 focus:border-primary bg-secondary/50"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-lg font-semibold rounded-2xl bg-gradient-romantic hover:opacity-90 transition-all shadow-soft hover:shadow-romantic"
              disabled={pin.length !== 6}
            >
              Meri Jan ! Yhn Click Karo💖
            </Button>
          </form>

          {/* Footer Hint */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Made by your Umar 💍
          </p>
        </div>
      </div>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default AuthGate;
