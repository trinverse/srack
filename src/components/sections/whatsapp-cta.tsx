'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const WHATSAPP_LINK = 'https://chat.whatsapp.com/FfkXEt9f8ImA4wvLsBUk6A';

export function WhatsAppCTA() {
  return (
    <section
      className="relative py-24 md:py-36 flex items-center justify-center bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url('/img/jointhecommunity.png')` }}
    >
      {/* Background Overlay (optional, for readability if needed) */}
      {/* <div className="absolute inset-0 bg-black/10" /> */}

      {/* Content overlay */}
      <div className="container w-full relative z-10 flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white p-10 md:p-16 text-center shadow-xl max-w-md w-full mx-4"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-foreground tracking-tight">
            Join the community!
          </h2>
          <p className="text-foreground/80 text-sm md:text-base mb-8 leading-relaxed max-w-[280px] mx-auto font-medium">
            Click the link below to join our WhatsApp community!
          </p>
          <Button
            asChild
            size="lg"
            className="bg-emerald hover:bg-emerald/90 text-white font-bold px-10 py-6 rounded-full uppercase tracking-wider text-sm"
          >
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Now
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
