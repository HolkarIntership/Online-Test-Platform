import * as Yup from "yup"
import { allowedUsers } from "../data/allowed-users.js"

export const loginValidationSchema = Yup.object({
  name: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .test("allowed-user", "User not authorized for this test", function (value) {
      const { name } = this.parent
      return allowedUsers.some(
        (user) => user.email.toLowerCase() === value?.toLowerCase() && user.name.toLowerCase() === name?.toLowerCase(),
      )
    }),
  password: Yup.string().required("Password is required").oneOf(["password123"], "Invalid password"),
})
