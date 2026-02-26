'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/menu-images/main.png"
          alt="Delicious home-style Indian dishes"
          fill
          className="object-cover"
          sizes="100vw"
          quality={75}
          unoptimized={process.env.NODE_ENV === 'development'}
        />
      </div>

      {/* Content */}
      <div className="container-wide relative z-10 py-32 flex flex-col items-center">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-emerald-950/40 backdrop-blur-md text-emerald-100 px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-emerald-400/20 shadow-sm"
          >
            <Leaf className="h-4 w-4 text-emerald-400" />
            <span>Fresh, Authentic, Home-Style</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-balance mb-4 text-white text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
          >
            Tiffin-Dabba &amp; Catering Services
          </motion.h1>

          {/* Subheadline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl lg:text-3xl text-emerald-400 font-bold max-w-3xl mx-auto mb-10 text-balance drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] uppercase tracking-wide"
          >
            Spice Up Your Day with Authentic Indian Meals
          </motion.h2>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-white text-lg font-bold px-8 py-6 rounded-full shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-emerald-400/50 hover:scale-105 uppercase tracking-wide"
            >
              <Link href="/menu?day=monday" prefetch={false}>
                Monday Menu
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="text-lg font-bold px-8 py-6 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 uppercase tracking-wide"
            >
              <Link href="/menu?day=thursday" prefetch={false}>
                Thursday Menu
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade to page background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
