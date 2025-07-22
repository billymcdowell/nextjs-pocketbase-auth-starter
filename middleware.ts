import { NextRequest, NextResponse } from "next/server";
import { authRefresh } from "@/actions/auth";
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Get the auth token from cookies
  const cookieStore = await cookies();
  const authToken = cookieStore.get('pb_auth')?.value;
  
  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile'];
  const authRoutes = ['/auth/signin', '/auth/signup', '/auth/otp-login', '/auth/forgot-password'];
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if(isProtectedRoute) {
    await authRefresh();
  }

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If we have an auth token, check if it needs refreshing
  if (authToken) {
    try {
      // Parse JWT to check expiration
      const payload = JSON.parse(atob(authToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = payload.exp - currentTime;
      
      // If token expires in less than 5 minutes, try to refresh it
      if (timeUntilExpiry < 300 && timeUntilExpiry > 0) {
        const newToken = await refreshAuthToken(authToken);
        if (newToken) {
          // Create response with new token
          const response = NextResponse.next();
          response.cookies.set('pb_auth', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });
          return response;
        }
      }
      
      // If token is expired, clear it
      if (timeUntilExpiry <= 0) {
        const response = NextResponse.next();
        response.cookies.delete('pb_auth');
        
        // If accessing protected route, redirect to login
        if (isProtectedRoute) {
          const loginUrl = new URL('/auth/signin', req.url);
          loginUrl.searchParams.set('callbackUrl', pathname);
          return NextResponse.redirect(loginUrl);
        }
        
        return response;
      }
    } catch (error) {
      // Invalid token, clear it
      const response = NextResponse.next();
      response.cookies.delete('pb_auth');
      
      if (isProtectedRoute) {
        const loginUrl = new URL('/auth/signin', req.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      return response;
    }
  }

  // If accessing a protected route without authentication
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL('/auth/signin', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing auth routes while already authenticated
  if (isAuthRoute && authToken) {
    // Try to validate the token by checking if it's expired
    try {
      // Basic JWT expiration check (you can enhance this)
      const payload = JSON.parse(atob(authToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp > currentTime) {
        // Token is still valid, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    } catch (error) {
      // Invalid token, clear it and allow access to auth routes
      const response = NextResponse.next();
      response.cookies.delete('pb_auth');
      return response;
    }
  }

  // For all other cases, continue with the request
  return NextResponse.next();
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

// ... existing code ...