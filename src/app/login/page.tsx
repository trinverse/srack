'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

const log = logger.withSource('Login');

function LoginForm() {
  const searchParams = useSearchParams();
  const defaultRedirect = searchParams.get('redirect') || '/';
  const { signIn } = useAuth();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    log.info('Starting sign in...');
    const { error } = await signIn(email, password);
    log.info('Sign in completed', { error: error?.message || null });

    if (error) {
      log.error('Sign in failed', error.message);
      setError(error.message);
      setIsLoading(false);
    } else {
      // Check if user is staff to redirect to admin
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: customer } = await supabase
          .from('customers')
          .select('role')
          .eq('auth_user_id', user.id)
          .single();

        const isStaff = ['admin', 'kitchen', 'marketing'].includes(customer?.role || '');
        const targetRedirect = isStaff && defaultRedirect === '/' ? '/admin' : defaultRedirect;
        log.info('Redirecting to:', targetRedirect);
        window.location.href = targetRedirect;
      } else {
        log.info('Redirecting to:', defaultRedirect);
        window.location.href = defaultRedirect;
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald bg-background"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-10 pr-12 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald bg-background"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account to continue ordering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
              <LoginForm />
            </Suspense>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-emerald hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
