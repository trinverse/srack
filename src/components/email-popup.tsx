'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X, Mail, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

export function EmailPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const pathname = usePathname();

  const supabase = createClient();

  // Hide on admin routes
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem('emailPopupSeen');
    if (!hasSeenPopup) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Basic email validation
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // Save to database
      const { error: dbError } = await supabase
        .from('email_subscribers')
        .insert({
          email: email.toLowerCase().trim(),
          source: 'popup',
        });

      if (dbError) {
        if (dbError.code === '23505') {
          // Unique violation - email already exists
          throw new Error('This email is already subscribed!');
        }
        throw dbError;
      }

      setIsSuccess(true);
      localStorage.setItem('emailPopupSeen', 'true');

      // Close popup after showing success
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('emailPopupSeen', 'true');
  };

  if (!isOpen || isAdminRoute) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-emerald to-emerald/80 text-white p-8 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-full">
              <Gift className="h-6 w-6" />
            </div>
            <span className="text-gold font-semibold">Special Offer</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Get 10% Off Your First Order!</h2>
          <p className="text-white/90">
            Join our mailing list and receive exclusive offers, menu updates, and your welcome discount.
          </p>
        </div>

        {/* Form */}
        <div className="p-8 -mt-4 bg-white rounded-t-2xl relative">
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-emerald" />
              </div>
              <h3 className="text-xl font-bold text-emerald mb-2">You&apos;re In!</h3>
              <p className="text-gray-600">
                Check your email for your 10% discount code: <strong>WELCOME10</strong>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base"
                  disabled={isSubmitting}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base bg-emerald hover:bg-emerald/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Get My 10% Off'}
              </Button>

              <p className="text-xs text-center text-gray-500">
                By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
