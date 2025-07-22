import OTPLoginForm from '@/components/forms/auth/OTPLoginForm'
import Link from 'next/link'

export default function OtpLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Sign in with OTP
          </h2>
          <p className="mt-2 text-center text-sm">
            Enter your email to receive a one-time password
          </p>
        </div>
        <OTPLoginForm />
        <div className="text-center">
            <Link href="/auth/signin" className="text-sm text-muted-foreground hover:text-primary underline transition-colors">
            Sign in with password instead
          </Link>
        </div>
      </div>
    </div>
  )
}