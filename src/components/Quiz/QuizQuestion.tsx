import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizQuestionProps {
  question: Question;
  selectedAnswer: number | null;
  onAnswerSelect: (answerIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  showResult?: boolean;
  userAnswer?: number | null;
}

export const QuizQuestion = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  showResult = false,
  userAnswer
}: QuizQuestionProps) => {
  const getOptionClass = (optionIndex: number) => {
    if (!showResult) return "";
    
    if (optionIndex === question.correctAnswer) {
      return "bg-success/10 border-success text-success-foreground";
    }
    
    if (userAnswer === optionIndex && optionIndex !== question.correctAnswer) {
      return "bg-destructive/10 border-destructive text-destructive-foreground";
    }
    
    return "";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl leading-relaxed">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={(value) => !showResult && onAnswerSelect(parseInt(value))}
          disabled={showResult}
        >
          {question.options.map((option, index) => (
            <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${getOptionClass(index)}`}>
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label 
                htmlFor={`option-${index}`} 
                className="flex-1 cursor-pointer text-sm leading-relaxed"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {!showResult && (
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isFirst}
            >
              Previous
            </Button>
            <Button
              onClick={onNext}
              disabled={selectedAnswer === null}
            >
              {isLast ? "Finish Quiz" : "Next"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};