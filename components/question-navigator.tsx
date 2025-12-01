"use client"

import { Button } from "./ui/button"
import { CheckCircle, Circle } from "lucide-react"

export default function QuestionNavigator({ questions, currentIndex, answers, onQuestionSelect, className = "" }) {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="font-semibold text-sm">Question Navigator</h3>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((question, index) => {
          const isAnswered = answers[question.id] && answers[question.id].trim() !== ""
          const isCurrent = index === currentIndex

          return (
            <Button
              key={question.id}
              variant={isCurrent ? "default" : "outline"}
              size="sm"
              onClick={() => onQuestionSelect(index)}
              className="relative h-10 w-10 p-0"
            >
              <span className="text-xs">{index + 1}</span>
              {isAnswered && (
                <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-600 bg-background rounded-full" />
              )}
            </Button>
          )
        })}
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span>Current Question</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-green-600" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <Circle className="w-3 h-3 text-muted-foreground" />
          <span>Not Answered</span>
        </div>
      </div>
    </div>
  )
}
