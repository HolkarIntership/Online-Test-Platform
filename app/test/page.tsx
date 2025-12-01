"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Progress } from "../../components/ui/progress"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Badge } from "../../components/ui/badge"
import { Clock, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, BookOpen, Timer } from "lucide-react"
import { getRandomQuestions, formatTime } from "../../utils/test-logic"
import { saveToStorage, getFromStorage, StorageKeys, markUserCompleted, isUserCompleted } from "../../utils/storage"

const TIMER_DURATION = 25 * 60 // 25 minutes in seconds

export default function TestPage({ user, onTestComplete }) {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION)
  const [isTestStarted, setIsTestStarted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)

  useEffect(() => {
    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading user data...</p>
          </div>
        </div>
      )
    }

    if (!user?.email) return

    if (isUserCompleted(user.email)) {
      // If user has completed test, redirect to results immediately
      onTestComplete()
      return
    }
  }, [user, onTestComplete])

  // Initialize test data
  useEffect(() => {
    if (!user?.email) return

    if (isUserCompleted(user.email)) {
      return
    }

    const savedTestState = getFromStorage(StorageKeys.TEST_STATE)
    const savedTimerState = getFromStorage(StorageKeys.TIMER_STATE)

    if (savedTestState && savedTestState.userEmail === user.email) {
      // Resume existing test
      setQuestions(savedTestState.questions)
      setAnswers(savedTestState.answers)
      setCurrentQuestionIndex(savedTestState.currentQuestionIndex)
      setIsTestStarted(true)

      if (savedTimerState && savedTimerState.userEmail === user.email) {
        const elapsed = Math.floor((Date.now() - savedTimerState.startTime) / 1000)
        const remaining = Math.max(0, TIMER_DURATION - elapsed)
        setTimeRemaining(remaining)
      }
    } else {
      // Start new test
      const randomQuestions = getRandomQuestions(30)
      setQuestions(randomQuestions)

      const initialTestState = {
        userEmail: user.email,
        questions: randomQuestions,
        answers: {},
        currentQuestionIndex: 0,
        startTime: Date.now(),
      }
      saveToStorage(StorageKeys.TEST_STATE, initialTestState)
    }
  }, [user?.email])

  // Timer logic
  useEffect(() => {
    if (!isTestStarted || timeRemaining <= 0 || !user?.email) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1

        // Save timer state
        const timerState = {
          userEmail: user.email,
          startTime: Date.now() - (TIMER_DURATION - newTime) * 1000,
        }
        saveToStorage(StorageKeys.TIMER_STATE, timerState)

        if (newTime <= 0) {
          handleAutoSubmit()
          return 0
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTestStarted, timeRemaining, user?.email])

  // Save test state whenever answers change
  useEffect(() => {
    if (!isTestStarted || questions.length === 0 || !user?.email) return

    const testState = {
      userEmail: user.email,
      questions,
      answers,
      currentQuestionIndex,
      startTime: Date.now() - (TIMER_DURATION - timeRemaining) * 1000,
    }
    saveToStorage(StorageKeys.TEST_STATE, testState)
  }, [answers, currentQuestionIndex, questions, isTestStarted, user?.email, timeRemaining])

  const handleStartTest = () => {
    if (!user?.email) return

    setIsTestStarted(true)
    const timerState = {
      userEmail: user.email,
      startTime: Date.now(),
    }
    saveToStorage(StorageKeys.TIMER_STATE, timerState)
  }

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleAutoSubmit = useCallback(() => {
    if (isSubmitting || !user?.email || !user?.name) return

    setIsSubmitting(true)

    markUserCompleted(user.email)

    // Save final results
    const finalResults = {
      userEmail: user.email,
      userName: user.name,
      answers,
      questions,
      submittedAt: new Date().toISOString(),
      timeUsed: TIMER_DURATION - timeRemaining,
      autoSubmitted: true,
    }

    saveToStorage(`test_results_${user.email}`, finalResults)

    setTimeout(() => {
      onTestComplete()
    }, 1000)
  }, [answers, questions, user, timeRemaining, isSubmitting, onTestComplete])

  const handleManualSubmit = () => {
    if (isSubmitting || !user?.email || !user?.name) return

    setIsSubmitting(true)

    markUserCompleted(user.email)

    // Save final results
    const finalResults = {
      userEmail: user.email,
      userName: user.name,
      answers,
      questions,
      submittedAt: new Date().toISOString(),
      timeUsed: TIMER_DURATION - timeRemaining,
      autoSubmitted: false,
    }

    saveToStorage(`test_results_${user.email}`, finalResults)

    setTimeout(() => {
      onTestComplete()
    }, 1000)
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  const isTimeWarning = timeRemaining <= 300 // 5 minutes
  const isTimeCritical = timeRemaining <= 60 // 1 minute

  if (!isTestStarted && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-accent/10 rounded-full">
                <BookOpen className="h-12 w-12 text-accent" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Ready to Start Your Test?</h1>
            <p className="text-muted-foreground text-lg">
              Welcome, <span className="font-semibold text-foreground">{user?.name || "User"}</span>
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Test Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Test Details</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 30 questions (randomly selected)</li>
                    <li>• 25 minutes duration</li>
                    <li>• Mix of MCQ and text questions</li>
                    <li>• Auto-save enabled</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Important Notes</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• You can navigate between questions</li>
                    <li>• Test auto-submits when time expires</li>
                    <li>• Your progress is automatically saved</li>
                    <li>• Only one attempt allowed</li>
                  </ul>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Once you start the test, the timer will begin immediately. Make sure you have a stable internet
                  connection and won't be interrupted.
                </AlertDescription>
              </Alert>

              <Button onClick={handleStartTest} className="w-full" size="lg">
                Start Test Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Timer */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">Web Designing Assessment</h1>
              <Badge variant="outline">{user?.name || "User"}</Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>

              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  isTimeCritical
                    ? "bg-destructive/10 text-destructive"
                    : isTimeWarning
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                      : "bg-accent/10 text-accent"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Question Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={currentQuestion.type === "mcq" ? "default" : "secondary"}>
                      {currentQuestion.type === "mcq" ? "Multiple Choice" : "Text Answer"}
                    </Badge>
                    <Badge variant="outline">{currentQuestion.category}</Badge>
                  </div>
                  <CardTitle className="text-lg leading-relaxed">{currentQuestion.question}</CardTitle>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {answers[currentQuestion.id] && <CheckCircle className="h-4 w-4 text-green-600" />}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {currentQuestion.type === "mcq" ? (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/5 transition-colors"
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="w-4 h-4 text-accent"
                      />
                      <span className="flex-1">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor={`answer-${currentQuestion.id}`}>Your Answer</Label>
                  <Textarea
                    id={`answer-${currentQuestion.id}`}
                    placeholder="Type your answer here..."
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide a detailed answer. Include relevant keywords and examples where applicable.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Answered: {getAnsweredCount()} / {questions.length}
              </div>

              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={() => setShowSubmitConfirm(true)}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Submitting..." : "Submit Test"}
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Submit Confirmation */}
          {showSubmitConfirm && (
            <Card className="border-accent">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold">Submit Test?</h3>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    You have answered {getAnsweredCount()} out of {questions.length} questions. Once submitted, you
                    cannot make any changes.
                  </p>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowSubmitConfirm(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleManualSubmit}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? "Submitting..." : "Confirm Submit"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
