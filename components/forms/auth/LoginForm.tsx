'use client'

import { useActionState } from 'react'
import { loginAction } from '@/actions/auth'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/AuthProvider'

const initialState = {
  success: false,
  error: '',
  message: ''
}

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)
  const router = useRouter()
  const { refreshAuth } = useAuth()
  console.log("state in form", JSON.stringify(state, null, 2))
  // Handle success/error callbacks
  if (state.success) {
    refreshAuth();
    router.push('/dashboard')
  }

  if (state.error) {
    console.log(JSON.stringify(state, null, 2))
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
            type="password"
            required
            placeholder="Enter your password"
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

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
} 