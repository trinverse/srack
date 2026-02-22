import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  sendNotification,
  buildOrderConfirmationEmail,
  buildOrderConfirmationSms,
} from '@/lib/notifications';

/**
 * POST /api/notifications/order-confirmation
 * Sends email + SMS confirmation after an order is placed.
 *
 * Body: { orderId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Fetch order with customer and items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        customers (id, full_name, email, phone, email_opt_in, sms_opt_in),
        order_items (item_name, quantity, size, total_price),
        pickup_locations (name, address, city)
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('[Notification] Order not found:', orderError);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const customer = order.customers as {
      id: string;
      full_name: string;
      email: string;
      phone: string | null;
      email_opt_in: boolean | null;
      sms_opt_in: boolean | null;
    } | null;

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Build delivery address string
    const deliveryAddress = order.shipping_street_address
      ? `${order.shipping_street_address}${order.shipping_apartment ? `, ${order.shipping_apartment}` : ''}, ${order.shipping_city}, ${order.shipping_state} ${order.shipping_zip_code}`
      : undefined;

    // Build pickup location string
    const pickupInfo = order.pickup_locations as { name: string; address: string; city: string } | null;
    const pickupLocation = pickupInfo
      ? `${pickupInfo.name} — ${pickupInfo.address}, ${pickupInfo.city}`
      : undefined;

    // Build email
    const emailData = buildOrderConfirmationEmail({
      customerName: customer.full_name,
      orderNumber: order.order_number,
      orderId: order.id,
      orderType: order.order_type as 'delivery' | 'pickup',
      orderDay: order.order_day,
      orderDate: order.order_date || '',
      items: (order.order_items as { item_name: string; quantity: number; size: string | null; total_price: number }[]).map((item) => ({
        name: item.item_name,
        quantity: item.quantity,
        size: item.size,
        totalPrice: item.total_price,
      })),
      subtotal: order.subtotal,
      tax: order.tax ?? 0,
      discountAmount: order.discount_amount ?? 0,
      total: order.total,
      deliveryAddress,
      pickupLocation,
      isGift: order.is_gift || false,
      recipientName: order.recipient_name || undefined,
    });

    // Build SMS
    const smsBody = buildOrderConfirmationSms({
      customerName: customer.full_name,
      orderNumber: order.order_number,
      orderType: order.order_type,
      orderDay: order.order_day,
      total: order.total,
    });

    // Send both notifications
    const result = await sendNotification({
      email: {
        to: customer.email,
        subject: emailData.subject,
        html: emailData.html,
      },
      sms: customer.phone
        ? { to: customer.phone, body: smsBody }
        : undefined,
      emailOptIn: customer.email_opt_in ?? true,
      smsOptIn: customer.sms_opt_in ?? true,
    });

    return NextResponse.json({
      success: true,
      email: result.email,
      sms: result.sms,
    });
  } catch (err) {
    console.error('[Notification] Error:', err);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
