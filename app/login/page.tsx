'use client';

import { Logo, LoginHeader, LoginForm, LoginFooter, TestimonialCard } from '@/components/ui';

export default function LoginPage() {
  const handleLogin = (data: { email: string; password: string; keepSignedIn: boolean }) => {
    // Handle login logic here
    console.log('Login attempt:', data);
    // You can add authentication logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-100 to-purple-300 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex items-center justify-between gap-12">
        {/* Left side - Login Form */}
        <div className="w-full max-w-md">
          <Logo />
          <LoginHeader />
          <LoginForm onSubmit={handleLogin} />
          <LoginFooter />
        </div>

        {/* Right side - Testimonial Card */}
        <TestimonialCard />
      </div>
    </div>
  );
}