import { Resend } from 'resend';

// Initialize Resend client - will be undefined if env var not set (safe for build)
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'The Spice Rack Atlanta <orders@thespicerackatlanta.com>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thespicerackatlanta.com';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Send an email via Resend
 * Returns { success, messageId } or { success: false, error }
 */
export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!resend) {
    console.warn('[Email] Resend not configured — RESEND_API_KEY missing. Email not sent.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      replyTo: payload.replyTo || 'hello@thespicerackatlanta.com',
    });

    if (error) {
      console.error('[Email] Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('[Email] Sent successfully:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('[Email] Unexpected error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ─── Email Template Helpers ─────────────────────────────────────────────

function baseLayout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Spice Rack Atlanta</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background-color:#ffffff;">
    <!-- Header -->
    <div style="background-color:#0A7B5C;padding:24px 32px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">The Spice Rack Atlanta</h1>
      <p style="margin:4px 0 0;color:#D4A853;font-size:14px;">Tiffin &amp; Catering Services</p>
    </div>

    <!-- Content -->
    <div style="padding:32px;">
      ${content}
    </div>

    <!-- Footer -->
    <div style="background-color:#f3f4f6;padding:24px 32px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">
        The Spice Rack Atlanta | Freshly made Indian meals
      </p>
      <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">
        <a href="${SITE_URL}" style="color:#0A7B5C;text-decoration:none;">Visit our website</a>
        &nbsp;&middot;&nbsp;
        <a href="mailto:hello@thespicerackatlanta.com" style="color:#0A7B5C;text-decoration:none;">Contact us</a>
      </p>
      <p style="margin:0;color:#9ca3af;font-size:11px;">
        You received this email because you placed an order with The Spice Rack Atlanta.
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ─── Order Confirmation Email ───────────────────────────────────────────

export interface OrderConfirmationData {
  customerName: string;
  orderNumber: string;
  orderId: string;
  orderType: 'delivery' | 'pickup';
  orderDay: string;
  orderDate: string;
  items: { name: string; quantity: number; size: string | null; totalPrice: number }[];
  subtotal: number;
  tax: number;
  discountAmount: number;
  total: number;
  deliveryAddress?: string;
  pickupLocation?: string;
  isGift?: boolean;
  recipientName?: string;
}

export function buildOrderConfirmationEmail(data: OrderConfirmationData): { subject: string; html: string } {
  const itemRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#374151;">
          ${item.quantity}x ${item.name}${item.size ? ` (${item.size})` : ''}
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#374151;text-align:right;">
          $${item.totalPrice.toFixed(2)}
        </td>
      </tr>`
    )
    .join('');

  const locationInfo =
    data.orderType === 'delivery'
      ? `<p style="margin:0;color:#374151;"><strong>Delivery to:</strong> ${data.deliveryAddress}</p>`
      : `<p style="margin:0;color:#374151;"><strong>Pickup at:</strong> ${data.pickupLocation}</p>`;

  const giftBanner = data.isGift
    ? `<div style="background-color:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:12px 16px;margin-bottom:20px;">
        <p style="margin:0;color:#92400e;font-size:14px;">🎁 <strong>Gift Order</strong> — For ${data.recipientName}</p>
       </div>`
    : '';

  const content = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;">Order Confirmed!</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:16px;">
      Thank you, ${data.customerName}! We've received your order.
    </p>

    ${giftBanner}

    <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:24px;">
      <p style="margin:0 0 4px;color:#166534;font-size:14px;font-weight:600;">Order #${data.orderNumber}</p>
      <p style="margin:0 0 4px;color:#166534;font-size:14px;">
        📅 <strong>${data.orderDay.charAt(0).toUpperCase() + data.orderDay.slice(1)}</strong> — ${data.orderDate}
      </p>
      <p style="margin:0;color:#166534;font-size:14px;">
        ${data.orderType === 'delivery' ? '🚚 Delivery' : '📍 Pickup'}
      </p>
    </div>

    ${locationInfo}

    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      <thead>
        <tr>
          <th style="text-align:left;padding:8px 0;border-bottom:2px solid #0A7B5C;color:#0A7B5C;font-size:14px;">Item</th>
          <th style="text-align:right;padding:8px 0;border-bottom:2px solid #0A7B5C;color:#0A7B5C;font-size:14px;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>

    <div style="border-top:2px solid #e5e7eb;padding-top:12px;">
      <table style="width:100%;">
        <tr>
          <td style="padding:4px 0;color:#6b7280;font-size:14px;">Subtotal</td>
          <td style="padding:4px 0;color:#374151;font-size:14px;text-align:right;">$${data.subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6b7280;font-size:14px;">Tax</td>
          <td style="padding:4px 0;color:#374151;font-size:14px;text-align:right;">$${data.tax.toFixed(2)}</td>
        </tr>
        ${
          data.discountAmount > 0
            ? `<tr>
                <td style="padding:4px 0;color:#0A7B5C;font-size:14px;">Discount</td>
                <td style="padding:4px 0;color:#0A7B5C;font-size:14px;text-align:right;">-$${data.discountAmount.toFixed(2)}</td>
               </tr>`
            : ''
        }
        <tr>
          <td style="padding:8px 0;color:#111827;font-size:18px;font-weight:700;">Total</td>
          <td style="padding:8px 0;color:#0A7B5C;font-size:18px;font-weight:700;text-align:right;">$${data.total.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    <div style="margin-top:24px;text-align:center;">
      <a href="${SITE_URL}/orders/${data.orderId}/confirmation"
         style="display:inline-block;background-color:#0A7B5C;color:#ffffff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">
        View Order Details
      </a>
    </div>

    <div style="margin-top:32px;padding:16px;background-color:#fafafa;border-radius:8px;">
      <h3 style="margin:0 0 8px;color:#374151;font-size:15px;">What happens next?</h3>
      <ol style="margin:0;padding-left:20px;color:#6b7280;font-size:14px;line-height:1.8;">
        <li>Our kitchen will prepare your meal fresh on ${data.orderDay}</li>
        <li>You'll get a notification when your order is being prepared</li>
        <li>Another notification when it's ready for ${data.orderType === 'delivery' ? 'delivery' : 'pickup'}</li>
      </ol>
    </div>
  `;

  return {
    subject: `Order Confirmed! #${data.orderNumber} — The Spice Rack Atlanta`,
    html: baseLayout(content),
  };
}

// ─── Order Status Update Email ──────────────────────────────────────────

export interface OrderStatusUpdateData {
  customerName: string;
  orderNumber: string;
  orderId: string;
  newStatus: string;
  orderType: 'delivery' | 'pickup';
  orderDay: string;
  deliveryAddress?: string;
  pickupLocation?: string;
}

const STATUS_MESSAGES: Record<string, { emoji: string; title: string; description: string; color: string; bgColor: string }> = {
  in_progress: {
    emoji: '👨‍🍳',
    title: 'Your Order is Being Prepared!',
    description: 'Our kitchen is now cooking your fresh meal with love and care.',
    color: '#1d4ed8',
    bgColor: '#dbeafe',
  },
  ready: {
    emoji: '✅',
    title: 'Your Order is Ready!',
    description: 'Your meal is packed and ready to go.',
    color: '#166534',
    bgColor: '#dcfce7',
  },
  completed: {
    emoji: '🎉',
    title: 'Order Delivered!',
    description: 'We hope you enjoy your meal. We\'d love to hear your feedback!',
    color: '#166534',
    bgColor: '#f0fdf4',
  },
  canceled: {
    emoji: '❌',
    title: 'Order Canceled',
    description: 'Your order has been canceled. If this was a mistake, please contact us right away.',
    color: '#991b1b',
    bgColor: '#fef2f2',
  },
  hold: {
    emoji: '⏸️',
    title: 'Order On Hold',
    description: 'Your order has been placed on hold. We\'ll reach out if we need any information from you.',
    color: '#9a3412',
    bgColor: '#fff7ed',
  },
};

export function buildOrderStatusEmail(data: OrderStatusUpdateData): { subject: string; html: string } | null {
  const statusInfo = STATUS_MESSAGES[data.newStatus];
  if (!statusInfo) return null; // Don't send email for 'pending' status

  const locationLine =
    data.orderType === 'delivery'
      ? `<p style="margin:8px 0 0;color:#374151;font-size:14px;">📍 <strong>Delivery to:</strong> ${data.deliveryAddress || 'Your saved address'}</p>`
      : `<p style="margin:8px 0 0;color:#374151;font-size:14px;">📍 <strong>Pickup at:</strong> ${data.pickupLocation || 'Selected location'}</p>`;

  const feedbackSection =
    data.newStatus === 'completed'
      ? `<div style="margin-top:24px;text-align:center;padding:20px;background-color:#fef3c7;border-radius:8px;">
          <p style="margin:0 0 12px;color:#92400e;font-size:16px;font-weight:600;">How was your meal?</p>
          <p style="margin:0 0 16px;color:#a16207;font-size:14px;">We'd love your feedback to keep improving.</p>
          <a href="${SITE_URL}/contact"
             style="display:inline-block;background-color:#D4A853;color:#ffffff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
            Share Feedback
          </a>
        </div>`
      : '';

  const contactSection =
    data.newStatus === 'canceled'
      ? `<div style="margin-top:20px;padding:16px;background-color:#fafafa;border-radius:8px;">
          <p style="margin:0;color:#6b7280;font-size:14px;">
            Need help? Reach us at <a href="mailto:hello@thespicerackatlanta.com" style="color:#0A7B5C;">hello@thespicerackatlanta.com</a>
            or call <a href="tel:4045550123" style="color:#0A7B5C;">(404) 555-0123</a>.
          </p>
        </div>`
      : '';

  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:48px;">${statusInfo.emoji}</span>
    </div>

    <h2 style="margin:0 0 8px;color:${statusInfo.color};font-size:22px;text-align:center;">${statusInfo.title}</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:16px;text-align:center;">${statusInfo.description}</p>

    <div style="background-color:${statusInfo.bgColor};border-radius:8px;padding:16px;margin-bottom:20px;">
      <p style="margin:0;color:${statusInfo.color};font-size:14px;font-weight:600;">Order #${data.orderNumber}</p>
      <p style="margin:4px 0 0;color:${statusInfo.color};font-size:14px;">
        ${data.orderDay.charAt(0).toUpperCase() + data.orderDay.slice(1)} ${data.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
      </p>
      ${locationLine}
    </div>

    <div style="text-align:center;margin-top:24px;">
      <a href="${SITE_URL}/orders/${data.orderId}/confirmation"
         style="display:inline-block;background-color:#0A7B5C;color:#ffffff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;">
        View Order
      </a>
    </div>

    ${feedbackSection}
    ${contactSection}
  `;

  return {
    subject: `${statusInfo.emoji} ${statusInfo.title} — Order #${data.orderNumber}`,
    html: baseLayout(content),
  };
}

// ─── Delivery/Pickup Reminder Email ─────────────────────────────────────

export interface OrderReminderData {
  customerName: string;
  orderNumber: string;
  orderId: string;
  orderType: 'delivery' | 'pickup';
  orderDay: string;
  orderDate: string;
  deliveryAddress?: string;
  pickupLocation?: string;
  pickupTime?: string;
}

export function buildOrderReminderEmail(data: OrderReminderData): { subject: string; html: string } {
  const isDelivery = data.orderType === 'delivery';

  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:48px;">${isDelivery ? '🚚' : '📍'}</span>
    </div>

    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;text-align:center;">
      ${isDelivery ? 'Delivery Reminder' : 'Pickup Reminder'}
    </h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:16px;text-align:center;">
      Hi ${data.customerName}, your order is ${isDelivery ? 'scheduled for delivery' : 'ready for pickup'} today!
    </p>

    <div style="background-color:#dbeafe;border:1px solid #93c5fd;border-radius:8px;padding:16px;margin-bottom:20px;">
      <p style="margin:0 0 4px;color:#1e40af;font-size:14px;font-weight:600;">Order #${data.orderNumber}</p>
      <p style="margin:0 0 4px;color:#1e40af;font-size:14px;">📅 ${data.orderDate}</p>
      ${
        isDelivery
          ? `<p style="margin:0;color:#1e40af;font-size:14px;">📍 ${data.deliveryAddress}</p>`
          : `<p style="margin:0;color:#1e40af;font-size:14px;">📍 ${data.pickupLocation}</p>
             ${data.pickupTime ? `<p style="margin:4px 0 0;color:#1e40af;font-size:14px;">🕐 ${data.pickupTime}</p>` : ''}`
      }
    </div>

    ${
      isDelivery
        ? `<p style="color:#6b7280;font-size:14px;">Please make sure someone is available to receive the delivery at the address above.</p>`
        : `<p style="color:#6b7280;font-size:14px;">Please pick up your order at the location above during the specified time.</p>`
    }

    <div style="text-align:center;margin-top:24px;">
      <a href="${SITE_URL}/orders/${data.orderId}/confirmation"
         style="display:inline-block;background-color:#0A7B5C;color:#ffffff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;">
        View Order
      </a>
    </div>
  `;

  return {
    subject: `⏰ ${isDelivery ? 'Delivery' : 'Pickup'} Reminder — Order #${data.orderNumber}`,
    html: baseLayout(content),
  };
}
