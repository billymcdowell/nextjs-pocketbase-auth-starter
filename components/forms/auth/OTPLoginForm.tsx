'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { requestOTPAction } from '@/actions/auth'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

const initialState = {
  success: false,
  error: '',
  message: ''
}

export default function OTPLoginForm() {
  const [email, setEmail] = useState('')
  const { refreshAuth } = useAuth()
  const [state, requestAction, isPending] = useActionState(requestOTPAction, initialState)

  if (state.success) {
    refreshAuth();
    redirect(`/auth/verify-otp?otpId=${state.values?.otpId}`) 
  }

  if (state.error) {

  }

  return (
    <div className="w-full max-w-md mx-auto">

      <form action={requestAction} className="space-y-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="block text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="Enter your email"
          />
        </div>

        {state.error && (
          <div className="text-red-600 text-sm">
            {state.error}
          </div>
        )}

        {state.message && (
          <div className="text-green-600 text-sm">
            {state.message}
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full"
        >
          {isPending ? 'Sending OTP...' : 'Send OTP'}
        </Button>
      </form>
    </div>
  )
} 