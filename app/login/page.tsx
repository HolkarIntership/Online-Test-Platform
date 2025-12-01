"use client"

import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { loginValidationSchema } from "../../utils/validation"
import { setCurrentUser, isUserCompleted } from "../../utils/storage"
import { AlertCircle, BookOpen, Clock, Users } from "lucide-react"

export default function LoginPage({ onLoginSuccess }) {
  const [loginError, setLoginError] = useState("")

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoginError("")


      // Check if user has already completed the test
      if (isUserCompleted(values.email)) {
        setLoginError("You have already completed this test. Multiple attempts are not allowed.")
        setSubmitting(false)
        return
      }

      // Save user data and proceed
      const userData = {
        name: values.name,
        email: values.email,
        loginTime: new Date().toISOString(),
      }

      setCurrentUser(userData)
      onLoginSuccess(userData)
    } catch (error) {
      setLoginError("An error occurred during login. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-accent/10 rounded-full">
              <BookOpen className="h-8 w-8 text-accent" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Online Test Platform</h1>
          <p className="text-muted-foreground">Professional Web Designing Assessment</p>
        </div>

        {/* Test Information */}
        <Card className="border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Test Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-accent" />
              <span>Duration: 25 minutes</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <BookOpen className="h-4 w-4 text-accent" />
              <span>Questions: 30 (randomly selected)</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Users className="h-4 w-4 text-accent" />
              <span>Authorized users only</span>
            </div>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Login to Start Test</CardTitle>
            <CardDescription>Enter your credentials to begin the assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{ name: "", email: "", password: "" }}
              validationSchema={loginValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      className={errors.name && touched.name ? "border-destructive" : ""}
                    />
                    <ErrorMessage name="name" component="p" className="text-sm text-destructive" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      className={errors.email && touched.email ? "border-destructive" : ""}
                    />
                    <ErrorMessage name="email" component="p" className="text-sm text-destructive" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      className={errors.password && touched.password ? "border-destructive" : ""}
                    />
                    <ErrorMessage name="password" component="p" className="text-sm text-destructive" />
                                         <p className="text-sm text-muted-foreground">
                Use password: <code className="bg-gray-200 px-1 rounded">password123</code>
              </p>
                  </div>

                  {loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Start Test"}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Important Notice</p>
                <p className="text-xs text-muted-foreground">
                  You can only take this test once. Make sure you have a stable internet connection and sufficient time
                  to complete the assessment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
