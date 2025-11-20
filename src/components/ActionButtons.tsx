import { Heart, X } from "lucide-react";
import "../styles/ActionButtons.css";

interface ActionButtonsProps {
  onLike: () => void;
  onDislike: () => void;
  disabled?: boolean;
}

export const ActionButtons = ({ onLike, onDislike, disabled }: ActionButtonsProps) => {
  return (
    <div className="action-buttons-container">
      <button
        onClick={onDislike}
        disabled={disabled}
        className="action-button dislike"
      >
        <X className="action-button-icon dislike" />
      </button>
      
      <button
        onClick={onLike}
        disabled={disabled}
        className="action-button like"
      >
        <Heart className="action-button-icon like" />
      </button>
    </div>
  );
};
