'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, ShoppingCart, User, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { navigation } from '@/data/site';
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
  const isHomePage = pathname === '/';
  const isHeroVisible = isHomePage && !isScrolled;

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

  if (isAdminRoute) {
    return null;
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-sm border-b'
          : isHeroVisible
            ? 'bg-black/30 backdrop-blur-sm'
            : 'bg-background/95 backdrop-blur-sm border-b shadow-sm'
      )}
    >
      {/* Top bar with logo + account actions */}
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/menu-images/logo.png"
              alt="The Spice Rack Atlanta Logo"
              width={52}
              height={52}
              className="object-contain drop-shadow-md"
              priority
              quality={60}
              unoptimized={process.env.NODE_ENV === 'development'}
            />
            <span className={cn(
              'font-bold text-lg leading-tight',
              isHeroVisible ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]' : 'text-foreground'
            )}>
              The Spice Rack Atlanta
            </span>
          </Link>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Admin Link */}
            {!isLoading && isStaff && (
              <Button asChild variant="ghost" size="sm" className={cn("rounded-full font-medium", isHeroVisible && 'text-white hover:bg-white/10')}>
                <Link href="/admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              </Button>
            )}

            {/* Auth */}
            {!isLoading && (
              <>
                {(customer || user) ? (
                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm" className={cn("rounded-full font-medium", isHeroVisible && 'text-white hover:bg-white/10')}>
                      <Link href="/account" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {customer?.full_name?.split(' ')[0] || 'Account'}
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out" className={cn("rounded-full h-8 w-8", isHeroVisible && 'text-white hover:bg-white/10')}>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm" className={cn("rounded-full font-medium", isHeroVisible && 'text-white hover:bg-white/10')}>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild size="sm" className="rounded-full font-medium">
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Cart */}
            <Button asChild variant="ghost" size="icon" className={cn('relative rounded-full', isHeroVisible && 'text-white hover:bg-white/10')}>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>

          {/* Mobile right actions */}
          <div className="flex items-center gap-2 md:hidden">
            <Button asChild variant="ghost" size="icon" className={cn('relative', isHeroVisible && 'text-white hover:bg-white/10')}>
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
                <Button variant="ghost" size="icon" className={cn(isHeroVisible && 'text-white hover:bg-white/10')}>
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] border-l-0 shadow-2xl flex flex-col bg-background/95 backdrop-blur-xl">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex-1 overflow-y-auto w-full pt-12 pb-6 px-6 flex flex-col items-center">
                  <div className="flex flex-col items-center w-full space-y-5">
                    {navigation.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-xl font-bold tracking-wide hover:text-primary transition-colors text-center"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-8 w-full flex flex-col items-center border-t border-border/50 pt-6">
                    {!isLoading && (
                      <div className="w-full flex flex-col items-center">
                        {(customer || user) ? (
                          <div className="w-full flex flex-col items-center space-y-4">
                            <p className="text-sm font-medium text-muted-foreground bg-secondary/50 px-4 py-1.5 rounded-full mb-1">
                              {customer?.full_name || user?.user_metadata?.full_name || user?.email}
                            </p>
                            {isStaff && (
                              <Link
                                href="/admin"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-2 text-base font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
                              >
                                <Shield className="h-4 w-4" />
                                Admin Dashboard
                              </Link>
                            )}
                            <Link
                              href="/account"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-2 text-base font-medium hover:text-primary transition-colors"
                            >
                              <User className="h-4 w-4" />
                              My Account
                            </Link>
                            <button
                              onClick={handleSignOut}
                              className="flex items-center gap-2 text-base font-medium text-destructive hover:text-destructive/80 transition-colors"
                            >
                              <LogOut className="h-4 w-4" />
                              Sign Out
                            </button>
                          </div>
                        ) : (
                          <div className="w-full flex flex-col items-center space-y-3">
                            <Link
                              href="/login"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="w-full py-2.5 px-4 text-center text-base font-semibold border-2 border-primary text-primary rounded-xl hover:bg-primary/5 transition-colors"
                            >
                              Sign In
                            </Link>
                            <Link
                              href="/signup"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="w-full py-2.5 px-4 text-center text-base font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-md"
                            >
                              Sign Up
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 w-full mb-8">
                    <Button asChild className="w-full py-5 text-base font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform">
                      <Link href="/menu" onClick={() => setIsMobileMenuOpen(false)}>
                        Order Now
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Desktop navigation bar — always visible */}
      <nav className={cn(
        'hidden md:block border-t transition-colors',
        isHeroVisible
          ? 'border-white/10 bg-black/20'
          : 'border-border/30'
      )}>
        <div className="container-wide">
          <div className="flex items-center justify-center gap-1 py-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={cn(
                  'px-4 py-2 text-sm font-semibold rounded-full transition-colors',
                  pathname === item.href
                    ? isHeroVisible
                      ? 'bg-white/20 text-white'
                      : 'bg-primary/10 text-primary'
                    : isHeroVisible
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-foreground/70 hover:text-foreground hover:bg-secondary'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
