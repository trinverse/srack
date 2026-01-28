'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gift, ArrowRight, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WelcomeOffer() {
  const [copied, setCopied] = useState(false);
  const code = 'WELCOME10';

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-8 bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gold/20 rounded-full">
              <Gift className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h3 className="font-bold text-lg">New Customer Special!</h3>
              <p className="text-muted-foreground">
                Get 10% off your first order with code
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={copyCode}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-gold rounded-lg font-mono font-bold text-lg hover:bg-gold/5 transition-colors"
            >
              {code}
              {copied ? (
                <Check className="h-5 w-5 text-emerald" />
              ) : (
                <Copy className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            <Button asChild className="bg-emerald hover:bg-emerald/90">
              <Link href="/menu" className="flex items-center gap-2">
                Order Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
