'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, ShoppingCart, User, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { navigation, siteConfig } from '@/data/site';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, customer, isLoading, signOut, isStaff } = useAuth();
  const { state: cartState } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const itemCount = cartState.itemCount;
  const isHomePage = pathname === '/';
  const isHeroVisible = isHomePage && !isScrolled;

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
          ? 'bg-background/80 backdrop-blur-md shadow-sm border-b border-white/20'
          : isHeroVisible
            ? 'bg-black/20 backdrop-blur-sm border-b border-white/10'
            : 'bg-background/40 backdrop-blur-sm border-b border-border/40 shadow-sm'
      )}
    >
      <nav className="container-wide">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 z-50">
            <Image
              src="/menu-images/logo.png"
              alt="The Spice Rack Atlanta Logo"
              width={68}
              height={68}
              className={cn(
                "object-contain drop-shadow-md origin-left transition-all duration-300",
                isScrolled || isMenuHovered ? "scale-90" : "scale-110"
              )}
              priority
              quality={60}
              unoptimized={process.env.NODE_ENV === 'development'}
            />
            <span className={cn(
              'font-bold transition-all duration-300 leading-tight',
              isScrolled || isMenuHovered ? 'text-base md:text-lg' : 'text-xl md:text-2xl',
              isHeroVisible ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]' : 'text-primary'
            )}>
              <span className="md:hidden">The Spice<br />Rack Atlanta</span>
              <span className="hidden md:inline whitespace-nowrap">The Spice Rack Atlanta</span>
            </span>
          </Link>

          {/* Right Section Wrapper */}
          <div className="hidden md:flex items-center gap-4">
            {/* Desktop Navigation */}
            <div
              className={cn(
                "flex items-center rounded-full transition-all duration-500 overflow-hidden group border",
                isHeroVisible
                  ? "bg-emerald-950/40 backdrop-blur-xl border-white/10 shadow-lg text-white"
                  : "bg-emerald-500/10 backdrop-blur-xl border-emerald-500/20 shadow-sm text-primary"
              )}
              onMouseEnter={() => setIsMenuHovered(true)}
              onMouseLeave={() => setIsMenuHovered(false)}
            >
              <div className="px-6 py-2.5 font-bold flex items-center gap-2 cursor-pointer transition-colors">
                <Menu className="w-5 h-5" />
                <span>Menu</span>
              </div>

              <div className="overflow-hidden max-w-0 opacity-0 group-hover:max-w-[700px] group-hover:opacity-100 transition-all duration-700 ease-in-out">
                <div className="flex items-center space-x-1 px-2 pr-4 whitespace-nowrap py-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={false}
                      className={cn(
                        'px-4 py-2 text-sm font-bold rounded-full transition-all duration-300',
                        isHeroVisible
                          ? 'text-white/90 hover:text-white hover:bg-emerald-500/40 hover:shadow-inner'
                          : 'text-primary/80 hover:text-primary hover:bg-emerald-500/20'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side actions */}
            <div className={cn(
              "flex items-center rounded-full transition-all duration-500 overflow-hidden group border",
              isHeroVisible
                ? "bg-emerald-950/40 backdrop-blur-xl border-white/10 shadow-lg text-white"
                : "bg-emerald-500/10 backdrop-blur-xl border-emerald-500/20 shadow-sm text-primary"
            )}>
              <div className="overflow-hidden max-w-0 opacity-0 group-hover:max-w-[700px] group-hover:opacity-100 transition-all duration-700 ease-in-out">
                <div className="flex items-center gap-1 px-2 pl-4 whitespace-nowrap py-1">
                  {/* Cart */}
                  <Button asChild variant="ghost" size="icon" className={cn('relative rounded-full hover:bg-emerald-500/20', isHeroVisible && 'text-white hover:bg-emerald-500/40')}>
                    <Link href="/cart">
                      <ShoppingCart className="h-5 w-5 drop-shadow-sm" />
                      {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                          {itemCount}
                        </span>
                      )}
                    </Link>
                  </Button>

                  {/* Admin Link for Staff */}
                  {!isLoading && isStaff && (
                    <Button asChild variant="ghost" size="sm" className={cn("rounded-full font-bold", isHeroVisible && 'text-white hover:bg-emerald-500/40')}>
                      <Link href="/admin" className="flex items-center gap-2 drop-shadow-sm">
                        <Shield className="h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    </Button>
                  )}

                  {/* Auth Details */}
                  {!isLoading && (
                    <>
                      {(customer || user) ? (
                        <div className="flex items-center gap-1">
                          {!isStaff && (
                            <span className={cn("px-3 text-sm font-bold", isHeroVisible ? "text-white/90" : "text-primary")}>
                              Hi, {customer?.full_name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0]}
                            </span>
                          )}
                          <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out" className={cn("rounded-full", isHeroVisible && 'text-white hover:bg-emerald-500/40 drop-shadow-sm')}>
                            <LogOut className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Button asChild variant="ghost" size="sm" className={cn("rounded-full font-bold", isHeroVisible && 'text-white hover:bg-emerald-500/40 drop-shadow-sm')}>
                            <Link href="/login">Sign In</Link>
                          </Button>
                          <Button asChild size="sm" className="rounded-full shadow-md font-bold hover:scale-105 transition-transform">
                            <Link href="/signup">Sign Up</Link>
                          </Button>
                        </div>
                      )}
                    </>
                  )}

                  {/* Order Now CTA */}
                  <Button asChild className="bg-primary hover:bg-primary/90 ml-1 rounded-full shadow-md font-bold px-6 hover:scale-105 transition-transform">
                    <Link href="/menu">Order Now</Link>
                  </Button>
                </div>
              </div>

              {/* Main Right Trigger */}
              <Link
                href={(customer || user) ? "/account" : "/login"}
                prefetch={false}
                className="px-4 lg:px-6 py-2.5 font-bold flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
              >
                <User className="w-4 h-4 md:w-5 md:h-5" />
                <span className={cn("transition-all duration-300", isScrolled ? "text-xs md:text-sm" : "text-sm md:text-base")}>
                  {(customer || user) ? "Account" : "Sign In"}
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Cart */}
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
      </nav>
    </motion.header>
  );
}
