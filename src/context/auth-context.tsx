'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import type { User, Session } from '@supabase/supabase-js';
import type { Customer } from '@/types/database';

const log = logger.withSource('Auth');

interface AuthContextType {
  user: User | null;
  session: Session | null;
  customer: Customer | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    const fetchCustomerData = async (authUser: User) => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('auth_user_id', authUser.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          log.error('Error fetching customer:', error);
        }

        if (data) {
          if (mounted) setCustomer(data);
          return;
        }

        // No customer record — auto-create via signup API
        log.info('No customer record found, auto-creating...');
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            authUserId: authUser.id,
            email: authUser.email,
            fullName: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Customer',
            phone: authUser.user_metadata?.phone || authUser.phone || '',
          }),
        });

        if (res.ok) {
          // Re-fetch the newly created customer
          const { data: newCustomer } = await supabase
            .from('customers')
            .select('*')
            .eq('auth_user_id', authUser.id)
            .single();

          if (mounted) setCustomer(newCustomer);
        } else {
          log.error('Failed to auto-create customer:', await res.text());
        }
      } catch (error) {
        log.error('Caught error fetching customer:', error);
      }
    };

    // Use onAuthStateChange for both initial session and subsequent changes.
    // Do NOT call getSession()/getUser() separately — they deadlock with
    // onAuthStateChange's internal lock in @supabase/supabase-js v2.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLoading(false);

      // Fetch customer data in the background — must NOT be awaited
      // inside onAuthStateChange to avoid blocking Supabase's internal lock
      if (newSession?.user) {
        fetchCustomerData(newSession.user);
      } else {
        setCustomer(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
          },
        },
      });

      if (authError) {
        // Friendly messages for common errors
        if (authError.message?.includes('already registered')) {
          return { error: new Error('An account with this email already exists. Please sign in instead.') };
        }
        return { error: authError };
      }

      // Supabase returns a fake user with empty identities when the email is already taken
      // (to prevent email enumeration). Detect this and try to sign in instead.
      if (authData.user && (!authData.user.identities || authData.user.identities.length === 0)) {
        // Account already exists — try signing in with the provided password
        const { error: existingSignInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (existingSignInError) {
          return { error: new Error('An account with this email already exists. Please sign in instead.') };
        }

        // Signed in successfully — fetch customer will happen via onAuthStateChange
        return { error: null };
      }

      // New user created — set up customer record + auto-confirm email
      if (authData.user) {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            authUserId: authData.user.id,
            email,
            fullName,
            phone,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          console.error('Error creating customer profile:', data);
          // Don't show a cryptic error — the auth account was created, try signing in
          const { error: fallbackSignInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (!fallbackSignInError) {
            return { error: null };
          }
          return { error: new Error('Account created but we had trouble setting up your profile. Please try signing in.') };
        }

        // Auto-sign in since email is now auto-confirmed
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          console.warn('Auto sign-in after signup failed:', signInError.message);
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setCustomer(null);
  };

  const isAdmin = customer?.role === 'admin';
  const isStaff = ['admin', 'kitchen', 'marketing'].includes(customer?.role || '');

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        customer,
        isLoading,
        signUp,
        signIn,
        signOut,
        isAdmin,
        isStaff,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
