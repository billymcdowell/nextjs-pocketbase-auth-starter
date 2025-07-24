import LoginForm from '@/components/forms/auth/login-form'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SigninPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{' '}
            <Link href="/auth/signup" className="font-medium hover:text-primary underline transition-colors">
              create a new account
            </Link>
          </p>
        </div>
        <LoginForm />
        <div className="text-center">
          <Link href="/auth/password-reset" className="text-sm text-muted-foreground hover:text-primary underline transition-colors">
            Forgot your password?
          </Link>
        </div>
        <Separator/>
        <Button asChild className="w-full" variant="outline">
          <Link href="/auth/otp-login">
            Login with OTP
          </Link>
        </Button>
      </div>
    </div>
  )
}