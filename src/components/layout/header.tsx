'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, ShoppingCart, User, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { navigation, siteConfig } from '@/data/site';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, customer, isLoading, signOut, isStaff } = useAuth();
  const { state: cartState } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const itemCount = cartState.itemCount;

  // Hide header on admin routes (admin has its own navigation)
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  // Don't render on admin routes
  if (isAdminRoute) {
    return null;
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="container-wide">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  'text-foreground/80 hover:text-foreground hover:bg-secondary'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Cart */}
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Admin Link for Staff */}
            {!isLoading && isStaff && (
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              </Button>
            )}

            {/* Auth */}
            {!isLoading && (
              <>
                {(customer || user) ? (
                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/account" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {!isStaff && (
                          <span className="hidden lg:inline">
                            {customer?.full_name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || 'Account'}
                          </span>
                        )}
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Order Now CTA */}
            <Button asChild className="bg-primary hover:bg-primary/90 ml-2">
              <Link href="/menu">Order Now</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Cart */}
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium py-2 border-b border-border"
                    >
                      {item.label}
                    </Link>
                  ))}

                  <div className="pt-4 border-t">
                    {!isLoading && (
                      <>
                        {(customer || user) ? (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground px-1">
                              Signed in as {customer?.full_name || user?.user_metadata?.full_name || user?.email}
                            </p>
                            {isStaff && (
                              <Link
                                href="/admin"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-2 py-2 text-lg font-medium text-emerald"
                              >
                                <Shield className="h-5 w-5" />
                                Admin Dashboard
                              </Link>
                            )}
                            <Link
                              href="/account"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-2 py-2 text-lg font-medium"
                            >
                              <User className="h-5 w-5" />
                              My Account
                            </Link>
                            <button
                              onClick={handleSignOut}
                              className="flex items-center gap-2 py-2 text-lg font-medium text-red-600"
                            >
                              <LogOut className="h-5 w-5" />
                              Sign Out
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Link
                              href="/login"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block py-2 text-lg font-medium"
                            >
                              Sign In
                            </Link>
                            <Link
                              href="/signup"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block py-2 text-lg font-medium"
                            >
                              Sign Up
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
                    <Link href="/menu" onClick={() => setIsMobileMenuOpen(false)}>
                      Order Now
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
