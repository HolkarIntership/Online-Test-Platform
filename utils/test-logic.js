import { questionsPool } from "../data/questions.js"
import { correctAnswers } from "../data/correct-answers.js"

export const getRandomQuestions = (count = 30) => {
  const shuffled = [...questionsPool].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const evaluateAnswer = (questionId, userAnswer, questionType) => {
  const correctAnswer = correctAnswers[questionId]

  if (questionType === "mcq") {
    return userAnswer === correctAnswer
  } else if (questionType === "text") {
    if (!userAnswer || userAnswer.trim() === "") return false

    const userText = userAnswer.toLowerCase()
    const matchedKeywords = correctAnswer.keywords.filter((keyword) => userText.includes(keyword.toLowerCase()))

    return matchedKeywords.length >= correctAnswer.minKeywords
  }

  return false
}

export const calculateScore = (answers, questions) => {
  let correctCount = 0
  const results = []

  questions.forEach((question) => {
    const userAnswer = answers[question.id]
    const isCorrect = evaluateAnswer(question.id, userAnswer, question.type)

    if (isCorrect) correctCount++

    results.push({
      questionId: question.id,
      question: question.question,
      userAnswer,
      correctAnswer: correctAnswers[question.id],
      isCorrect,
      type: question.type,
    })
  })

  return {
    score: correctCount,
    totalQuestions: questions.length,
    percentage: Math.round((correctCount / questions.length) * 100),
    results,
  }
}

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}
