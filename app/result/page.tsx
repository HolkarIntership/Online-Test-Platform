"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Separator } from "../../components/ui/separator"
import { CheckCircle, XCircle, Clock, Trophy, BookOpen, Eye, EyeOff, Download, Calendar } from "lucide-react"
import { getFromStorage } from "../../utils/storage"
import { calculateScore, formatTime } from "../../utils/test-logic"

export default function ResultPage({ user }) {
  const [results, setResults] = useState(null)
  const [evaluation, setEvaluation] = useState(null)
  const [showDetailedReview, setShowDetailedReview] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadResults = () => {
      const savedResults = getFromStorage(`test_results_${user.email}`)

      if (savedResults) {
        setResults(savedResults)

        // Calculate evaluation
        const evaluationData = calculateScore(savedResults.answers, savedResults.questions)
        setEvaluation(evaluationData)
      }

      setLoading(false)
    }

    loadResults()
  }, [user.email])

  const handleDownloadResults = () => {
    if (!results || !evaluation) return

    const reportData = {
      candidate: {
        name: user.name,
        email: user.email,
      },
      testDetails: {
        submittedAt: results.submittedAt,
        timeUsed: formatTime(results.timeUsed),
        autoSubmitted: results.autoSubmitted,
      },
      score: {
        correct: evaluation.score,
        total: evaluation.totalQuestions,
        percentage: evaluation.percentage,
      },
      detailedResults: evaluation.results.map((result) => ({
        question: result.question,
        userAnswer: result.userAnswer || "No Answer",
        correctAnswer: result.correctAnswer,
        isCorrect: result.isCorrect,
        type: result.type,
      })),
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `test-results-${user.name.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (percentage) => {
    if (percentage >= 80) return "default"
    if (percentage >= 60) return "secondary"
    return "destructive"
  }

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 90) return "Excellent! Outstanding performance."
    if (percentage >= 80) return "Great job! Very good performance."
    if (percentage >= 70) return "Good work! Above average performance."
    if (percentage >= 60) return "Fair performance. Room for improvement."
    return "Needs improvement. Consider additional study."
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!results || !evaluation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Results Found</h2>
            <p className="text-muted-foreground mb-4">We couldn't find any test results for your account.</p>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Test Results</h1>
              <p className="text-muted-foreground">Digital Marketing Assessment - {user.name}</p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleDownloadResults}>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Score Overview */}
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-accent/10 rounded-full">
                  <Trophy className="h-12 w-12 text-accent" />
                </div>
              </div>
              <CardTitle className="text-3xl">
                <span className={getScoreColor(evaluation.percentage)}>{evaluation.percentage}%</span>
              </CardTitle>
              <p className="text-muted-foreground text-lg">{getPerformanceMessage(evaluation.percentage)}</p>
            </CardHeader>

            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-green-600">{evaluation.score}</div>
                  <p className="text-sm text-muted-foreground">Correct Answers</p>
                </div>

                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-red-600">{evaluation.totalQuestions - evaluation.score}</div>
                  <p className="text-sm text-muted-foreground">Incorrect Answers</p>
                </div>

                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold">{evaluation.totalQuestions}</div>
                  <p className="text-sm text-muted-foreground">Total Questions</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <Badge variant={getScoreBadgeVariant(evaluation.percentage)}>
                    {evaluation.score}/{evaluation.totalQuestions}
                  </Badge>
                </div>
                <Progress value={evaluation.percentage} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Test Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Test Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submitted:</span>
                    <span>{new Date(results.submittedAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Used:</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatTime(results.timeUsed)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submission Type:</span>
                    <Badge variant={results.autoSubmitted ? "destructive" : "default"}>
                      {results.autoSubmitted ? "Auto-submitted" : "Manual"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Questions Answered:</span>
                    <span>
                      {Object.keys(results.answers).length}/{evaluation.totalQuestions}
                    </span>
                  </div>
                </div>
              </div>

              {results.autoSubmitted && (
                <Alert className="mt-4">
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    This test was automatically submitted when the time limit was reached.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Detailed Review Toggle */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">Detailed Answer Review</h3>
                  <p className="text-sm text-muted-foreground">
                    Review each question with your answers and correct solutions
                  </p>
                </div>

                <Button variant="outline" onClick={() => setShowDetailedReview(!showDetailedReview)}>
                  {showDetailedReview ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide Review
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show Review
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Review */}
          {showDetailedReview && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Question by Question Review
              </h2>

              {evaluation.results.map((result, index) => (
                <Card key={result.questionId} className={result.isCorrect ? "border-green-200" : "border-red-200"}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Question {index + 1}</Badge>
                          <Badge variant={result.type === "mcq" ? "default" : "secondary"}>
                            {result.type === "mcq" ? "Multiple Choice" : "Text Answer"}
                          </Badge>
                          {result.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <CardTitle className="text-base leading-relaxed">{result.question}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Your Answer:</h4>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          {result.userAnswer ? (
                            <p className="text-sm">{result.userAnswer}</p>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">No answer provided</p>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium text-sm mb-2">
                          {result.type === "mcq" ? "Correct Answer:" : "Expected Keywords/Concepts:"}
                        </h4>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          {result.type === "mcq" ? (
                            <p className="text-sm">{result.correctAnswer}</p>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-sm">Expected keywords: {result.correctAnswer.keywords.join(", ")}</p>
                              <p className="text-xs text-muted-foreground">
                                Minimum keywords required: {result.correctAnswer.minKeywords}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {!result.isCorrect && result.type === "text" && (
                        <Alert>
                          <AlertDescription className="text-sm">
                            For text questions, answers are evaluated based on keyword matching. Make sure to include
                            relevant technical terms and concepts in your responses.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Thank you for completing the Digital Marketing Assessment. Your results have been recorded.
                </p>

                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={handleDownloadResults}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Results
                  </Button>
                </div>

                <Alert>
                  <AlertDescription>
                    <strong>Important:</strong> This test can only be taken once per user. Your results are final and
                    have been permanently recorded.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
