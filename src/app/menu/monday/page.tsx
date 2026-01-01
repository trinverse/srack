import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuItemCard } from '@/components/menu-item-card';
import { mondayMenu } from '@/data/menu';

export const metadata: Metadata = {
  title: 'Monday Menu',
  description: 'Fresh Indian meals delivered every Monday. Order by Saturday 6 PM.',
};

export default function MondayMenuPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-wide">
          <Link
            href="/menu"
            className="inline-flex items-center text-primary-foreground/80 hover:text-primary-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Link>
          <h1 className="text-primary-foreground mb-4">Monday Menu</h1>
          <div className="flex flex-wrap items-center gap-6 text-primary-foreground/80">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>Order by: {mondayMenu.orderDeadline}</span>
            </div>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{mondayMenu.items.length} items available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-16">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mondayMenu.items.map((item, index) => (
              <MenuItemCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Order CTA */}
      <section className="py-16 bg-secondary/50">
        <div className="container-tight text-center">
          <h3 className="mb-4">Ready to Order?</h3>
          <p className="text-muted-foreground mb-8">
            Remember to place your order by {mondayMenu.orderDeadline} for
            Monday delivery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg">Place Your Order</Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/menu/thursday">View Thursday Menu</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
