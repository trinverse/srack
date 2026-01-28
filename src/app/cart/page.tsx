'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';

export default function CartPage() {
  const { state, removeItem, updateQuantity, clearCart, meetsMinimum, minimumOrderAmount } = useCart();
  const { user } = useAuth();

  if (state.isLoading) {
    return (
      <div className="pt-20">
        <div className="container-wide py-16 text-center">
          <div className="animate-pulse">Loading cart...</div>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="pt-20">
        <section className="py-16">
          <div className="container-wide text-center max-w-lg mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
              Browse our delicious menu and start your order!
            </p>
            <Button asChild size="lg">
              <Link href="/menu">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse Menu
              </Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

  const taxRate = 0.08; // 8% tax
  const tax = state.subtotal * taxRate;
  const total = state.subtotal + tax;

  return (
    <div className="pt-20">
      <section className="py-12">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Your Cart</h1>
                <p className="text-muted-foreground">
                  {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'}
                </p>
              </div>
              <Button variant="outline" onClick={clearCart}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {state.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">{item.menuItem.name}</h3>
                                {item.size && (
                                  <span className="text-sm text-muted-foreground">
                                    Size: {item.size}
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-emerald">
                                  ${item.totalPrice.toFixed(2)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  ${item.unitPrice.toFixed(2)} each
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center border rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-2 hover:bg-muted transition-colors"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-2 hover:bg-muted transition-colors"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                <div className="pt-4">
                  <Button variant="outline" asChild>
                    <Link href="/menu">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${state.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-emerald">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {!meetsMinimum && (
                      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium">Minimum order not met</p>
                          <p>Add ${(minimumOrderAmount - state.subtotal).toFixed(2)} more to reach the ${minimumOrderAmount} minimum.</p>
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      size="lg"
                      disabled={!meetsMinimum}
                      asChild
                    >
                      <Link href={user ? '/checkout' : '/login?redirect=/checkout'}>
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                    {!user && (
                      <p className="text-center text-sm text-muted-foreground">
                        You&apos;ll need to sign in to checkout
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
