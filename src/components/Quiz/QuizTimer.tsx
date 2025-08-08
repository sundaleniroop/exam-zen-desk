import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface QuizTimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  isActive: boolean;
}

export const QuizTimer = ({ initialTime, onTimeUp, isActive }: QuizTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressValue = (timeLeft / initialTime) * 100;
  const isDanger = timeLeft <= 60; // Last minute warning

  return (
    <div className="bg-card rounded-lg p-4 border shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">Time Remaining</span>
        <span 
          className={`text-lg font-bold ${
            isDanger ? "text-quiz-timer-danger" : "text-quiz-timer"
          }`}
        >
          {formatTime(timeLeft)}
        </span>
      </div>
      <Progress 
        value={progressValue} 
        className="h-2"
        style={{
          background: isDanger ? "hsl(var(--quiz-timer-danger) / 0.2)" : "hsl(var(--quiz-timer) / 0.2)"
        }}
      />
    </div>
  );
};