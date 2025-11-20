import { useState, useEffect } from "react";
import { Toaster } from "../src/components/ui/toaster";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SwipeCard } from "../src/components/SwipeCard";
import { ActionButtons } from "../src/components/ActionButtons";
import { Summary } from "../src/components/Summary";
import { FeedbackMessage } from "../src/components/FeedbackMessage";
import { Progress } from "../src/components/ui/progress";
import { Cat } from "lucide-react";
// Note: Ensure this path is correct relative to where App.tsx is located.
// If App.tsx is in src/, and styles is in src/styles, this is correct:
import "./styles/Index.css"; 

const queryClient = new QueryClient();

const CAT_COUNT = 15;
const LIKE_MESSAGES = ["Wonderful!", "Nice!", "Great!"];
const DISLIKE_MESSAGES = ["I see", "Nah", "I understand why"];

const App = () => {
  // --- State & Logic from Index.tsx ---
  const [cats, setCats] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCats, setLikedCats] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const loadCatImages = async () => {
    setIsLoading(true);
    const catUrls = Array.from(
      { length: CAT_COUNT },
      (_, i) => `https://cataas.com/cat?${Date.now()}-${i}`
    );
    
    // Preload all images and convert to blob URLs
    const blobUrls = await Promise.all(
      catUrls.map(async (url) => {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        } catch (error) {
          console.error("Error loading image:", error);
          return url; // Fallback to original URL
        }
      })
    );
    
    setCats(blobUrls);
    setIsLoading(false);
  };

  useEffect(() => {
    loadCatImages();
  }, []);

  const handleSwipe = (direction: "left" | "right") => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Show random feedback message
    if (direction === "right") {
      const randomMessage = LIKE_MESSAGES[Math.floor(Math.random() * LIKE_MESSAGES.length)];
      setFeedbackMessage(randomMessage);
      setLikedCats([...likedCats, cats[currentIndex]]);
    } else {
      const randomMessage = DISLIKE_MESSAGES[Math.floor(Math.random() * DISLIKE_MESSAGES.length)];
      setFeedbackMessage(randomMessage);
    }

    setTimeout(() => {
      setFeedbackMessage("");
      if (currentIndex + 1 >= cats.length) {
        setShowSummary(true);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
      setIsAnimating(false);
    }, 800);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setLikedCats([]);
    setShowSummary(false);
    loadCatImages();
  };

  const progressValue = ((currentIndex + 1) / cats.length) * 100;

  // --- Render Content Helper ---
  // We determine what to render based on state, then return it wrapped in providers below
  const renderContent = () => {
    if (showSummary) {
      return <Summary likedCats={likedCats} onRestart={handleRestart} />;
    }

    if (isLoading) {
      return (
        <div className="index-loading-container">
          <div className="index-loading-content">
            <div className="index-loading-icon-wrapper">
              <Cat className="index-loading-icon" />
            </div>
            <p className="index-loading-text">Loading adorable cats...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="app-container">
        {/* Background image that covers the entire page */}
        <div className="background-image"></div>
        
        <div className="index-container">
          {/* Header */}
          <div className="index-header">
            <div className="index-title-wrapper">
              <div className="index-title-icon-wrapper">
                <Cat className="index-title-icon" />
              </div>
              <h1 className="index-title">
                CatSwipe
              </h1>
            </div>
            
            <div className="index-progress-wrapper">
              <Progress value={progressValue} className="h-2" />
              <p className="index-progress-text">
                {currentIndex + 1} of {cats.length} cats
              </p>
            </div>
          </div>

          {/* Main card area */}
          <main className="index-main">
            <div className="index-cards-container">
              {cats.length > 0 && currentIndex < cats.length && (
                <>
                  {/* Next card preview */}
                  {currentIndex + 1 < cats.length && (
                    <SwipeCard
                      key={currentIndex + 1}
                      imageUrl={cats[currentIndex + 1]}
                      onSwipe={() => {}}
                      isTop={false}
                    />
                  )}
                  
                  {/* Current card */}
                  <SwipeCard
                    key={currentIndex}
                    imageUrl={cats[currentIndex]}
                    onSwipe={handleSwipe}
                    isTop={true}
                  />
                  
                  {/* Feedback Message */}
                  <FeedbackMessage message={feedbackMessage} />
                </>
              )}
            </div>

            <ActionButtons
              onLike={() => handleSwipe("right")}
              onDislike={() => handleSwipe("left")}
              disabled={isAnimating}
            />
          </main>

          {/* Empty footer spacer */}
          <div />
        </div>
      </div>
    );
  };

  // --- Main Return with Providers ---
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Render the game logic content */}
        {renderContent()}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;