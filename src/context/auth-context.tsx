'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
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

  const lastFetchedUserId = useRef<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Only fetch if we haven't fetched for this user yet
        if (lastFetchedUserId.current !== session.user.id) {
          lastFetchedUserId.current = session.user.id;
          await fetchCustomer(session.user.id);
        }
      } else {
        lastFetchedUserId.current = null;
        setCustomer(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCustomer = async (authUserId: string) => {
    log.info('Fetching customer for auth_user_id:', authUserId);
    try {
      const { data, error, status } = await supabase
        .from('customers')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      log.debug('Customer fetch result:', { data, error, status });

      if (error && error.code !== 'PGRST116') {
        log.error('Error fetching customer:', error);
      }

      setCustomer(data);
    } catch (error) {
      log.error('Caught error fetching customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        return { error: authError };
      }

      // Create customer record
      if (authData.user) {
        const { error: customerError } = await supabase.from('customers').insert({
          auth_user_id: authData.user.id,
          email,
          full_name: fullName,
          phone,
          role: 'customer',
        });

        if (customerError) {
          console.error('Error creating customer:', customerError);
          return { error: new Error('Failed to create customer profile') };
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
