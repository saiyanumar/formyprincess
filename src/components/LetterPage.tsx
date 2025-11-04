import { useEffect, useState } from 'react';
import './LetterPage.css';

interface LetterPageProps {
  onNext: () => void;
  onBack: () => void;
}

const LetterPage = ({ onNext, onBack }: LetterPageProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const letterContent = `My dearest "Hidden",

As I sit here thinking about all our moments together, I can't help but smile. Every day with you feels like a blessing, a beautiful chapter in our story that keeps getting better.

You've brought so much joy, laughter, and meaning to my life. Your kindness, your smile, and your love make every day brighter. You understand me like no one else, and your presence in my life is the greatest gift I could ask for.

On this special day, I want to tell you something that's been in my heart...`;

  useEffect(() => {
    let currentText = '';
    let currentIndex = 0;

    const typeNextCharacter = () => {
      if (currentIndex < letterContent.length) {
        currentText += letterContent[currentIndex];
        setTypedText(currentText);
        currentIndex++;
        setTimeout(typeNextCharacter, 30);
      }
    };

    typeNextCharacter();
  }, []);

  const handleSurpriseClick = () => {
    setShowModal(true);
  };

  const handleResponse = (answer: boolean) => {
    if (answer) {
      setShowModal(false);
      // Trigger heart particles animation
      const confetti = (window as any).confetti;
      if (confetti) {
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => {
          return Math.random() * (max - min) + min;
        };

        const interval: any = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            clearInterval(interval);
            setShowConfirmation(true);
            return;
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#ff6b8a', '#f48fb1', '#ffd54f', '#ffecb3'],
            shapes: ['heart'],
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#ff6b8a', '#f48fb1', '#ffd54f', '#ffecb3'],
            shapes: ['heart'],
          });
        }, 250);
      }
    } else {
      setShowModal(false);
    }
  };

  return (
    <div className="letter-page">
      <div className="container">
        <header>
          <h1>For My Dearest Friend ❤️</h1>
        </header>

        <div className="letter-container">
          <div className="letter">{typedText}</div>
        </div>

        <div className="surprise-button-container">
          {!hasConfirmed && (
            <button className="surprise-button" onClick={handleSurpriseClick}>
              Click for the surprise! 🎁
            </button>
          )}
          {hasConfirmed && (
            <button className="continue-button" onClick={onNext}>
              Continue to Next Page →
            </button>
          )}
        </div>

        <div className="navigation">
          <button className="back-button" onClick={onBack}>
            ← Previous Page
          </button>
        </div>
      </div>

      {/* Proposal Modal */}
      {showModal && (
        <div className="modal-overlay active">
          <div className="modal">
            <div className="modal-header">
              <h2>Will you be my wife? 💝</h2>
            </div>
            <div className="modal-body">
              <button className="answer-button yes" onClick={() => handleResponse(true)}>
                Yes 💖
              </button>
              <button className="answer-button no" onClick={() => handleResponse(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Message */}
      {showConfirmation && (
        <div className="confirmation-message">
          <h2>I knew it ❤️</h2>
          <p>Thank you for making me the happiest person alive!</p>
        </div>
      )}

      {/* Floating Decorations */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="floating-element"
          style={{
            left: `${Math.random() * 100}vw`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${20 + Math.random() * 10}px`,
          }}
        >
          {['💖', '✨', '🌟', '💝', '🎀'][Math.floor(Math.random() * 5)]}
        </div>
      ))}
    </div>
  );
};

export default LetterPage;