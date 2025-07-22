'use client'

import { useActionState } from 'react'
import { signupAction } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const initialState = {
  success: false,
  error: '',
  message: '',
  values: {
    email: '',
    password: '',
    passwordConfirm: '',
  }
}

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(signupAction, initialState)

  // Handle success/error callbacks
  if (state.success) {
    redirect('/auth/signin')
  }

  return (
      <div className="w-full mx-auto">
      <form action={formAction} className="space-y-6">

        <div className="grid gap-3">
          <Label htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            defaultValue={state.values?.email}
            type="email"
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            defaultValue={state.values?.password}
            type="password"
            required
            placeholder="Enter your password"
          />
        </div>

        <div className="grid gap-3" >
          <Label htmlFor="passwordConfirm">
            Confirm Password
          </Label>
          <Input
            id="passwordConfirm"
            name="passwordConfirm"
            defaultValue={state.values?.passwordConfirm}
            type="password"
            required
            placeholder="Confirm your password"
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
          {isPending ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </div>
  )
} 