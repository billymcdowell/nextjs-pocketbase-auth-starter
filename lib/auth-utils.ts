import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { makeRequest } from '@/lib/pocketbase';

const AUTH_COLLECTION = process.env.AUTH_COLLECTION || 'users';

// Helper function to get auth token from cookies
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('pb_auth')?.value || null;
}

// Helper function to validate JWT token
export function validateJWT(token: string): { valid: boolean; payload?: any; error?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid token format' };
    }

    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < currentTime) {
      return { valid: false, error: 'Token expired' };
    }

    return { valid: true, payload };
  } catch (error) {
    return { valid: false, error: 'Invalid token' };
  }
}

// Function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  
  if (!token) {
    return false;
  }

  const validation = validateJWT(token);
  if (!validation.valid) {
    return false;
  }

  // Optionally verify with Pocketbase (for more security)
  try {
    await makeRequest(`${AUTH_COLLECTION}/auth-refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return true;
  } catch {
    return false;
  }
}

// Function to get current user data
export async function getCurrentUser(): Promise<{ success: boolean; data?: any; error?: string }> {
  const token = await getAuthToken();
  
  if (!token) {
    return {
      success: false,
      error: 'Not authenticated',
    };
  }

  const validation = validateJWT(token);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error || 'Invalid token',
    };
  }

  return {
    success: true,
    data: validation.payload,
  };
}

// Function to require authentication (redirects if not authenticated)
export async function requireAuth(redirectTo: string = '/auth/signin'): Promise<any> {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect(redirectTo);
  }
  
  return await getCurrentUser();
}

// Function to refresh authentication token
export async function refreshAuthToken(): Promise<{ success: boolean; error?: string }> {
  const token = await getAuthToken();
  
  if (!token) {
    return { success: false, error: 'No token found' };
  }

  try {
    const data = await makeRequest(`${AUTH_COLLECTION}/auth-refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Update the cookie with the new token
    const cookieStore = await cookies();
    cookieStore.set('pb_auth', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Token refresh failed',
    };
  }
} 