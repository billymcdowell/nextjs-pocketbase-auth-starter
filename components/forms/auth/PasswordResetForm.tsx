'use client'

import { useActionState } from 'react'
import { requestPasswordResetAction } from '@/actions/auth'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const initialState = {
  success: false,
  error: '',
  message: ''
}

export default function PasswordResetForm() {
  const [state, requestAction, isPending] = useActionState(requestPasswordResetAction, initialState)

  return (
    <div className="w-full mx-auto">
      <form action={requestAction} className="space-y-6">
        <div className="grid gap-3">
          <Label htmlFor="email" className="block text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
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
          {isPending ? 'Sending reset email...' : 'Send reset email'}
        </Button>
      </form>
    </div>
  )
} 