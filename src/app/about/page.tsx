'use client';

import { motion } from 'framer-motion';
import { Heart, Leaf, Users, Award, ChefHat, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const values = [
  {
    icon: Clock,
    title: 'Freshly Cooked on Delivery Day',
    description:
      'Every meal is prepared the same day it\u2019s delivered for peak freshness and taste.',
  },
  {
    icon: Leaf,
    title: 'No Frozen or Canned Ingredients',
    description:
      'We use freshly cut vegetables, natural herbs, and whole spices to retain full flavor and nutrition.',
  },
  {
    icon: Heart,
    title: 'No Artificial Colours or Flavour Enhancers',
    description:
      'Our meals are naturally delicious, made without shortcuts.',
  },
  {
    icon: ChefHat,
    title: 'Mindful Cooking',
    description:
      'Our dishes are balanced and thoughtfully prepared\u2014never overloaded with salt, oil, or ghee.',
  },
];


export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald/5 to-gold/5">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Welcome to The Spice Rack, Atlanta, where authentic Indian home-style cooking
              meets professional care and quality. Since 2014, we&apos;ve been proudly serving
              fresh, wholesome meals prepared by licensed culinary professionals. Our rotating
              menu offers something new each week, so you&apos;ll never get bored of eating well.
              We deliver twice a week&mdash;Mondays and Thursdays&mdash;ensuring every dish
              arrives fresh and ready to enjoy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6">From Our Kitchen to Yours</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  What started as cooking for friends and neighbors has grown into Atlanta&apos;s
                  trusted tiffin service. We understand the struggle of working families who
                  want nutritious, home-style Indian food but don&apos;t have time to cook.
                </p>
                <p>
                  Our kitchen follows the principles that have guided Indian home cooking for
                  generations: fresh ingredients, balanced spices, and meals made with care.
                  We never use frozen foods, artificial colors, or flavor enhancers.
                </p>
                <p>
                  Every Monday and Thursday, our team wakes up early to prepare your meals
                  fresh. By the time your order reaches your door, it&apos;s ready to serve—just
                  like coming home to a meal cooked by family.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-emerald/20 to-gold/20 rounded-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <ChefHat className="w-24 h-24 text-emerald mx-auto mb-4" />
                  <p className="text-lg font-medium">Cooking with Tradition</p>
                  <p className="text-muted-foreground">Since 2014</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">What Sets Us Apart</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              At The Spice Rack, we focus on purity, tradition, and health.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="pt-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald/10 mb-4">
                      <value.icon className="w-7 h-7 text-emerald" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-2 md:order-1"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-emerald/10 rounded-xl text-center">
                  <Users className="w-8 h-8 text-emerald mx-auto mb-2" />
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-muted-foreground">Happy Families</div>
                </div>
                <div className="p-6 bg-gold/10 rounded-xl text-center">
                  <Award className="w-8 h-8 text-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold">4.9</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                <div className="p-6 bg-spice/10 rounded-xl text-center col-span-2">
                  <Heart className="w-8 h-8 text-spice mx-auto mb-2" />
                  <div className="text-2xl font-bold">10,000+</div>
                  <div className="text-sm text-muted-foreground">Meals Delivered</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="order-1 md:order-2"
            >
              <h2 className="text-3xl font-bold mb-6">Why Atlanta Trusts Us</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We&apos;re not just another meal delivery service. We&apos;re your extended kitchen,
                  preparing meals the way your grandmother would—with love, patience, and
                  authentic recipes.
                </p>
                <p>
                  Our customers keep coming back because they taste the difference. No
                  shortcuts, no compromises—just honest, wholesome Indian food that nourishes
                  body and soul.
                </p>
              </div>
              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href="/menu">Try Our Food</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-emerald to-emerald/80">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Taste the Difference?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Join hundreds of Atlanta families enjoying authentic, home-style Indian meals
              delivered fresh twice a week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/menu">View This Week&apos;s Menu</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                <Link href="/how-it-works">Learn How It Works</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
