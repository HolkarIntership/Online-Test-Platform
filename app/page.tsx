"use client"

import { useEffect, useState } from "react"
import { getCurrentUser, isUserCompleted, getFromStorage } from "../utils/storage"
import LoginPage from "./login/page"
import TestPage from "./test/page"
import ResultPage from "./result/page"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("login")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)

      if (isUserCompleted(currentUser.email)) {
        setCurrentPage("result")
      } else {
        // Double-check if user somehow bypassed login validation
        const testResults = getFromStorage(`test_results_${currentUser.email}`)
        if (testResults) {
          setCurrentPage("result")
        } else {
          setCurrentPage("test")
        }
      }
    }
    setLoading(false)
  }, [])

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setCurrentPage("test")
  }

  const handleTestComplete = () => {
    setCurrentPage("result")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {currentPage === "login" && <LoginPage onLoginSuccess={handleLoginSuccess} />}
      {currentPage === "test" && user && <TestPage user={user} onTestComplete={handleTestComplete} />}
      {currentPage === "result" && user && <ResultPage user={user} />}
    </div>
  )
}
