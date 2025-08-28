"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Brain, Target, Award, TrendingUp, Sparkles, Zap, Star, CheckCircle, ArrowRight, ArrowLeft, Play, Trophy, Lightbulb, Users, BarChart3, RotateCcw, ChevronRight, Check } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Loading your assessment...</p>
        </div>
      </div>
    );
  }

  if (!isTestStarted) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-2 mb-8 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Professional Career Assessment
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-800 mb-8">
              Discover Your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Perfect Career Path
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Take our scientifically validated psychometric assessment to understand your strengths, 
              personality traits, and find the perfect career that matches your unique profile.
            </p>
          </div>

          {/* Main Card */}
          <Card className="max-w-4xl mx-auto bg-white shadow-2xl border-0 rounded-3xl overflow-hidden">
            <CardHeader className="text-center pt-12 pb-8">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-6">
                    <Brain className="h-16 w-16 text-white" />
                  </div>
                </div>
              </div>
              
              <CardTitle className="text-3xl md:text-4xl text-slate-800 mb-4">
                {test.title}
              </CardTitle>
              
              <CardDescription className="text-lg text-slate-600 max-w-2xl mx-auto">
                {test.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-12 space-y-10">
              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="bg-blue-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-xl mb-2">{test.estimatedTime} minutes</h3>
                  <p className="text-slate-600">Quick & comprehensive</p>
                </div>
                
                <div className="text-center group">
                  <div className="bg-purple-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-xl mb-2">{test.questions.length} questions</h3>
                  <p className="text-slate-600">Balanced assessment</p>
                </div>
                
                <div className="text-center group">
                  <div className="bg-indigo-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Award className="h-10 w-10 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-xl mb-2">Instant results</h3>
                  <p className="text-slate-600">Get insights immediately</p>
                </div>
              </div>
              
              {/* Start Button */}
              <div className="text-center">
                <Button 
                  onClick={startTest}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                >
                  <Play className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                  Start Your Assessment
                  <ChevronRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <p className="text-slate-500 mt-6 text-sm">
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
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Success Header */}
          <div className="text-center mb-20">
            {showConfetti && (
              <div className="fixed inset-0 pointer-events-none z-50">
                <div className="absolute top-1/4 left-1/4 animate-bounce">🎉</div>
                <div className="absolute top-1/3 right-1/4 animate-bounce delay-100">✨</div>
                <div className="absolute bottom-1/3 left-1/3 animate-bounce delay-200">🎊</div>
                <div className="absolute top-1/2 right-1/3 animate-bounce delay-300">🌟</div>
              </div>
            )}
            
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-2 mb-8 text-sm font-medium">
              <Trophy className="h-4 w-4" />
              Assessment Complete!
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
              Congratulations! 🎉
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              You've completed your assessment! Here's what we discovered about your unique profile.
            </p>
          </div>

          <div className="space-y-8">
            {/* Overall Score Card */}
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
              <CardHeader className="text-center pt-12 pb-8">
                <CardTitle className="text-3xl text-slate-800 flex items-center justify-center gap-3">
                  <Star className="h-8 w-8 text-yellow-500" />
                  Your Overall Score
                  <Star className="h-8 w-8 text-yellow-500" />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-12">
                <div className="relative">
                  <div className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                    {results.totalScore}
                  </div>
                </div>
                <p className="text-slate-600 text-lg">out of maximum possible score</p>
              </CardContent>
            </Card>

            {/* Career Recommendations */}
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
              <CardHeader className="pt-12 pb-8">
                <CardTitle className="text-3xl text-slate-800 flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  Recommended Career Paths
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.recommendations.map((career, index) => (
                    <div key={index} className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-slate-800 text-lg">{career}</h4>
                      </div>
                      <p className="text-slate-600 text-sm">Perfect match for your profile</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Personality Insights */}
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
              <CardHeader className="pt-12 pb-8">
                <CardTitle className="text-3xl text-slate-800 flex items-center gap-3">
                  <Lightbulb className="h-8 w-8 text-yellow-500" />
                  Personality Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-12">
                <div className="space-y-4">
                  {results.personalityInsights.map((insight, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                      <p className="text-slate-700 font-medium">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Scores */}
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
              <CardHeader className="pt-12 pb-8">
                <CardTitle className="text-3xl text-slate-800 flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                  Detailed Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-12">
                <div className="space-y-8">
                  {Object.entries(results.categoryScores).map(([category, score]) => (
                    <div key={category} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-800 text-xl capitalize">
                          {category.replace('_', ' ')}
                        </span>
                        <span className="text-2xl font-bold text-blue-600">{score}%</span>
                      </div>
                      <Progress value={score} className="h-3 bg-slate-200" />
                      <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl">
                        <strong className="text-slate-800">{results.detailedAnalysis[category]?.level}</strong> - {results.detailedAnalysis[category]?.description}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Career Matches */}
            <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
              <CardHeader className="pt-12 pb-8">
                <CardTitle className="text-3xl text-slate-800 flex items-center gap-3">
                  <Target className="h-8 w-8 text-green-600" />
                  Career Matches
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-12">
                <div className="space-y-6">
                  {results.careerMatches.map((match, index) => (
                    <div key={index} className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-slate-800 text-xl capitalize">
                          {match.category.replace('_', ' ')}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold text-green-600">
                            {match.percentage}%
                          </span>
                          <span className="text-sm text-slate-600">Match</span>
                        </div>
                      </div>
                      <div className="text-slate-600">
                        <strong className="text-slate-800">Recommended Careers:</strong>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {match.careers.map((career, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                              <Check className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium">{career}</span>
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
            <div className="text-center space-y-6">
              <Button 
                onClick={resetTest}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-2xl"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Take Test Again
              </Button>
              
              <div className="text-slate-500 text-sm">
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
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-2 mb-6 text-sm font-medium">
            <Brain className="h-4 w-4" />
            Question {currentQuestion + 1} of {test.questions.length}
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
            {test.title}
          </h2>
          
          <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
            <span className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm">
              <Clock className="h-4 w-4 text-blue-600" />
              {formatTime(timeLeft)}
            </span>
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm">
              <Zap className="h-4 w-4 text-purple-600" />
              {Math.round(progress)}% Complete
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-slate-600 font-medium">Progress</span>
            <span className="text-sm font-bold text-slate-800">{Math.round(progress)}%</span>
          </div>
          <div className="bg-white rounded-full h-3 shadow-inner overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-white shadow-2xl border-0 mb-10 rounded-3xl overflow-hidden">
          <CardHeader className="pt-10 pb-6">
            <CardTitle className="text-2xl text-slate-800 leading-relaxed">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-10">
            <div className="space-y-4">
              {currentQ.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => selectAnswer(currentQ.id, option.value)}
                  className={`w-full p-6 text-left rounded-2xl border-2 transition-all duration-300 group hover:shadow-lg ${
                    answers[currentQ.id] === option.value
                      ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg scale-[1.02]"
                      : "border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      answers[currentQ.id] === option.value
                        ? "border-blue-500 bg-blue-500 scale-110"
                        : "border-slate-300 group-hover:border-blue-400"
                    }`}>
                      {answers[currentQ.id] === option.value && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium text-slate-700 text-lg group-hover:text-slate-800 transition-colors">
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
            className="px-8 py-4 text-lg border-2 border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Previous
          </Button>

          <div className="flex gap-4">
            {currentQuestion < test.questions.length - 1 ? (
              <Button
                onClick={nextQuestion}
                disabled={!hasAnswer}
                className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Next Question
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={submitTest}
                disabled={!hasAnswer || isLoading}
                className="px-8 py-4 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
    </section>
  );
};

export default PsychometricTest;
