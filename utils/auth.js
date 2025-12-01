import { allowedUsers } from "../data/allowed-users.js"
import { getCurrentUser, isUserCompleted } from "./storage.js"

export const validateUser = (name, email, password) => {
  // Check password
  if (password !== "password123") {
    return { isValid: false, error: "Invalid password" }
  }

  // Check if user is in allowed list
  const isAllowed = allowedUsers.some(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.name.toLowerCase() === name.toLowerCase(),
  )

  if (!isAllowed) {
    return { isValid: false, error: "User not authorized for this test" }
  }

  // Check if user has already completed the test
  if (isUserCompleted(email)) {
    return { isValid: false, error: "You have already completed this test. Multiple attempts are not allowed." }
  }

  return { isValid: true }
}

export const isAuthenticated = () => {
  const user = getCurrentUser()
  return user !== null
}

export const getUserSession = () => {
  return getCurrentUser()
}
