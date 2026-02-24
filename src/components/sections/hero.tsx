'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/data/site';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/menu-images/main.png"
          alt="Delicious home-style Indian dishes"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        {/* Emerald tint overlay */}
        <div className="absolute inset-0 bg-emerald/10 mix-blend-overlay" />
      </div>

      {/* Content */}
      <div className="container-wide relative z-10 py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/20"
          >
            <Leaf className="h-4 w-4 text-emerald-300" />
            <span>Fresh, Authentic, Home-Style</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-balance mb-6 text-white text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight drop-shadow-lg"
          >
            Taste the Love of{' '}
            <span className="text-emerald-300">Home Cooking</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-8 text-balance drop-shadow-md"
          >
            {siteConfig.description}
          </motion.p>

          {/* Delivery info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center space-x-2 text-white/70 mb-10"
          >
            <Clock className="h-5 w-5 text-emerald-300" />
            <span>Delivered fresh on Mondays &amp; Thursdays</span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-white text-lg px-8 py-6 shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-400/40 hover:scale-105"
            >
              <Link href="/menu">
                View This Week&apos;s Menu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 bg-transparent border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 backdrop-blur-sm transition-all duration-300"
            >
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade to page background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
