"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Brain, Target, Award, TrendingUp, Sparkles, Zap, Star, CheckCircle, ArrowRight, ArrowLeft, Play, Trophy, Lightbulb, Users, BarChart3, RotateCcw } from "lucide-react";
import { PsychometricTest as TestType, PsychometricQuestion, TestSubmission } from "@/app/api/psychometric-test/route";

interface TestResults {
  totalScore: number;
  categoryScores: { [key: string]: number };
  recommendations: string[];
  personalityInsights: string[];
  detailedAnalysis: { [key: string]: { level: string; description: string } };
  careerMatches: Array<{
    category: string;
    match: string;
    percentage: number;
    careers: string[];
  }>;
}

const PsychometricTest = () => {
  const [test, setTest] = useState<TestType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [results, setResults] = useState<TestResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchTest();
  }, []);

  useEffect(() => {
    if (isTestStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isTestStarted, timeLeft]);

  const fetchTest = async () => {
    try {
      const response = await fetch("/api/psychometric-test");
      const testData = await response.json();
      setTest(testData);
      setTimeLeft(testData.estimatedTime * 60);
    } catch (error) {
      console.error("Failed to fetch test:", error);
    }
  };

  const startTest = () => {
    setIsTestStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(test?.estimatedTime ? test.estimatedTime * 60 : 900);
  };

  const selectAnswer = (questionId: number, optionValue: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionValue }));
  };

  const nextQuestion = () => {
    if (currentQuestion < (test?.questions.length || 0) - 1) {
      // Ensure the current answer is saved before moving to next question
      if (answers[currentQ.id]) {
        setCurrentQuestion(prev => prev + 1);
      }
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitTest = async () => {
    if (!test) return;

    const submission: TestSubmission = {
      testId: test.id,
      answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId: parseInt(questionId),
        selectedOption
      })),
      timestamp: new Date().toISOString()
    };

    setIsLoading(true);
    try {
      const response = await fetch("/api/psychometric-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      });

      const result = await response.json();
      if (result.success) {
        setResults(result.results);
        setIsTestCompleted(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch (error) {
      console.error("Failed to submit test:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetTest = () => {
    setIsTestStarted(false);
    setIsTestCompleted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
    setTimeLeft(test?.estimatedTime ? test.estimatedTime * 60 : 900);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!test) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-1 via-primary-2 to-primary-3 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-main border-t-transparent mx-auto mb-4"></div>
          <p className="text-primary-6 text-lg">Loading your assessment...</p>
        </div>
      </div>
    );
  }

  if (!isTestStarted) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-1 via-gray-2 to-primary-1 py-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6 animate-fadeIn">
              <Sparkles className="h-5 w-5 text-tertiary-main" />
              <span className="text-primary-6 font-medium break-words">Professional Assessment</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-primary-6 mb-6 leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-primary-main via-primary-5 to-secondary-main bg-clip-text text-transparent break-words whitespace-nowrap" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Perfect Career Path
              </span>
            </h1>
            
            <p className="text-xl text-primary-7 max-w-4xl mx-auto leading-relaxed break-words">
              Take our scientifically validated psychometric assessment to understand your strengths, 
              personality traits, and find the perfect career that matches your unique profile.
            </p>
          </div>

          {/* Main Card */}
          <Card className="max-w-5xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-1/20 to-secondary-1/20"></div>
            
            <CardHeader className="text-center relative z-10">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-main to-secondary-main rounded-full blur-xl opacity-30 animate-pulse"></div>
                  <Brain className="h-20 w-20 text-primary-main relative z-10" />
                </div>
              </div>
              
              <CardTitle className="text-4xl text-primary-6 mb-4">
                {test.title}
              </CardTitle>
              
              <CardDescription className="text-xl text-primary-7 max-w-3xl mx-auto">
                {test.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-8">
              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group text-center p-6 bg-gradient-to-br from-primary-1 to-primary-2 rounded-2xl border border-primary-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-tertiary-main/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Clock className="h-8 w-8 text-tertiary-main" />
                  </div>
                  <h3 className="font-bold text-primary-6 text-lg mb-2">{test.estimatedTime} minutes</h3>
                  <p className="text-primary-7">Quick & comprehensive</p>
                </div>
                
                <div className="group text-center p-6 bg-gradient-to-br from-secondary-1 to-secondary-2 rounded-2xl border border-secondary-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-secondary-main/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Target className="h-8 w-8 text-secondary-main" />
                  </div>
                  <h3 className="font-bold text-primary-6 text-lg mb-2">{test.questions.length} questions</h3>
                  <p className="text-primary-7">Balanced assessment</p>
                </div>
                
                <div className="group text-center p-6 bg-gradient-to-br from-tertiary-main/10 to-tertiary-main/20 rounded-2xl border border-tertiary-main/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-tertiary-main/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Award className="h-8 w-8 text-tertiary-main" />
                  </div>
                  <h3 className="font-bold text-primary-6 text-lg mb-2">Instant results</h3>
                  <p className="text-primary-7">Get insights immediately</p>
                </div>
              </div>
              
              {/* Start Button */}
              <div className="text-center">
                <Button 
                  onClick={startTest}
                  size="lg"
                  className="bg-gradient-to-r from-tertiary-main to-primary-main hover:from-tertiary-main/90 hover:to-primary-6 text-white px-12 py-4 text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                >
                  <Play className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                  Start Your Assessment
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <p className="text-primary-7 mt-4 text-sm">
                  Join thousands who have discovered their ideal career path
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (isTestCompleted && results) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-1 via-success-1 to-success-2 py-16">
        <div className="container mx-auto px-4">
          {/* Success Header */}
          <div className="text-center mb-16">
            {showConfetti && (
              <div className="fixed inset-0 pointer-events-none z-50">
                <div className="absolute top-1/4 left-1/4 animate-bounce">🎉</div>
                <div className="absolute top-1/3 right-1/4 animate-bounce delay-100">✨</div>
                <div className="absolute bottom-1/3 left-1/3 animate-bounce delay-200">🎊</div>
                <div className="absolute top-1/2 right-1/3 animate-bounce delay-300">🌟</div>
              </div>
            )}
            
            <div className="inline-flex items-center gap-3 bg-success-main/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6 animate-fadeIn">
              <Trophy className="h-5 w-5 text-success-main" />
              <span className="text-success-main font-medium">Assessment Complete!</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-success-7 mb-6">
              Congratulations! 🎉
            </h1>
            
            <p className="text-xl text-success-6 max-w-3xl mx-auto">
              You've completed your assessment! Here's what we discovered about your unique profile.
            </p>
          </div>

          <div className="max-w-7xl mx-auto space-y-8">
            {/* Overall Score Card */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-success-1/20 to-success-2/20"></div>
              <CardHeader className="text-center relative z-10">
                <CardTitle className="text-3xl text-success-7 flex items-center justify-center gap-3">
                  <Star className="h-8 w-8 text-success-main" />
                  Your Overall Score
                  <Star className="h-8 w-8 text-success-main" />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <div className="relative">
                  <div className="text-8xl font-bold bg-gradient-to-r from-success-main to-success-6 bg-clip-text text-transparent mb-4">
                    {results.totalScore}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-success-main/20 to-success-6/20 rounded-full blur-3xl scale-150"></div>
                </div>
                <p className="text-success-6 text-lg">out of maximum possible score</p>
              </CardContent>
            </Card>

            {/* Career Recommendations */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-1/20 to-primary-2/20"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-3xl text-primary-6 flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-primary-main" />
                  Recommended Career Paths
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.recommendations.map((career, index) => (
                    <div key={index} className="group p-6 bg-gradient-to-br from-primary-1 to-primary-2 rounded-2xl border border-primary-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="h-5 w-5 text-primary-main" />
                        <h4 className="font-semibold text-primary-6 text-lg">{career}</h4>
                      </div>
                      <p className="text-primary-7 text-sm">Perfect match for your profile</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Personality Insights */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-1/20 to-secondary-2/20"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-3xl text-primary-6 flex items-center gap-3">
                  <Lightbulb className="h-8 w-8 text-secondary-main" />
                  Personality Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  {results.personalityInsights.map((insight, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-secondary-1 to-secondary-2 rounded-xl border border-secondary-2">
                      <p className="text-secondary-7 font-medium">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Scores */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-1/20 to-primary-2/20"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-3xl text-primary-6 flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-primary-main" />
                  Detailed Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-6">
                  {Object.entries(results.categoryScores).map(([category, score]) => (
                    <div key={category} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-primary-6 text-lg capitalize">
                          {category.replace('_', ' ')}
                        </span>
                        <span className="text-lg font-bold text-primary-main">{score}%</span>
                      </div>
                      <Progress value={score} className="h-3 bg-primary-2" />
                      <div className="text-sm text-primary-7 bg-primary-1/50 p-3 rounded-lg">
                        <strong>{results.detailedAnalysis[category]?.level}</strong> - {results.detailedAnalysis[category]?.description}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Career Matches */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-tertiary-main/10 to-tertiary-main/20"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-3xl text-primary-6 flex items-center gap-3">
                  <Target className="h-8 w-8 text-tertiary-main" />
                  Career Matches
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-6">
                  {results.careerMatches.map((match, index) => (
                    <div key={index} className="p-6 bg-gradient-to-br from-tertiary-main/10 to-tertiary-main/20 rounded-2xl border border-tertiary-main/30">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-primary-6 text-xl capitalize">
                          {match.category.replace('_', ' ')}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-tertiary-main">
                            {match.percentage}%
                          </span>
                          <span className="text-sm text-primary-7">Match</span>
                        </div>
                      </div>
                      <div className="text-primary-7">
                        <strong className="text-primary-6">Recommended Careers:</strong>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {match.careers.map((career, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-tertiary-main" />
                              <span className="text-sm">{career}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="text-center space-y-4">
                              <Button 
                  onClick={resetTest}
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-lg border-2 border-primary-main text-primary-main hover:bg-primary-main hover:text-white transition-all duration-300"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Take Test Again
                </Button>
              
              <div className="text-primary-7 text-sm">
                Share your results with friends and family!
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentQ = test.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / test.questions.length) * 100;
  const hasAnswer = answers[currentQ.id];

  return (
          <section className="min-h-screen bg-gradient-to-br from-gray-1 via-gray-2 to-primary-1 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <Brain className="h-5 w-5 text-tertiary-main" />
              <span className="text-primary-6 font-medium">Question {currentQuestion + 1} of {test.questions.length}</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-primary-6 mb-4">
              {test.title}
            </h2>
            
            <div className="flex items-center justify-center gap-6 text-sm text-primary-7">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {formatTime(timeLeft)}
              </span>
              <span className="w-2 h-2 bg-tertiary-main rounded-full"></span>
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-tertiary-main" />
                {Math.round(progress)}% Complete
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-primary-7">Progress</span>
              <span className="text-sm font-medium text-primary-6">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-primary-2" style={{ '--progress-color': 'var(--tertiary-main)' } as React.CSSProperties} />
          </div>

          {/* Question Card */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 mb-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-primary-1/20"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl text-primary-6 leading-relaxed">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-4">
                {currentQ.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => selectAnswer(currentQ.id, option.value)}
                    className={`w-full p-6 text-left rounded-2xl border-2 transition-all duration-300 group hover:shadow-lg ${
                      answers[currentQ.id] === option.value
                        ? "border-tertiary-main bg-gradient-to-r from-tertiary-main/10 to-tertiary-main/20 shadow-lg scale-[1.02]"
                        : "border-primary-2 hover:border-tertiary-main hover:bg-tertiary-main/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        answers[currentQ.id] === option.value
                          ? "border-tertiary-main bg-tertiary-main scale-110"
                          : "border-primary-3 group-hover:border-tertiary-main"
                      }`}>
                        {answers[currentQ.id] === option.value && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="font-medium text-primary-6 text-lg group-hover:text-tertiary-main transition-colors">
                        {option.text}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              variant="outline"
              className="px-8 py-3 text-lg border-2 border-primary-main text-primary-main hover:bg-primary-main hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>

            <div className="flex gap-4">
              {currentQuestion < test.questions.length - 1 ? (
                <Button
                  onClick={nextQuestion}
                  disabled={!hasAnswer}
                  className="px-8 py-3 text-lg bg-gradient-to-r from-tertiary-main to-primary-main hover:from-tertiary-main/90 hover:to-primary-6 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Next Question
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={submitTest}
                  disabled={!hasAnswer || isLoading}
                  className="px-8 py-3 text-lg bg-gradient-to-r from-success-main to-success-6 hover:from-success-6 hover:to-success-7 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Trophy className="h-5 w-5 mr-2" />
                      Submit & Get Results
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PsychometricTest;
