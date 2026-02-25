'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Users, Send, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cateringTiers } from '@/data/faq';
import { contactInfo } from '@/data/site';
import { cn } from '@/lib/utils';

export default function CateringPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    guestCount: '',
    eventType: '',
    message: '',
    selectedPackage: '',
  });

  const handlePackageSelect = (packageId: string) => {
    setFormData((prev) => ({ ...prev, selectedPackage: packageId }));
    const formElement = document.getElementById('inquiry-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to an API or form service
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
            className="max-w-2xl"
          >
            <h1 className="mb-4">Catering Services</h1>
            <p className="text-muted-foreground text-lg">
              Bring the authentic flavors of home-style Indian cuisine to your
              next event. From intimate gatherings to grand celebrations, we
              create memorable culinary experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20">
        <div className="container-wide">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            Catering Packages
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto"
          >
            Choose a package that fits your event size and customize the menu to
            your preferences.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cateringTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={cn(
                    "h-full relative overflow-hidden transition-all duration-300 border-2",
                    formData.selectedPackage === tier.id
                      ? "border-emerald-500 shadow-xl ring-4 ring-emerald-500/10 scale-[1.02] bg-emerald-50/10"
                      : index === 1
                        ? "border-primary/50 shadow-lg hover:border-border"
                        : "border-transparent hover:border-border"
                  )}
                  onClick={() => handlePackageSelect(tier.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {formData.selectedPackage === tier.id && (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg z-10">
                      Selected
                    </div>
                  )}
                  {index === 1 && formData.selectedPackage !== tier.id && (
                    <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-6 w-6 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {tier.minGuests}-{tier.maxGuests} guests
                      </span>
                    </div>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <p className="text-muted-foreground">{tier.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-primary">
                        ${tier.pricePerPerson}
                      </span>
                      <span className="text-muted-foreground">/person</span>
                    </div>
                    <ul className="space-y-3">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Button
                        variant={formData.selectedPackage === tier.id ? "default" : "outline"}
                        className={cn("w-full transition-all", formData.selectedPackage === tier.id ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "")}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePackageSelect(tier.id);
                        }}
                      >
                        {formData.selectedPackage === tier.id ? "Package Selected" : "Select Package"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-20 bg-secondary/50">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">Request a Quote</h2>
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
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Event Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.eventDate}
                        onChange={(e) =>
                          setFormData({ ...formData, eventDate: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Estimated Guest Count *
                      </label>
                      <input
                        type="number"
                        required
                        min="15"
                        value={formData.guestCount}
                        onChange={(e) =>
                          setFormData({ ...formData, guestCount: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Event Type
                      </label>
                      <select
                        value={formData.eventType}
                        onChange={(e) =>
                          setFormData({ ...formData, eventType: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select event type</option>
                        <option value="wedding">Wedding</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="birthday">Birthday Party</option>
                        <option value="anniversary">Anniversary</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Selected Package
                      </label>
                      <select
                        value={formData.selectedPackage}
                        onChange={(e) =>
                          setFormData({ ...formData, selectedPackage: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">No package selected</option>
                        {cateringTiers.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.name} (${t.pricePerPerson}/person)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Additional Details
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
                      Submit Inquiry
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <a href={`tel:${contactInfo.phone}`}>
                        <Phone className="mr-2 h-5 w-5" />
                        Call Us
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
