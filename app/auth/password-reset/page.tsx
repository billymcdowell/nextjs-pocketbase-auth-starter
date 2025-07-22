import ResetPasswordForm from '@/components/forms/auth/PasswordResetForm'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <ResetPasswordForm />
        <div className="text-center">
          <Link href="/auth/signin" className="font-medium hover:text-primary underline transition-colors">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
} 