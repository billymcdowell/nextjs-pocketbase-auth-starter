'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { makeRequest, makeRequestWithAuth    } from '@/lib/pocketbase'

// Types
interface AuthResponse {
    token: string
    record: {
        id: string
        email: string
        verified: boolean
        [key: string]: any
    }
}

interface AuthResult {
    success: boolean
    data?: AuthResponse
    error?: string
}

interface FormState {
    success?: boolean
    error?: string
    message?: string
    values?: {
        email?: string
        password?: string
        passwordConfirm?: string
        otpId?: string
    }
}

// Base PocketBase configuration
const AUTH_COLLECTION = process.env.AUTH_COLLECTION || 'users'

// Helper function to get auth token from cookies
export async function getAuthToken(): Promise<any | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get('pb_auth')?.value || null
    console.log("token", token)
    if (token) {
        const parsedToken = JSON.parse(token)
        return parsedToken.token
    }
    return null
}

// Helper function to set auth cookie
export async function setAuthCookie(token: string) {
    const cookieStore = await cookies()
    cookieStore.set('pb_auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    })
}

// Helper function to clear auth cookie
export async function clearAuthCookie() {
    const cookieStore = await cookies()
    cookieStore.delete('pb_auth')
}

/**
 * Form action for login with email and password
 */
export async function loginAction(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        if (!email || !password) {
            return {
                success: false,
                error: 'Email and password are required'
            }
        }

        const data = await makeRequest(`${AUTH_COLLECTION}/auth-with-password`, {
            method: 'POST',
            body: JSON.stringify({
                identity: email,
                password: password,
            }),
        })

        console.log(JSON.stringify(data, null, 2))
        await setAuthCookie(JSON.stringify(data))
        return {
            success: true,
            message: 'Login successful'
        }

    } catch (error: any) {
        // Check if this is a redirect error (Next.js special error)
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error // Re-throw redirect errors so Next.js can handle them
        }

        console.log("error in action", JSON.stringify(error, null, 2))

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Authentication failed',
        }
    }
    return {
        success: false,
        error: 'Authentication failed',
    }
}

/**
 * Form action for user registration
 */
export async function signupAction(prevState: FormState, formData: FormData): Promise<FormState> {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const passwordConfirm = formData.get('passwordConfirm') as string
    try {

        if (!email || !password || !passwordConfirm) {
            return {
                success: false,
                error: 'All fields are required',
                values: {
                    email: email,
                    password: password,
                    passwordConfirm: passwordConfirm,
                }
            }
        }

        if (password !== passwordConfirm) {
            return {
                success: false,
                error: 'Passwords do not match',
                values: {
                    email: email,
                    password: password,
                    passwordConfirm: passwordConfirm,
                }
            }
        }

        if (password.length < 8) {
            return {
                success: false,
                error: 'Password must be at least 8 characters long',
                values: {
                    email: email,
                    password: password,
                    passwordConfirm: passwordConfirm,
                }
            }
        }

        const data = await makeRequest(`${AUTH_COLLECTION}/records`, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                emailVisibility: true,
                password: password,
                passwordConfirm: passwordConfirm,
            }),
        })
        console.log(JSON.stringify(data, null, 2))
        if (data.status == 200) {
            console.log(JSON.stringify(data, null, 2))
            return {
                success: true,
                message: 'Account created successfully! Please check your email for verification.'
            }
        } else {
            return {
                success: false,
                error: data.message,
                values: {
                    email: email,
                    password: password,
                    passwordConfirm: passwordConfirm,
                }
            }
        }
    } catch (error: any) {
        console.log(JSON.stringify(error, null, 2))
        return {
            success: false,
            error: error?.message || error?.data?.message || 'Registration failed',
            values: {
                email: email,
                password: password,
                passwordConfirm: passwordConfirm,
            }
        }
    }
}

/**
 * Form action for requesting password reset
 */
export async function requestPasswordResetAction(prevState: FormState, formData: FormData): Promise<FormState> {
    const email = formData.get('email') as string

    if (!email) {
        return {
            success: false,
            error: 'Email is required'
        }
    }

    await makeRequest(`${AUTH_COLLECTION}/request-password-reset`, {
        method: 'POST',
        body: JSON.stringify({
            email: email,
        }),
    });

    return {
        success: true,
        message: 'Password reset email sent! Please check your inbox.'
    };
}

/**
 * Form action for confirming password reset
 */
export async function confirmPasswordResetAction(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const token = formData.get('token') as string
        const password = formData.get('password') as string
        const passwordConfirm = formData.get('passwordConfirm') as string

        if (!token || !password || !passwordConfirm) {
            return {
                success: false,
                error: 'All fields are required'
            }
        }

        if (password !== passwordConfirm) {
            return {
                success: false,
                error: 'Passwords do not match'
            }
        }

        if (password.length < 8) {
            return {
                success: false,
                error: 'Password must be at least 8 characters long'
            }
        }

        await makeRequest(`${AUTH_COLLECTION}/confirm-password-reset`, {
            method: 'POST',
            body: JSON.stringify({
                token: token,
                password: password,
                passwordConfirm: passwordConfirm,
            }),
        })

        return {
            success: true,
            message: 'Password reset successfully! You can now sign in with your new password.'
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Password reset confirmation failed',
        }
    }
}

/**
 * Form action for requesting email verification
 */
export async function requestVerificationAction(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const email = formData.get('email') as string

        if (!email) {
            return {
                success: false,
                error: 'Email is required'
            }
        }

        const data = await makeRequest(`${AUTH_COLLECTION}/request-verification`, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
            }),
        })

        console.log(JSON.stringify(data, null, 2))

        if (data.status == 200) {
            return {
                success: true,
                message: 'Verification email sent! Please check your inbox.'
            }
        } else {
            return {
                success: false,
                error: data.message,
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Verification request failed',
        }
    }
}

/**
 * Form action for confirming email verification
 */
export async function confirmVerificationAction(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const token = formData.get('token') as string

        if (!token) {
            return {
                success: false,
                error: 'Verification token is required'
            }
        }

        await makeRequest(`${AUTH_COLLECTION}/confirm-verification`, {
            method: 'POST',
            body: JSON.stringify({
                token: token,
            }),
        })

        return {
            success: true,
            message: 'Email verified successfully! You can now sign in.'
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Email verification failed',
        }
    }
}

/**
 * Form action for requesting OTP
 */
export async function requestOTPAction(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const email = formData.get('email') as string

        if (!email) {
            return {
                success: false,
                error: 'Email is required'
            }
        }

        const data = await makeRequest(`${AUTH_COLLECTION}/request-otp`, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
            }),
        })

        if (data.status == 200) {
            return {
                success: true,
                message: 'OTP sent to your email! Please check your inbox.',
                values: {
                    otpId: data.otpId,
                }
            }
        } else {
            return {
                success: false,
                error: data.message,
            }
        }


    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send OTP',
        }
    }
}

/**
 * Form action for OTP authentication
 */
export async function otpAuthAction(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const email = formData.get('email') as string
        const otp = formData.get('otp') as string

        if (!email || !otp) {
            return {
                success: false,
                error: 'Email and OTP are required'
            }
        }

        if (otp.length !== 6) {
            return {
                success: false,
                error: 'Please enter a 6-digit OTP'
            }
        }

        const data = await makeRequest(`${AUTH_COLLECTION}/auth-with-otp`, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                otp: otp,
            }),
        })

        await setAuthCookie(JSON.stringify(data))

        // Use redirect() which will throw a special error that Next.js handles
        redirect('/dashboard')
    } catch (error: any) {
        // Check if this is a redirect error (Next.js special error)
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error // Re-throw redirect errors so Next.js can handle them
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'OTP authentication failed',
        }
    }
}

/**
 * Form action for OTP verification
 */
export async function verifyOTPAction(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const otp = formData.get('otp') as string
        const otpId = formData.get('otpId') as string
        
        console.log("otp", otp)
        console.log("otpId", otpId)

        if (!otp || !otpId) {
            return {
                success: false,
                error: 'OTP is required'
            }
        }

        if (otp.length !== 8) {
            return {
                success: false,
                error: 'Please enter a 8-digit OTP'
            }
        }

        const data = await makeRequest(`${AUTH_COLLECTION}/auth-with-otp`, {
            method: 'POST',
            body: JSON.stringify({
                password: otp,
                otpId: otpId,
            }),
        })

        if (data.status == 200) {
            console.log(JSON.stringify(data, null, 2))
            await setAuthCookie(JSON.stringify(data))
            return {
                success: true,
                message: 'OTP verified successfully!'
            }
        } else {
            return {
                success: false,
                error: data.message,
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'OTP verification failed',
        }
    }
}

/**
 * Authenticate with email and password
 */
export async function authWithPassword(email: string, password: string): Promise<AuthResult> {
    try {
        const data = await makeRequest(`${AUTH_COLLECTION}/auth-with-password`, {
            method: 'POST',
            body: JSON.stringify({
                identity: email,
                password: password,
            }),
        })

        await setAuthCookie(JSON.stringify(data))

        return {
            success: true,
            data: data,
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Authentication failed',
        }
    }
}

/**
 * Request OTP for authentication
 */
export async function requestOTP(email: string): Promise<{ success: boolean; error?: string }> {
    try {
        await makeRequest(`${AUTH_COLLECTION}/request-otp`, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
            }),
        })

        return { success: true }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send OTP',
        }
    }
}

/**
 * Authenticate with OTP
 */
export async function authWithOTP(email: string, otp: string): Promise<AuthResult> {
    try {
        const data = await makeRequest(`${AUTH_COLLECTION}/auth-with-otp`, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                otp: otp,
            }),
        })

        await setAuthCookie(JSON.stringify(data))

        return {
            success: true,
            data: data,
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'OTP authentication failed',
        }
    }
}

/**
 * Verify OTP for various purposes
 */
export async function verifyOTP(email: string, otp: string, purpose: 'login' | 'verification' | 'reset' = 'verification'): Promise<{ success: boolean; error?: string }> {
    try {
        const endpoint = purpose === 'login'
            ? `${AUTH_COLLECTION}/auth-with-otp`
            : `${AUTH_COLLECTION}/verify-otp`

        await makeRequest(endpoint, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                otp: otp,
            }),
        })

        return { success: true }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'OTP verification failed',
        }
    }
}

/**
 * Refresh authentication token
 */
export async function authRefresh(): Promise<AuthResult> {
    try {
        const token = await getAuthToken()

        if (!token) {
            throw new Error('No authentication token found')
        }

        const data = await makeRequest(`${AUTH_COLLECTION}/auth-refresh`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        await setAuthCookie(JSON.stringify(data))

        return {
            success: true,
            data: data,
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Token refresh failed',
        }
    }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    try {
        await makeRequest(`${AUTH_COLLECTION}/request-password-reset`, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
            }),
        })

        return { success: true }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Password reset request failed',
        }
    }
}

/**
 * Confirm password reset
 */
export async function confirmPasswordReset(
    token: string,
    password: string,
    passwordConfirm: string
): Promise<{ success: boolean; error?: string, message?: string }> {
    try {
        const data = await makeRequest(`${AUTH_COLLECTION}/confirm-password-reset`, {
            method: 'POST',
            body: JSON.stringify({
                token: token,
                password: password,
                passwordConfirm: passwordConfirm,
            }),
        })

        if (data.status == 200) {
            return {
                success: true,
                message: 'Password reset successfully! You can now sign in with your new password.'
            }
        } else {
            return {
                success: false,
                error: data.message,
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Password reset confirmation failed',
        }
    }
}

/**
 * Request email verification
 */
export async function requestVerification(email: string): Promise<{ success: boolean; error?: string }> {
    try {
        await makeRequest(`${AUTH_COLLECTION}/request-verification`, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
            }),
        })

        return { success: true }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Verification request failed',
        }
    }
}

/**
 * Confirm email verification
 */
export async function confirmVerification(token: string): Promise<{ success: boolean; error?: string }> {
    try {
        await makeRequest(`${AUTH_COLLECTION}/confirm-verification`, {
            method: 'POST',
            body: JSON.stringify({
                token: token,
            }),
        })

        return { success: true }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Email verification failed',
        }
    }
}

/**
 * Request email change
 */
export async function requestEmailChange(newEmail: string): Promise<{ success: boolean; error?: string }> {
    try {
        const token = await getAuthToken()

        if (!token) {
            throw new Error('Authentication required')
        }

        await makeRequest(`${AUTH_COLLECTION}/request-email-change`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                newEmail: newEmail,
            }),
        })

        return { success: true }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Email change request failed',
        }
    }
}

/**
 * Confirm email change
 */
export async function confirmEmailChange(token: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
        const authToken = await getAuthToken()

        if (!authToken) {
            throw new Error('Authentication required')
        }

        await makeRequest(`${AUTH_COLLECTION}/confirm-email-change`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                token: token,
                password: password,
            }),
        })

        return { success: true }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Email change confirmation failed',
        }
    }
}

/**
 * List external OAuth2 providers
 */
export async function listAuthMethods(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        const data = await makeRequest(`${AUTH_COLLECTION}/auth-methods`, {
            method: 'GET',
        })

        return {
            success: true,
            data: data,
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch auth methods',
        }
    }
}

/**
 * Log out user
 */
export async function logout(): Promise<void> {
    await clearAuthCookie()
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        const token = await getAuthToken()

        if (!token) {
            return {
                success: false,
                error: 'Not authenticated',
            }
        }

        const cookieStore = await cookies()
        const user = cookieStore.get('pb_auth')?.value || null
        console.log("user", user)
        if (user) {
            return {
                success: true,
                data: JSON.parse(user).record,
            }
        } else {
            return {
                success: false,
                error: 'Not authenticated',
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get current user',
        }
    }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const token = await getAuthToken()

    if (!token) {
        return false
    }

    try {
        // Try to refresh token to verify it's still valid
        const result = await authRefresh()
        return result.success
    } catch {
        return false
    }
}


/**
 * Wrapper for actions that require authentication
 */
export async function requireAuth<T>(
    action: () => Promise<T>,
    redirectTo: string = '/login'
): Promise<T> {
    const authenticated = await isAuthenticated()

    if (!authenticated) {
        redirect(redirectTo)
    }

    return await action()
}

/**
 * Server action to update the current user's profile
 */
export async function updateProfile(prevState: any, formData: FormData): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }
    const userId = formData.get('userId') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    await makeRequestWithAuth(`/collections/${AUTH_COLLECTION}/records/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ name, email }),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update profile' };
  }
}