import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Trophy, RotateCcw } from "lucide-react";
import { Question } from "./QuizQuestion";

interface QuizResultsProps {
  questions: Question[];
  userAnswers: (number | null)[];
  onRestart: () => void;
  timeTaken: number;
}

export const QuizResults = ({ questions, userAnswers, onRestart, timeTaken }: QuizResultsProps) => {
  const correctAnswers = userAnswers.filter((answer, index) => 
    answer === questions[index].correctAnswer
  ).length;
  
  const totalQuestions = questions.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getGrade = () => {
    if (percentage >= 90) return { grade: "Excellent!", color: "text-success", icon: Trophy };
    if (percentage >= 80) return { grade: "Very Good!", color: "text-primary", icon: CheckCircle };
    if (percentage >= 70) return { grade: "Good", color: "text-warning", icon: CheckCircle };
    if (percentage >= 60) return { grade: "Pass", color: "text-muted-foreground", icon: CheckCircle };
    return { grade: "Needs Improvement", color: "text-destructive", icon: XCircle };
  };

  const { grade, color, icon: GradeIcon } = getGrade();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Results Summary */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <GradeIcon className={`h-16 w-16 ${color}`} />
          </div>
          <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
          <p className={`text-xl font-semibold ${color}`}>{grade}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <p className="text-2xl font-bold text-success">{correctAnswers}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-destructive">{totalQuestions - correctAnswers}</p>
              <p className="text-sm text-muted-foreground">Incorrect</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-primary">{formatTime(timeTaken)}</p>
              <p className="text-sm text-muted-foreground">Time Taken</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Score</span>
              <span className="text-sm font-medium">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>

          <Button onClick={onRestart} className="w-full" size="lg">
            <RotateCcw className="mr-2 h-4 w-4" />
            Take Quiz Again
          </Button>
        </CardContent>
      </Card>

      {/* Question Review */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Question Review</h3>
        {questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === question.correctAnswer;
          
          return (
            <Card key={question.id} className={`border-l-4 ${isCorrect ? 'border-l-success' : 'border-l-destructive'}`}>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3 mb-4">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium mb-3">{question.question}</p>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Your answer: </span>
                        <span className={userAnswer !== null ? (isCorrect ? "text-success" : "text-destructive") : "text-muted-foreground"}>
                          {userAnswer !== null ? question.options[userAnswer] : "Not answered"}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p>
                          <span className="font-medium">Correct answer: </span>
                          <span className="text-success">{question.options[question.correctAnswer]}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};