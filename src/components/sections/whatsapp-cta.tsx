'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WHATSAPP_LINK = 'https://chat.whatsapp.com/FfkXEt9f8ImA4wvLsBUk6A';

export function WhatsAppCTA() {
  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10">
      <div className="container-tight text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-6">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Join the community!
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join our WhatsApp community for menu updates and exclusive VIP access!
          </p>
          <Button
            asChild
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-6 text-lg"
          >
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Contact Us on WhatsApp
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
