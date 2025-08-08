import { Progress } from "@/components/ui/progress";

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

export const QuizProgress = ({ currentQuestion, totalQuestions }: QuizProgressProps) => {
  const progressValue = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="bg-card rounded-lg p-4 border shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">Progress</span>
        <span className="text-sm font-medium text-quiz-progress">
          {currentQuestion} of {totalQuestions}
        </span>
      </div>
      <Progress value={progressValue} className="h-2" />
    </div>
  );
};