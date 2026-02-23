import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Order Confirmed',
};

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch order with items and pickup location
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*),
      pickup_locations (*)
    `)
    .eq('id', id)
    .single();

  if (error || !order) {
    notFound();
  }

  const orderDate = new Date(order.order_date);
  const formattedDate = orderDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-emerald/5 to-gold/5">
      <section className="py-16">
        <div className="container-wide max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald/10 mb-6">
              <CheckCircle className="w-10 h-10 text-emerald" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your order. We&apos;ll start preparing your delicious meal soon.
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6 pb-6 border-b">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="text-xl font-bold">{order.order_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold text-emerald">${order.total.toFixed(2)}</p>
                </div>
              </div>

              {/* Delivery/Pickup Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-emerald flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {order.order_day.charAt(0).toUpperCase() + order.order_day.slice(1)} Delivery
                    </p>
                    <p className="text-sm text-muted-foreground">{formattedDate}</p>
                  </div>
                </div>

                {order.order_type === 'delivery' ? (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-emerald flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Delivery Address</p>
                      <p className="text-sm text-muted-foreground">
                        {order.shipping_street_address}
                        {order.shipping_apartment && `, ${order.shipping_apartment}`}
                        <br />
                        {order.shipping_city}, {order.shipping_state} {order.shipping_zip_code}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-emerald flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Pickup Location</p>
                      {order.pickup_locations && (
                        <>
                          <p className="text-sm font-medium">{order.pickup_locations.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.pickup_locations.address}, {order.pickup_locations.city}
                          </p>
                          {order.pickup_locations.pickup_time && (
                            <p className="text-sm text-emerald flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {order.pickup_locations.pickup_time}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Order Items</h3>
                <div className="space-y-3">
                  {order.order_items.map((item: { id: string; quantity: number; item_name: string; size: string | null; total_price: number }) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.quantity}x {item.item_name}
                        {item.size && ` (${item.size})`}
                      </span>
                      <span className="font-medium">${item.total_price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${(order.tax ?? 0).toFixed(2)}</span>
                  </div>
                  {(order.discount_amount ?? 0) > 0 && (
                    <div className="flex justify-between text-sm text-emerald">
                      <span>Discount</span>
                      <span>-${(order.discount_amount ?? 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-emerald">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">What&apos;s Next?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald text-white text-xs font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Confirmation Email</p>
                    <p className="text-sm text-muted-foreground">
                      You&apos;ll receive an email confirmation with your order details.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald text-white text-xs font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Preparation</p>
                    <p className="text-sm text-muted-foreground">
                      Our chefs will prepare your fresh meal on {order.order_day}.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald text-white text-xs font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">
                      {order.order_type === 'delivery' ? 'Delivery' : 'Pickup'} Reminder
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.order_type === 'delivery'
                        ? "You'll receive a text reminder a few hours before delivery."
                        : "You'll receive pickup details including time and location."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/menu">
                Order More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/account">View All Orders</Link>
            </Button>
          </div>

          {/* Contact */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Questions about your order?{' '}
              <Link href="/contact" className="text-emerald hover:underline">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
