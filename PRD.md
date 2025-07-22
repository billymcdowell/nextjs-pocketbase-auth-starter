# Product Requirements Document: Next.js + Pocketbase Starter Project

## 1. Project Overview

### 1.1 Purpose
Create a starter template that integrates Next.js with Pocketbase as the backend database using only REST API calls (no SDK dependencies).

### 1.2 Target Audience
- Full-stack developers building modern web applications
- Teams wanting a lightweight, self-hosted backend solution
- Developers seeking a minimal authentication setup without vendor lock-in

### 1.3 Success Metrics
- Complete authentication flow implementation
- Functional CRUD operations via Pocketbase REST API
- Clear documentation and setup instructions
- Deployable to common hosting platforms

## 2. Technical Requirements

### 2.1 Core Stack
- **Frontend**: Next.js 15.3.5 (App Router)
- **Backend**: Pocketbase v0.28.4 (REST API only)
- **Language**: TypeScript
- **Styling**: Tailwind CSS

### 2.2 Authentication Features
- Email/password authentication
- OTP (One-Time Password) via email authentication
- Passwordless authentication flow
- JWT token management
- Session persistence
- Protected routes middleware
- User profile management
- Password reset functionality
- Forgot password flow

### 2.3 Pocketbase Integration
- User collection management
- CRUD operations via REST API
- File upload handling
- Real-time subscriptions (optional)
- Admin panel integration

### 2.4 API Layer
- Custom API routes for Pocketbase communication
- Type-safe API client
- Error handling and validation
- Request/response interceptors

## 3. Functional Requirements

### 3.1 Authentication Flow
1. **Sign Up**
   - Email/password registration
   - Email verification
   - User profile creation in Pocketbase

2. **Sign In**
   - Email/password login
   - Email-based OTP authentication
   - Passwordless login with magic links
   - Remember me functionality
   - Redirect to intended page after login

3. **Password Management**
   - Forgot password functionality
   - Password reset via email with secure tokens
   - Password strength validation
   - Password change from profile

4. **OTP Authentication**
   - Email-based OTP generation and verification
   - OTP expiration and retry logic
   - Rate limiting for OTP requests

5. **Session Management**
   - JWT token refresh
   - Automatic logout on token expiry
   - Cross-tab session synchronization

4. **Protected Routes**
   - Middleware-based route protection
   - Role-based access control
   - Redirect unauthenticated users

### 3.2 User Management
1. **Profile Management**
   - View/edit user profile
   - Update personal information (name, email, phone)
   - Avatar upload and management
   - Account preferences
   - Account deletion with confirmation

2. **Password Management**
   - Change password with current password verification
   - Forgot password flow with email tokens
   - Password reset via secure email links
   - Password strength requirements
   - Password history prevention

3. **Profile Update Features**
   - Real-time profile validation
   - Profile picture crop and resize
   - Multi-field profile updates
   - Profile completion indicators
   - Data export functionality

### 3.3 Data Operations
1. **CRUD Operations**
   - Create, read, update, delete records
   - Pagination support
   - Search and filtering
   - Sorting capabilities

2. **File Management**
   - Upload files to Pocketbase
   - Display uploaded files
   - File deletion

## 4. Technical Architecture

### 4.1 Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   ├── send-otp/
│   │   │   └── verify-otp/
│   │   └── pocketbase/
│   │       ├── profile/
│   │       └── users/
│   ├── dashboard/
│   ├── auth/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   ├── otp-login/
│   │   └── verify-otp/
│   ├── profile/
│   └── globals.css
├── components/
│   ├── auth/
│   │   ├── ForgotPasswordForm.tsx
│   │   ├── ResetPasswordForm.tsx
│   │   ├── OTPLoginForm.tsx
│   │   └── VerifyOTPForm.tsx
│   ├── profile/
│   │   ├── ProfileForm.tsx
│   │   ├── PasswordChangeForm.tsx
│   │   └── AvatarUpload.tsx
│   ├── ui/
│   └── forms/
├── lib/
│   ├── auth.ts
│   ├── pocketbase.ts
│   ├── otp.ts
│   ├── email.ts
│   └── types.ts
├── middleware.ts
└── types/
```

### 4.2 Configuration Files
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `.env.local` - Environment variables
- `package.json` - Dependencies and scripts

### 4.3 Environment Variables
```
POCKETBASE_URL=http://localhost:8090

# Email service for OTP and password reset
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourapp.com
# Security
OTP_EXPIRY_MINUTES=10
PASSWORD_RESET_EXPIRY_HOURS=24
MAX_OTP_ATTEMPTS=3
```

## 5. Implementation Details

### 5.2 Pocketbase REST API Client
- Typed API client functions
- Authentication header management
- Error handling and retries
- Request/response transformations
- Profile update operations
- Password reset token management
- OTP generation and verification endpoints
- File upload for profile pictures
- User data validation and sanitization

### 5.3 Middleware Implementation
- Route protection logic
- Authentication state checking
- Redirect handling
- API route protection

## 6. User Interface Requirements

### 6.1 Authentication Pages
- Sign-in page with email/password and email OTP options
- Sign-up page with form validation
- Forgot password page with email input
- Password reset page with token validation
- Email OTP login page
- OTP verification page with code input
- Email verification page

### 6.2 Dashboard
- User profile display with edit capabilities
- Profile completion indicators
- Navigation menu
- Protected content areas
- Recent activity display
- Account settings panel
- Logout functionality

### 6.3 Components
- Reusable form components with validation
- OTP input component with auto-focus
- Password strength indicator
- Profile picture upload with preview
- Loading states and skeletons
- Error handling UI with retry options
- Success/confirmation messages
- Responsive design for all screen sizes

## 7. Security Requirements

### 7.1 Authentication Security
- Secure JWT token handling
- CSRF protection
- Rate limiting on auth endpoints
- OTP brute force protection
- Password reset token expiration
- Secure session storage
- Email verification requirements
- Account lockout after failed attempts

### 7.2 API Security
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration

### 7.3 Data Protection
- Sensitive data encryption
- Password hashing with bcrypt
- OTP secure generation and storage
- Password reset token security
- Secure file upload handling
- User data privacy compliance
- PII data encryption at rest

## 8. Performance Requirements

### 8.1 Frontend Performance
- Code splitting and lazy loading
- Image optimization
- Bundle size optimization
- Caching strategies

### 8.2 API Performance
- Efficient API calls
- Request caching
- Pagination for large datasets
- Optimistic updates

## 9. Documentation Requirements

### 9.1 Setup Documentation
- Installation instructions
- Environment setup guide
- Pocketbase configuration
- Deployment instructions

### 9.2 Developer Documentation
- API reference
- Component documentation
- Authentication flow diagrams
- Troubleshooting guide

### 9.3 User Documentation
- Feature overview
- Usage examples
- Best practices
- FAQ section

## 10. Testing Requirements

### 10.1 Unit Testing
- Authentication functions
- Password reset functionality
- OTP generation and verification
- Profile update operations
- API client functions
- Utility functions
- Component testing
- Email service testing

### 10.2 Integration Testing
- Complete authentication flow testing
- Password reset flow testing
- OTP authentication flow testing
- Profile update operations testing
- API integration testing
- Database operations testing
- Email delivery testing

### 10.3 E2E Testing
- Complete user registration and login journeys
- Password reset end-to-end flow
- OTP authentication complete flow
- Profile management workflows
- Cross-browser compatibility
- Mobile responsiveness
- Email integration testing

## 11. Deployment Requirements

### 11.1 Hosting Options
- Vercel deployment configuration
- Docker containerization
- Railway/Render deployment
- Self-hosting instructions

### 11.2 CI/CD Pipeline
- GitHub Actions workflow
- Automated testing
- Build optimization
- Deployment automation

## 12. Maintenance and Support

### 12.1 Updates
- Regular dependency updates
- Security patches
- Feature enhancements
- Bug fixes

### 12.2 Community Support
- GitHub repository with issues
- Documentation updates
- Example implementations
- Community contributions

## 13. Deliverables

### 13.1 Code Deliverables
- Complete Next.js 15.3.5 project structure
- Pocketbase v0.28.4 REST API integration
- TypeScript type definitions
- Component library with auth components
- API client implementation
- OTP service implementation
- Email service integration
- Password reset functionality

### 13.2 Documentation Deliverables
- README with setup instructions
- API documentation
- Component documentation
- Deployment guide

### 13.3 Configuration Deliverables
- Environment templates
- Docker configuration
- CI/CD pipeline configuration
- Hosting platform configs

## 14. Timeline and Milestones

### Phase 1: Foundation (Week 1-2)
- Next.js 15.3.5 project setup and configuration
- Pocketbase v0.28.4 setup and configuration
- Basic Next.js structure with TypeScript
- Pocketbase REST API client foundation

### Phase 2: Core Authentication (Week 3-4)
- Email/password authentication
- Protected routes implementation
- User session management
- Basic profile management

### Phase 3: Advanced Authentication (Week 5-6)
- Email-based OTP authentication implementation
- Password reset functionality
- Forgot password flow
- Email service integration
- Security enhancements

### Phase 4: Profile Management (Week 7-8)
- Complete profile update functionality
- Avatar upload and management
- Profile validation and error handling
- Account settings and preferences
- Password change functionality

### Phase 5: Polish & Testing (Week 9-10)
- Comprehensive testing implementation
- Performance optimization
- Security audit and fixes
- Documentation completion
- Deployment configuration

## 15. Risk Assessment

### 15.1 Technical Risks
- Next.js 15.3.5 compatibility issues
- Pocketbase v0.28.4 API changes
- Email service reliability
- OTP delivery failures
- Security vulnerabilities in auth flow

### 15.2 Mitigation Strategies
- Pin dependency versions
- Regular security audits
- Comprehensive testing
- Community feedback integration

## 16. Success Criteria

- [ ] Complete authentication system with email/password and email-based OTP
- [ ] Fully functional password reset and forgot password flows
- [ ] Comprehensive profile management with real-time updates
- [ ] Email-based OTP authentication with secure delivery
- [ ] Fully functional Pocketbase v0.28.4 REST API integration
- [ ] Protected routes with proper middleware
- [ ] Responsive UI with Tailwind CSS
- [ ] Email service integration for notifications
- [ ] Password strength validation and security measures
- [ ] Comprehensive documentation and setup guides
- [ ] Deployment-ready configuration
- [ ] Type-safe TypeScript implementation
- [ ] Performance optimized build
- [ ] Security audit passed
- [ ] Cross-browser compatibility verified