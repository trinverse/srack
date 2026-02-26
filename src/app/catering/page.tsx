'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';


const CATERING_PDF_URL = 'https://cdn.shopify.com/s/files/1/0670/0554/6579/files/TSRA_Catering-Menu_June2021_F_1.pdf?v=1759867162';
const CATERING_CONSULTANT_NAME = 'Shreena';
const CATERING_CONSULTANT_PHONE = '(815) 531-9007';

const eventTypes = [
  'Sangeet',
  'Mehndi',
  'Pujas',
  'Garba',
  'Birthdays',
  'Kitty Parties',
  'Backyard Parties',
  'Breakfast & Brunch',
];

export default function CateringPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you! We will contact you shortly to discuss your catering needs.');
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
            className="max-w-3xl"
          >
            <h1 className="mb-6 uppercase">Catering</h1>
            <div className="space-y-4 text-muted-foreground text-lg">
              <p>
                We specialize in House parties and Small events:{' '}
                <strong className="text-foreground">
                  {eventTypes.join(', ')}.
                </strong>
              </p>
              <p>
                All catering is done and priced by Tray size &mdash; Small, Medium &amp; Large Trays.
              </p>
              <p className="text-foreground font-medium">
                Call our catering consultant {CATERING_CONSULTANT_NAME} at{' '}
                <a
                  href={`tel:${CATERING_CONSULTANT_PHONE.replace(/[^\d+]/g, '')}`}
                  className="text-primary hover:underline"
                >
                  {CATERING_CONSULTANT_PHONE}
                </a>{' '}
                for more details &mdash; you can also fill the inquiry below &amp; one of our
                representatives will reach out to you!
              </p>
            </div>
            <div className="mt-8">
              <Button asChild size="lg" variant="outline">
                <a href={CATERING_PDF_URL} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-5 w-5" />
                  Download Catering Menu (PDF)
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-20">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">Catering Inquiry</h2>
            <p className="text-muted-foreground text-lg">
              Tell us about your event and we&apos;ll create a customized proposal.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-8">
                <form id="inquiry-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Your name
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
                        Your email
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
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your message
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tell us about your event, dietary requirements, or any special requests..."
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="submit" size="lg" className="flex-1">
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <a href={`tel:${CATERING_CONSULTANT_PHONE.replace(/[^\d+]/g, '')}`}>
                        <Phone className="mr-2 h-5 w-5" />
                        Call {CATERING_CONSULTANT_NAME}
                      </a>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
