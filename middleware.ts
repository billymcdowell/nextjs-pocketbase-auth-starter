import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie, getCurrentUser } from "@/actions/auth";
import { refreshAuthToken } from "@/lib/auth-utils";

// Configuration constants
const ROUTES = {
  PROTECTED: ['/dashboard', '/profile'] as const,
  AUTH: [
    '/auth/signin',
    '/auth/signup', 
    '/auth/otp-login',
    '/auth/forgot-password',
    '/auth/verify-otp',
    '/auth/confirm-password-reset'
  ] as const,
  DEFAULT_REDIRECT: '/dashboard',
  LOGIN: '/auth/signin'
} as const;

// Response headers for security
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
} as const;

/**
 * Creates a secure redirect response with security headers
 */
function createSecureRedirect(url: string, request: NextRequest): NextResponse {
  const response = NextResponse.redirect(new URL(url, request.url));
  
  // Add security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

/**
 * Creates a Next response with security headers
 */
function createSecureNext(): NextResponse {
  const response = NextResponse.next();
  
  // Add security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

/**
 * Checks if the current path matches any of the given routes
 */
function isRouteMatch(pathname: string, routes: readonly string[]): boolean {
  return routes.some(route => pathname.startsWith(route));
}

/**
 * Handles authentication errors by clearing cookies and redirecting
 */
async function handleAuthError(request: NextRequest, pathname: string): Promise<NextResponse> {
  try {
    await clearAuthCookie();
  } catch (error) {
    // Log error in production monitoring system
    if (process.env.NODE_ENV === 'production') {
      console.error('Failed to clear auth cookie:', error);
    }
  }
  
  const loginUrl = new URL(ROUTES.LOGIN, request.url);
  loginUrl.searchParams.set('callbackUrl', pathname);
  return createSecureRedirect(loginUrl.toString(), request);
}

/**
 * Validates user authentication and handles token refresh
 */
async function validateAuth(): Promise<{ isValid: boolean; error?: string }> {
  try {
    const authState = await refreshAuthToken();
    
    if (!authState.success) {
      return { isValid: false, error: authState.error };
    }
    
    return { isValid: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Authentication validation failed';
    
    // Log error for monitoring in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Auth validation error:', errorMessage);
    }
    
    return { isValid: false, error: errorMessage };
  }
}

/**
 * Validates user session by checking current user
 */
async function validateUserSession(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user.success;
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('User session validation error:', error);
    }
    return false;
  }
}

export default async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  
  // Skip processing for health checks and monitoring endpoints
  if (pathname === '/health' || pathname === '/api/health') {
    return createSecureNext();
  }
  
  try {
    // Validate authentication
    const authValidation = await validateAuth();
    const isAuthenticated = authValidation.isValid;
    
    // Check route types
    const isProtectedRoute = isRouteMatch(pathname, ROUTES.PROTECTED);
    const isAuthRoute = isRouteMatch(pathname, ROUTES.AUTH);
    
    // Handle protected routes without authentication
    if (isProtectedRoute && !isAuthenticated) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Redirecting unauthenticated user from protected route: ${pathname}`);
      }
      
      return handleAuthError(request, pathname);
    }
    
    // Handle auth routes with valid authentication
    if (isAuthRoute && isAuthenticated) {
      // Validate the user session to ensure token is still valid
      const hasValidSession = await validateUserSession();
      
      if (hasValidSession) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Redirecting authenticated user away from auth route: ${pathname}`);
        }
        
        return createSecureRedirect(ROUTES.DEFAULT_REDIRECT, request);
      } else {
        // Session is invalid, clear cookie and allow access to auth routes
        try {
          await clearAuthCookie();
        } catch (error) {
          if (process.env.NODE_ENV === 'production') {
            console.error('Failed to clear invalid auth cookie:', error);
          }
        }
      }
    }
    
    // Continue with request for all other cases
    return createSecureNext();
    
  } catch (error) {
    // Handle unexpected errors gracefully
    const errorMessage = error instanceof Error ? error.message : 'Unknown middleware error';
    
    if (process.env.NODE_ENV === 'production') {
      console.error('Middleware error:', errorMessage);
      
      // In production, you might want to send this to your monitoring service
      // Example: await sendToMonitoring({ error: errorMessage, pathname, timestamp: new Date() });
    }
    
    // For protected routes with errors, redirect to login for safety
    if (isRouteMatch(pathname, ROUTES.PROTECTED)) {
      return handleAuthError(request, pathname);
    }
    
    // For other routes, allow the request to continue
    return createSecureNext();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - health check endpoints
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|health).*)',
  ],
};