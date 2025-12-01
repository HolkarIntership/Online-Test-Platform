export const TEST_CONFIG = {
  TIMER_DURATION: 25 * 60, // 25 minutes in seconds
  TOTAL_QUESTIONS: 30,
  QUESTION_POOL_SIZE: 50,
  PASSWORD: "password123",
  WARNING_TIME: 5 * 60, // 5 minutes
  CRITICAL_TIME: 1 * 60, // 1 minute
}

export const ROUTES = {
  LOGIN: "/",
  TEST: "/test",
  RESULT: "/result",
}

export const STORAGE_KEYS = {
  CURRENT_USER: "test_platform_current_user",
  TEST_STATE: "test_platform_test_state",
  COMPLETED_USERS: "test_platform_completed_users",
  TIMER_STATE: "test_platform_timer_state",
  TEST_RESULTS: "test_results_",
}

export const QUESTION_TYPES = {
  MCQ: "mcq",
  TEXT: "text",
}

export const SUBMISSION_TYPES = {
  MANUAL: "manual",
  AUTO: "auto",
}
