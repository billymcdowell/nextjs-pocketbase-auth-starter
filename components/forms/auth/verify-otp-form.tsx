'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { verifyOTPAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

const initialState = {
  success: false,
  error: '',
  message: ''
}

export default function VerifyOTPForm({ otpId }: { otpId: string }) {
  const [otp, setOtp] = useState('')

  const [state, verifyAction, isPending] = useActionState(verifyOTPAction, initialState)

  // Handle success/error callbacks
  if (state.success) {
    redirect('/dashboard')
  }

  if (state.error) {
    console.error(state.error)
  }


  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Verify OTP</h2>
        <p className="mt-2 text-sm">
          Enter the one-time password sent to your email
        </p>
      </div>

      {state.message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {state.message}
        </div>
      )}

      <form action={verifyAction} className="space-y-6">
        <input type="hidden" name="otpId" value={otpId} />
        <input type="hidden" name="otp" value={otp} />
        <div className="flex flex-col gap-2">
          <Label className="block text-sm font-medium">
            Enter 8-digit code:
          </Label>
          <div className="flex flex-col gap-2">
            <InputOTP maxLength={8} value={otp} onChange={setOtp} autoFocus>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
                <InputOTPSlot index={6} />
                <InputOTPSlot index={7} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        {state.error && (
          <div className="text-red-600 text-sm">
            {state.error}
          </div>
        )}
        

        <Button
          type="submit"
          disabled={isPending}
          className="w-full"
        >
          {isPending ? 'Verifying...' : 'Verify OTP'}
        </Button>

        <div className="text-center">
          <Button
            type="button"
            variant="link"
            onClick={() => { console.log('resend') }}
          >
            Didn&apos;t receive the code? Request a new one.
          </Button>
        </div>
      </form>
    </div>
  )
} 