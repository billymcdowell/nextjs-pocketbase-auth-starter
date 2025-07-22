'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { requestVerificationAction, confirmVerificationAction } from '@/actions/auth'

interface VerifyEmailFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  redirectTo?: string
  email?: string
}

const initialState = {
  success: false,
  error: '',
  message: ''
}

function RequestVerificationButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Sending verification email...' : 'Send verification email'}
    </button>
  )
}

function ConfirmVerificationButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Verifying...' : 'Verify Email'}
    </button>
  )
}

export default function VerifyEmailForm({ onSuccess, onError, email: initialEmail }: VerifyEmailFormProps) {
  const [step, setStep] = useState<'request' | 'confirm'>('request')
  const [requestState, requestAction] = useActionState(requestVerificationAction, initialState)
  const [confirmState, confirmAction] = useActionState(confirmVerificationAction, initialState)

  // Handle success/error callbacks
  if (requestState.success && step === 'request') {
    setStep('confirm')
  }
  
  if (confirmState.success && onSuccess) {
    onSuccess()
  }
  
  if (requestState.error && onError) {
    onError(requestState.error)
  }
  
  if (confirmState.error && onError) {
    onError(confirmState.error)
  }

  if (step === 'confirm') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Verify Email</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the verification token from your email
          </p>
        </div>

        {requestState.message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {requestState.message}
          </div>
        )}

        <form action={confirmAction} className="space-y-6">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700">
              Verification Token
            </label>
            <input
              id="token"
              name="token"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter the verification token"
            />
          </div>

          {confirmState.error && (
            <div className="text-red-600 text-sm">
              {confirmState.error}
            </div>
          )}

          {confirmState.message && (
            <div className="text-green-600 text-sm">
              {confirmState.message}
            </div>
          )}

          <ConfirmVerificationButton />

          <button
            type="button"
            onClick={() => setStep('request')}
            className="w-full text-sm text-indigo-600 hover:text-indigo-500"
          >
            Back to request verification
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Verify Email</h2>
        <p className="text-sm text-gray-600">
          Didn&apos;t receive the email? Check your spam folder or try again.
        </p>
      </div>

      <form action={requestAction} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={initialEmail}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your email"
          />
        </div>

        {requestState.error && (
          <div className="text-red-600 text-sm">
            {requestState.error}
          </div>
        )}

        {requestState.message && (
          <div className="text-green-600 text-sm">
            {requestState.message}
          </div>
        )}

        <RequestVerificationButton />
      </form>
    </div>
  )
} 