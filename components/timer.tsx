"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { formatTime } from "../utils/test-logic"

export default function Timer({ initialTime, onTimeUp, isActive = true, className = "" }) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime)

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1
        if (newTime <= 0) {
          onTimeUp()
          return 0
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, timeRemaining, onTimeUp])

  const isWarning = timeRemaining <= 300 // 5 minutes
  const isCritical = timeRemaining <= 60 // 1 minute

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
        isCritical
          ? "bg-destructive/10 text-destructive"
          : isWarning
            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
            : "bg-accent/10 text-accent"
      } ${className}`}
    >
      <Clock className="h-4 w-4" />
      <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
    </div>
  )
}
