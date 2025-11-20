import { Heart, RotateCcw } from "lucide-react";
import "../styles/Summary.css";

interface SummaryProps {
  likedCats: string[];
  onRestart: () => void;
}

export const Summary = ({ likedCats, onRestart }: SummaryProps) => {
  return (
    <div className="app-container">
  {/* Background image that covers the entire page */}
  <div className="background-image"></div>
    <div className="summary-container">
      <div className="summary-content">
        <div className="summary-header">
          <div className="summary-icon-wrapper">
            <Heart className="summary-icon" />
          </div>
          <h1 className="summary-title">
            Your Purrfect Matches!
          </h1>
          <p className="summary-subtitle">
            You liked <span className="summary-subtitle-count">{likedCats.length}</span> adorable cat
            {likedCats.length !== 1 ? "s" : ""}! 🐱
          </p>
        </div>

        {likedCats.length > 0 ? (
          <div className="summary-grid">
            {likedCats.map((cat, index) => (
              <div
                key={index}
                className="summary-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={cat}
                  alt={`Liked cat ${index + 1}`}
                  className="summary-card-image"
                />
                <div className="summary-card-badge">
                  <Heart className="summary-card-badge-icon" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="summary-empty">
            <p className="summary-empty-title">
              No cats caught your eye this time! 😿
            </p>
            <p className="summary-empty-subtitle">
              Maybe give them another chance?
            </p>
          </div>
        )}

        <div className="summary-restart-wrapper">
          <button
            onClick={onRestart}
            className="summary-restart-button"
          >
            <RotateCcw className="summary-restart-icon" />
            Meet More Cats
          </button>
        </div>
      </div>
    </div>
        </div>
  );
};
