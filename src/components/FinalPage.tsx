import { useEffect, useState } from 'react';
import './FinalPage.css';

interface FinalPageProps {
  onBack: () => void;
}

const FinalPage = ({ onBack }: FinalPageProps) => {
  const [showLoveMessage, setShowLoveMessage] = useState(false);

  useEffect(() => {
    // Show the initial text overlay first
    setTimeout(() => {
      setShowLoveMessage(true);
    }, 3000); // 3 second delay before showing the love message
  }, []);

  return (
    <div className="final-page">
      {!showLoveMessage && (
        <div className="text-overlay">
          <h1>In the end, I just want to say...</h1>
        </div>
      )}

      {showLoveMessage && (
        <div className="love-message">
          <div className="heart"></div>
          <div className="final-text">
            <h1>I Love You</h1>
            <p>Forever & Always</p>
          </div>

          <button className="back-button" onClick={onBack}>
            ← Back to Memory Lane
          </button>
        </div>
      )}
    </div>
  );
};

export default FinalPage;