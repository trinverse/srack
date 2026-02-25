'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqItems } from '@/data/faq';
import { contactInfo } from '@/data/site';
import { FAQCategory } from '@/types';

const categories: { key: FAQCategory; label: string }[] = [
  { key: 'ordering', label: 'Ordering' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'dietary', label: 'Dietary' },
  { key: 'payments', label: 'Payments' },
  { key: 'catering', label: 'Catering' },
];

export default function FAQPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-lg">
              Find answers to common questions about our tiffin service,
              delivery, and catering options.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container-tight">
          {categories.map((category, catIndex) => {
            const categoryFaqs = faqItems.filter(
              (item) => item.category === category.key
            );
            if (categoryFaqs.length === 0) return null;

            return (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
                className="mb-12 last:mb-0"
              >
                <h2 className="text-2xl font-semibold mb-6 text-primary">
                  {category.label}
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {categoryFaqs.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="bg-background border-2 border-emerald-500/30 data-[state=open]:border-emerald-500/60 rounded-xl px-6 transition-colors shadow-sm"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-5">
                        <span className="font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 bg-secondary/50">
        <div className="container-tight text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              We&apos;re here to help. Reach out to us directly and we&apos;ll get back
              to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <a href={`tel:${contactInfo.phone}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  {contactInfo.phone}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={`mailto:${contactInfo.email}`}>
                  <Mail className="mr-2 h-5 w-5" />
                  Email Us
                </a>
              </Button>
            </div>
            <p className="text-muted-foreground text-sm mt-8">
              Looking for catering information?{' '}
              <Link href="/catering" className="text-primary hover:underline">
                View our catering packages
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
