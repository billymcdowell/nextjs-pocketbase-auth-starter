import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center p-6 sm:p-12">
      <header className="flex flex-col items-center gap-4 mt-8 mb-8">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={120}
          height={26}
          priority
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          Next.js + Pocketbase Auth Starter
        </h1>
        <p className="text-lg text-center text-muted-foreground max-w-2xl">
          A starter template for building modern, secure web apps with <span className="font-semibold">Next.js</span> and <span className="font-semibold">Pocketbase</span>.<br/>
          <span className="text-sm text-primary">Self-hosted, type-safe, and vendor lock-in free.</span>
        </p>
      </header>

      <section className="w-full max-w-3xl bg-card/80 dark:bg-card/80 rounded-xl shadow-lg p-6 sm:p-10 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-primary">Key Features</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-muted-foreground text-base list-disc list-inside">
          <li>Email/password & OTP (One-Time Password) authentication</li>
          <li>Next.js 15 App Router</li>
          <li>Pocketbase REST API integration (no SDKs)</li>
          <li>TypeScript & Tailwind CSS</li>
          <li>Protected routes & session management</li>
          <li>Password reset, account deletion, and profile management</li>
          <li>JWT-based sessions & secure email notifications</li>
          <li>Deployable anywhere: Vercel, Netlify, Railway, and more</li>
        </ul>
      </section>

      <section className="w-full max-w-3xl bg-card/80 dark:bg-card/80 rounded-xl shadow-lg p-6 sm:p-10 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-primary">How It Works</h2>
        <ol className="list-decimal list-inside text-muted-foreground space-y-2">
          <li><span className="font-semibold">Sign Up:</span> Register with email/password or passwordless OTP.</li>
          <li><span className="font-semibold">Sign In:</span> Log in securely with your chosen method.</li>
          <li><span className="font-semibold">Password Reset:</span> Reset your password via secure email link.</li>
          <li><span className="font-semibold">Dashboard & Profile:</span> Manage your account, update your profile, or delete your account.</li>
          <li><span className="font-semibold">Protected Routes:</span> Only authenticated users can access sensitive pages.</li>
        </ol>
      </section>

      <section className="w-full max-w-3xl bg-card/80 dark:bg-card/80 rounded-xl shadow-lg p-6 sm:p-10 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-primary">Why Use This Starter?</h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li>🚀 <span className="font-semibold">Fast setup:</span> Go from zero to auth-enabled app in minutes.</li>
          <li>🔒 <span className="font-semibold">Secure by default:</span> JWT, OTP, password reset, and more.</li>
          <li>🛠️ <span className="font-semibold">Fully customizable:</span> Extend, theme, or swap out components as needed.</li>
          <li>🗄️ <span className="font-semibold">Self-hosted backend:</span> No vendor lock-in, keep your data private.</li>
          <li>📚 <span className="font-semibold">Comprehensive docs:</span> Clear setup, deployment, and extension guides.</li>
        </ul>
      </section>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Link href="/auth/signup" className="rounded-full bg-primary hover:bg-primary/80 text-white font-semibold px-6 py-3 shadow transition-colors text-center">
          Try the Demo
        </Link>
        <a
          href="https://github.com/williammcdowell/nextjs-pocketbase-auth-starter"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-primary text-primary hover:bg-primary/10 font-semibold px-6 py-3 shadow transition-colors text-center"
        >
          View on GitHub
        </a>
        <Link href="/dashboard" className="rounded-full bg-primary hover:bg-primary/80 text-white font-semibold px-6 py-3 shadow transition-colors text-center">
          Go to Dashboard
        </Link>
      </div>

        <footer className="text-xs text-muted-foreground mt-auto mb-2 text-center">
        <span>MIT Licensed. Built with Next.js & Pocketbase. </span>
        <a href="https://nextjs.org/" className="underline hover:text-primary" target="_blank" rel="noopener noreferrer">Learn more</a>
      </footer>
    </div>
  );
}
