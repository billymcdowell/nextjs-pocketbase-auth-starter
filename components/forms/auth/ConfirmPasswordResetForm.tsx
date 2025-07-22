'use client'

import { useActionState } from 'react'
import { confirmPasswordResetAction } from '@/actions/auth'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'

const initialState = {
    success: false,
    error: '',
    message: ''
}

export default function ConfirmPasswordResetForm({ token }: { token: string }) {
    const [state, requestAction, isPending] = useActionState(confirmPasswordResetAction, initialState)

    if(state.success) {
        setTimeout(() => {
            redirect('/auth/signin')
        }, 2000)
    }

    return (
        <div className="w-full mx-auto">
            <form action={requestAction} className="space-y-6">
                <input type="hidden" name="token" value={token} />

                <div className="grid gap-3">
                    <Label htmlFor="password" className="block text-sm font-medium">
                        Password
                    </Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="Enter your new password"
                    />
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="passwordConfirm" className="block text-sm font-medium">
                        Confirm Password
                    </Label>
                    <Input
                        id="passwordConfirm"
                        name="passwordConfirm"
                        type="password"
                        required
                        placeholder="Confirm your new password"
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
                    {isPending ? 'Setting new password...' : 'Set new password'}
                </Button>
            </form>
        </div>
    )
} 