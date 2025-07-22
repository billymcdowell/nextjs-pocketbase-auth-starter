import VerifyOTPForm from '@/components/forms/auth/VerifyOTPForm'
import Link from 'next/link'

export default function VerifyOtpPage({ searchParams }: { searchParams: { otpId: string } }) {
  const otpId = searchParams.otpId

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <VerifyOTPForm otpId={otpId} />
        <div className="text-center">
          <Link href="/auth/signin" className="text-sm text-muted-foreground hover:text-primary underline transition-colors">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}