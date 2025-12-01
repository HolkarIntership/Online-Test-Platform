"use client"

import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"

export default function TestProgress({ current, total, answered, className = "" }) {
  const progressPercentage = ((current + 1) / total) * 100
  const answeredPercentage = (answered / total) * 100

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Progress</span>
        <Badge variant="outline">
          {current + 1} of {total}
        </Badge>
      </div>

      <Progress value={progressPercentage} className="h-2" />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Question Progress</span>
        <span>{Math.round(progressPercentage)}%</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Answered</span>
        <Badge variant={answered === total ? "default" : "secondary"}>
          {answered} of {total}
        </Badge>
      </div>

      <Progress value={answeredPercentage} className="h-2" />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Completion</span>
        <span>{Math.round(answeredPercentage)}%</span>
      </div>
    </div>
  )
}
