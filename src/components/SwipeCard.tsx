import { useState, useRef, useEffect } from "react";
import "../styles/SwipeCard.css";

interface SwipeCardProps {
  imageUrl: string;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}

export const SwipeCard = ({ imageUrl, onSwipe, isTop }: SwipeCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 100;

  const handleStart = (clientX: number, clientY: number) => {
    if (!isTop) return;
    setIsDragging(true);
    setStartPosition({ x: clientX, y: clientY });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !isTop) return;
    
    const deltaX = clientX - startPosition.x;
    const deltaY = clientY - startPosition.y;
    
    setPosition({ x: deltaX, y: deltaY });
    setRotation(deltaX * 0.1);
  };

  const handleEnd = () => {
    if (!isDragging || !isTop) return;
    setIsDragging(false);

    if (Math.abs(position.x) > SWIPE_THRESHOLD) {
      const direction = position.x > 0 ? "right" : "left";
      onSwipe(direction);
    } else {
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleMouseUp = () => handleEnd();
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, position, startPosition]);

  const getOpacity = () => {
    if (!isDragging) return 0;
    return Math.min(Math.abs(position.x) / SWIPE_THRESHOLD, 1);
  };

  return (
    <div
      ref={cardRef}
      className={`swipe-card ${isTop ? "is-top" : ""}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${
          isTop ? 1 : 0.95
        })`,
        transition: isDragging ? "none" : "all 0.3s ease-out",
        opacity: isTop ? 1 : 0.8,
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onTouchStart={(e) => {
        if (e.touches.length > 0) {
          handleStart(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
    >
      <div className="swipe-card-inner">
        <img
          src={imageUrl}
          alt="Cute cat"
          className="swipe-card-image"
          draggable={false}
        />
        
        {/* Like overlay */}
        <div
          className="swipe-card-overlay like"
          style={{ opacity: position.x > 0 ? getOpacity() : 0 }}
        >
          <div className="swipe-card-overlay-content-wrapper">
            <div className="swipe-card-overlay-content">
              LIKE
            </div>
          </div>
        </div>

        {/* Dislike overlay */}
        <div
          className="swipe-card-overlay dislike"
          style={{ opacity: position.x < 0 ? getOpacity() : 0 }}
        >
          <div className="swipe-card-overlay-content-wrapper">
            <div className="swipe-card-overlay-content">
              NOPE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
