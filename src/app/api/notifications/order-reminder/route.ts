import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  sendNotification,
  buildOrderReminderEmail,
  buildOrderReminderSms,
} from '@/lib/notifications';

/**
 * POST /api/notifications/order-reminder
 * Sends delivery/pickup reminders for orders scheduled today.
 *
 * This endpoint can be called by a cron job (e.g., Vercel Cron)
 * or manually from the admin panel.
 *
 * Body: { orderId?: string }
 *   - If orderId is provided, sends reminder for that specific order
 *   - If not provided, sends reminders for ALL orders scheduled today
 *     with status 'ready' or 'in_progress'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { orderId } = body;

    const supabase = await createClient();

    let orders;

    if (orderId) {
      // Send reminder for a specific order
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers (id, full_name, email, phone, email_opt_in, sms_opt_in),
          pickup_locations (name, address, city, pickup_time)
        `)
        .eq('id', orderId)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      orders = [data];
    } else {
      // Send reminders for all orders scheduled for today
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers (id, full_name, email, phone, email_opt_in, sms_opt_in),
          pickup_locations (name, address, city, pickup_time)
        `)
        .eq('order_date', today)
        .in('status', ['in_progress', 'ready']);

      if (error) {
        console.error('[Reminder] Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
      }

      orders = data || [];
    }

    const results = [];

    for (const order of orders) {
      const customer = order.customers as {
        id: string;
        full_name: string;
        email: string;
        phone: string | null;
        email_opt_in: boolean | null;
        sms_opt_in: boolean | null;
      } | null;

      if (!customer) continue;

      // Build delivery address string
      const deliveryAddress = order.shipping_street_address
        ? `${order.shipping_street_address}${order.shipping_apartment ? `, ${order.shipping_apartment}` : ''}, ${order.shipping_city}, ${order.shipping_state} ${order.shipping_zip_code}`
        : undefined;

      // Build pickup location info
      const pickupInfo = order.pickup_locations as { name: string; address: string; city: string; pickup_time: string | null } | null;
      const pickupLocation = pickupInfo
        ? `${pickupInfo.name} — ${pickupInfo.address}, ${pickupInfo.city}`
        : undefined;

      // Build email
      const emailData = buildOrderReminderEmail({
        customerName: customer.full_name,
        orderNumber: order.order_number,
        orderId: order.id,
        orderType: order.order_type as 'delivery' | 'pickup',
        orderDay: order.order_day,
        orderDate: order.order_date || '',
        deliveryAddress,
        pickupLocation,
        pickupTime: pickupInfo?.pickup_time || undefined,
      });

      // Build SMS
      const smsBody = buildOrderReminderSms({
        customerName: customer.full_name,
        orderNumber: order.order_number,
        orderType: order.order_type,
        pickupLocation: pickupInfo?.name,
        pickupTime: pickupInfo?.pickup_time || undefined,
      });

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

      results.push({
        orderId: order.id,
        orderNumber: order.order_number,
        email: result.email,
        sms: result.sms,
      });
    }

    return NextResponse.json({
      success: true,
      reminders_sent: results.length,
      results,
    });
  } catch (err) {
    console.error('[Reminder] Error:', err);
    return NextResponse.json(
      { error: 'Failed to send reminders' },
      { status: 500 }
    );
  }
}
