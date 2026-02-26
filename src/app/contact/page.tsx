'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Send,
  Facebook,
  Instagram,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { contactInfo } from '@/data/site';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to Formspree or similar
    setSubmitted(true);
  };

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
            <h1 className="mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-lg">
              Have a question or want to place an order? We&apos;d love to hear from
              you. Reach out using any of the methods below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-8"
            >
              <div>
                <h2 className="mb-6">Get in Touch</h2>
                <p className="text-muted-foreground text-lg">
                  Whether you have a question about our menu, want to discuss
                  catering for your event, or just want to say hello, we&apos;re here
                  to help.
                </p>
              </div>

              <div className="space-y-6">
                {/* Phone */}
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Call us</p>
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="text-lg font-semibold hover:text-primary"
                      >
                        {contactInfo.phone}
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Email */}
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email us</p>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-lg font-semibold hover:text-primary"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Hours */}
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Delivery Schedule
                      </p>
                      <p className="text-lg font-semibold">
                        Mondays & Thursdays
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Order 36 hours in advance
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Service Area */}
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Service Area
                      </p>
                      <p className="text-lg font-semibold">
                        Greater Atlanta Metro
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Alpharetta, Roswell, Johns Creek & more
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="font-semibold mb-4">Follow Us</h4>
                <div className="flex gap-4">
                  {contactInfo.socialLinks.map((social) => (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {social.platform === 'facebook' && (
                        <Facebook className="h-5 w-5" />
                      )}
                      {social.platform === 'instagram' && (
                        <Instagram className="h-5 w-5" />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-8">
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Send className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-4">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. We&apos;ll get back to you as
                        soon as possible.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            name: '',
                            email: '',
                            phone: '',
                            message: '',
                          });
                        }}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-semibold mb-6">
                        Send us a Message
                      </h3>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Your Phone (optional)
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Message *
                          </label>
                          <textarea
                            required
                            rows={5}
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                message: e.target.value,
                              })
                            }
                            placeholder="How can we help you?"
                            className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <Button type="submit" size="lg" className="w-full">
                          <Send className="mr-2 h-5 w-5" />
                          Send Message
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-secondary/50">
        <div className="container-tight text-center">
          <h3 className="mb-4">Looking for Something Specific?</h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/menu">View Menu</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/catering">Catering Services</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/faq">FAQ</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
