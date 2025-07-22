# Next.js + Pocketbase Starter

A starter template that integrates Next.js with Pocketbase as the backend database using only REST API calls.

## Features

- ✅ **Next.js 15.3.5** with App Router
- ✅ **Pocketbase v0.28.4** as backend database
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for styling
- ✅ **Email/password authentication**
- ✅ **Email OTP authentication**
- ✅ **Password reset functionality**
- ✅ **User registration and login**
- ✅ **Protected routes**
- ✅ **Session management**
- ✅ **Email notifications**
- ✅ **Complete profile management**
- ✅ **Password change functionality**
- ✅ **Account deletion**
- ✅ **Enhanced dashboard with profile summary**

## Prerequisites

- Node.js 18.18 or later
- Pocketbase v0.28.4

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd nextjs-pocketbase-auth-starter
npm install
```

### 2. Set up Environment Variables

Create a `.env.local` file in the root directory:

```env
POCKETBASE_URL=http://localhost:8090
```

### 3. Set up Pocketbase

1. Download Pocketbase from [pocketbase.io](https://pocketbase.io/)
2. Extract and run Pocketbase:
   ```bash
   ./pocketbase serve
   ```
3. Open http://localhost:8090/_/ in your browser
4. Create an admin account
5. Create the required collections:

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication Methods

### 1. Email/Password Authentication
- Traditional username/password login
- Secure password hashing handled by Pocketbase
- Session management with JWT tokens

### 2. Email OTP Authentication
- Passwordless authentication via email codes
- 6-digit OTP codes sent to user's email
- 10-minute expiration with retry limits
- Automatic cleanup of expired codes

### 3. Password Reset
- Secure password reset via email links
- 24-hour token expiration
- One-time use tokens
- Automatic cleanup of expired tokens

### 4. Profile Management
- Complete user profile editing
- Password change with current password verification
- Account deletion with password confirmation
- Profile summary display on dashboard

## Project Structure

```
.
├── actions/
│   └── auth.ts
├── app/
│   ├── auth/
│   │   ├── confirm-password-reset/page.tsx
│   │   ├── otp-login/page.tsx
│   │   ├── password-reset/page.tsx
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   └── verify-otp/page.tsx
│   ├── dashboard/page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   │   └── OTPInput.tsx
│   ├── AuthProvider.tsx
│   ├── forms/
│   │   └── auth/
│   │       ├── ConfirmPasswordResetForm.tsx
│   │       ├── index.ts
│   │       ├── LoginForm.tsx
│   │       ├── OTPLoginForm.tsx
│   │       ├── PasswordResetForm.tsx
│   │       ├── SignupForm.tsx
│   │       ├── VerifyEmailForm.tsx
│   │       └── VerifyOTPForm.tsx
│   ├── Navbar.tsx
│   ├── ThemeProvider.tsx
│   ├── ThemeToggle.tsx
│   └── ui/
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       └── tooltip.tsx
├── components.json
├── hooks/
│   └── use-mobile.ts
├── lib/
│   ├── auth-utils.ts
│   ├── pocketbase.ts
│   └── utils.ts
├── middleware.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── PRD.md
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
└── tsconfig.json
```

## Authentication Flow

1. **Sign Up**: Users can create accounts via `/auth/signup`
2. **Sign In**: Users can sign in via `/auth/signin` (password) or `/auth/otp-login` (OTP)
3. **Password Reset**: Users can reset passwords via `/auth/forgot-password`
4. **Dashboard**: Authenticated users are redirected to `/dashboard`
5. **Profile Management**: Users can manage their profile via `/profile`
6. **Protected Routes**: Unauthenticated users are redirected to sign in

## Profile Management Features

### Profile Information
- **Name**: Required field, can be updated
- **Email**: Display only (cannot be changed)
- **Bio**: Optional text description
- **Phone**: Optional phone number
- **Location**: Optional location information
- **Website**: Optional website URL

### Password Management
- **Change Password**: Update password with current password verification
- **Password Requirements**: Minimum 6 characters
- **Security**: Current password must be verified before change

### Account Management
- **Account Deletion**: Permanently delete account with password confirmation
- **Warning System**: Clear warnings about irreversible actions
- **Data Cleanup**: Automatic cleanup of user data

## API Endpoints

- `GET /api/profile` - Get current user's profile
- `PATCH /api/profile` - Update user profile
- `PATCH /api/profile/password` - Change user password
- `DELETE /api/profile/delete` - Delete user account
- `POST /api/pocketbase/users` - User registration
- `POST /api/auth/send-otp` - Send OTP email
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token

## Email Configuration

Configure SMTP in the admin ui

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. **New API Routes**: Add to `src/app/api/`
2. **New Pages**: Add to `src/app/`
3. **New Components**: Add to `src/components/`
4. **New Utilities**: Add to `src/lib/`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Railway
- Render
- Netlify
- AWS
- DigitalOcean

## Security Features

- JWT token-based sessions
- OTP expiration and retry limits
- Password reset token expiration and one-time use
- Password hashing (handled by Pocketbase)
- Rate limiting on auth endpoints
- Secure email delivery
- Current password verification for sensitive operations
- Account deletion confirmation with password verification

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- [Next.js Documentation](https://nextjs.org/docs)
- [Pocketbase Documentation](https://pocketbase.io/docs)
