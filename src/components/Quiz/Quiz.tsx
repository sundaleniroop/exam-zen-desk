import { useState, useEffect } from "react";
import { QuizTimer } from "./QuizTimer";
import { QuizProgress } from "./QuizProgress";
import { QuizQuestion, Question } from "./QuizQuestion";
import { QuizResults } from "./QuizResults";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BookOpen, Play } from "lucide-react";

// Sample quiz data
const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "What is the time complexity of binary search algorithm?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which of the following is NOT a primitive data type in Java?",
    options: ["int", "float", "String", "boolean"],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "What does SQL stand for?",
    options: ["Simple Query Language", "Structured Query Language", "Standard Query Language", "System Query Language"],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "In object-oriented programming, what is encapsulation?",
    options: [
      "The ability to create multiple methods with the same name",
      "The ability to inherit properties from a parent class",
      "The practice of hiding internal implementation details",
      "The ability to override methods in a subclass"
    ],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "Which data structure follows the LIFO (Last In, First Out) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1
  }
];

export const Quiz = () => {
  const [quizState, setQuizState] = useState<'start' | 'active' | 'finished'>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(sampleQuestions.length).fill(null));
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  const QUIZ_DURATION = 10 * 60; // 10 minutes in seconds

  const handleStartQuiz = () => {
    setQuizState('active');
    setStartTime(Date.now());
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinishQuiz = () => {
    setEndTime(Date.now());
    setQuizState('finished');
  };

  const handleTimeUp = () => {
    handleFinishQuiz();
  };

  const handleRestart = () => {
    setQuizState('start');
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(sampleQuestions.length).fill(null));
    setStartTime(0);
    setEndTime(0);
  };

  const timeTaken = endTime > 0 ? Math.floor((endTime - startTime) / 1000) : 0;

  if (quizState === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-6 rounded-full">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl">Programming Fundamentals Quiz</CardTitle>
            <p className="text-muted-foreground text-lg">
              Test your knowledge of basic programming concepts
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">Questions</span>
                </div>
                <p className="text-2xl font-bold text-primary">{sampleQuestions.length}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-warning mr-2" />
                  <span className="font-medium">Duration</span>
                </div>
                <p className="text-2xl font-bold text-warning">10 mins</p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-muted-foreground">
              <h4 className="font-medium text-foreground">Instructions:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>You have 10 minutes to complete all questions</li>
                <li>Each question has only one correct answer</li>
                <li>You can navigate between questions</li>
                <li>Your progress is saved automatically</li>
              </ul>
            </div>

            <Button onClick={handleStartQuiz} size="lg" className="w-full">
              <Play className="mr-2 h-5 w-5" />
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizState === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-4">
        <div className="container mx-auto py-8">
          <QuizResults
            questions={sampleQuestions}
            userAnswers={userAnswers}
            onRestart={handleRestart}
            timeTaken={timeTaken}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="container mx-auto py-8 space-y-6">
        {/* Header with Timer and Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuizProgress
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={sampleQuestions.length}
          />
          <QuizTimer
            initialTime={QUIZ_DURATION}
            onTimeUp={handleTimeUp}
            isActive={quizState === 'active'}
          />
        </div>

        {/* Question */}
        <QuizQuestion
          question={sampleQuestions[currentQuestionIndex]}
          selectedAnswer={userAnswers[currentQuestionIndex]}
          onAnswerSelect={handleAnswerSelect}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isFirst={currentQuestionIndex === 0}
          isLast={currentQuestionIndex === sampleQuestions.length - 1}
        />
      </div>
    </div>
  );
};