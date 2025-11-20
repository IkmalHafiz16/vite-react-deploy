import "../styles/FeedbackMessage.css";

interface FeedbackMessageProps {
  message: string;
}

export const FeedbackMessage = ({ message }: FeedbackMessageProps) => {
  if (!message) return null;

  return (
    <div className="feedback-message">
      <div className="feedback-message-content">
        {message}
      </div>
    </div>
  );
};
