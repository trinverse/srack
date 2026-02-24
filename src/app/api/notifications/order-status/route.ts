import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  sendNotification,
  buildOrderStatusEmail,
  buildOrderStatusSms,
} from '@/lib/notifications';

/**
 * POST /api/notifications/order-status
 * Sends email + SMS when an order status changes.
 *
 * Body: { orderId: string, newStatus: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { orderId, newStatus } = await request.json();

    if (!orderId || !newStatus) {
      return NextResponse.json(
        { error: 'orderId and newStatus are required' },
        { status: 400 }
      );
    }

    // Skip notification for 'pending' status (handled by order-confirmation)
    if (newStatus === 'pending') {
      return NextResponse.json({ success: true, skipped: true, reason: 'pending status uses order-confirmation' });
    }

    const supabase = await createClient();

    // Fetch order with customer
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        customers (id, full_name, email, phone, email_opt_in, sms_opt_in),
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
    const emailData = buildOrderStatusEmail({
      customerName: customer.full_name,
      orderNumber: order.order_number,
      orderId: order.id,
      newStatus,
      orderType: order.order_type as 'delivery' | 'pickup',
      orderDay: order.order_day,
      deliveryAddress,
      pickupLocation,
    });

    // Build SMS
    const smsBody = buildOrderStatusSms({
      customerName: customer.full_name,
      orderNumber: order.order_number,
      newStatus,
      orderType: order.order_type,
    });

    // Send notifications (email may be null if status doesn't have a template)
    const result = await sendNotification({
      email: emailData
        ? { to: customer.email, subject: emailData.subject, html: emailData.html }
        : undefined,
      sms: smsBody && customer.phone
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
