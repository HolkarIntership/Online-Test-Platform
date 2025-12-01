export const StorageKeys = {
  CURRENT_USER: "test_platform_current_user",
  TEST_STATE: "test_platform_test_state",
  COMPLETED_USERS: "test_platform_completed_users",
  TIMER_STATE: "test_platform_timer_state",
}

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

export const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Error reading from localStorage:", error)
    return null
  }
}

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error("Error removing from localStorage:", error)
  }
}

export const clearAllStorage = () => {
  try {
    const completedUsers = getFromStorage(StorageKeys.COMPLETED_USERS)

    Object.values(StorageKeys).forEach((key) => {
      localStorage.removeItem(key)
    })

    // Restore completed users list to maintain test blocking
    if (completedUsers && completedUsers.length > 0) {
      saveToStorage(StorageKeys.COMPLETED_USERS, completedUsers)
    }
  } catch (error) {
    console.error("Error clearing localStorage:", error)
  }
}

// User management functions
export const isUserCompleted = (email) => {
  const completedUsers = getFromStorage(StorageKeys.COMPLETED_USERS) || []
  return completedUsers.includes(email)
}

export const markUserCompleted = (email) => {
  const completedUsers = getFromStorage(StorageKeys.COMPLETED_USERS) || []
  if (!completedUsers.includes(email)) {
    completedUsers.push(email)
    saveToStorage(StorageKeys.COMPLETED_USERS, completedUsers)
  }
}

export const getCurrentUser = () => {
  return getFromStorage(StorageKeys.CURRENT_USER)
}

export const setCurrentUser = (user) => {
  saveToStorage(StorageKeys.CURRENT_USER, user)
}

export const clearCurrentUser = () => {
  removeFromStorage(StorageKeys.CURRENT_USER)
}
