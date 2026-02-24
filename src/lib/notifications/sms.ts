import twilio from 'twilio';

// Lazy-initialize Twilio client to avoid crashing the module on invalid credentials
let twilioClient: ReturnType<typeof twilio> | null = null;
let twilioInitAttempted = false;

function getTwilioClient() {
  if (twilioInitAttempted) return twilioClient;
  twilioInitAttempted = true;

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;

  if (!sid || !token) return null;

  try {
    twilioClient = twilio(sid, token);
  } catch (err) {
    console.error('[SMS] Failed to initialize Twilio client:', err instanceof Error ? err.message : err);
  }

  return twilioClient;
}

const FROM_PHONE = process.env.TWILIO_PHONE_NUMBER || '';

export interface SmsPayload {
  to: string;
  body: string;
}

/**
 * Format a phone number to E.164 format for Twilio
 * Handles common US formats: (404) 555-0123, 404-555-0123, 4045550123
 */
function formatPhoneNumber(phone: string): string {
  // Strip all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // If already has country code (11 digits starting with 1)
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  // US number (10 digits) — add +1
  if (digits.length === 10) {
    return `+1${digits}`;
  }

  // Already in E.164 format
  if (phone.startsWith('+')) {
    return phone;
  }

  // Return as-is with +1 prefix as best guess
  return `+1${digits}`;
}

/**
 * Send an SMS via Twilio
 * Returns { success, messageSid } or { success: false, error }
 */
export async function sendSms(payload: SmsPayload): Promise<{ success: boolean; messageSid?: string; error?: string }> {
  const client = getTwilioClient();
  if (!client) {
    console.warn('[SMS] Twilio not configured — missing or invalid credentials. SMS not sent.');
    return { success: false, error: 'SMS service not configured' };
  }

  if (!FROM_PHONE) {
    console.warn('[SMS] TWILIO_PHONE_NUMBER not set. SMS not sent.');
    return { success: false, error: 'SMS sender number not configured' };
  }

  try {
    const message = await client.messages.create({
      body: payload.body,
      from: FROM_PHONE,
      to: formatPhoneNumber(payload.to),
    });

    console.log('[SMS] Sent successfully:', message.sid);
    return { success: true, messageSid: message.sid };
  } catch (err) {
    console.error('[SMS] Twilio error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ─── SMS Message Templates ──────────────────────────────────────────────

export function buildOrderConfirmationSms(data: {
  customerName: string;
  orderNumber: string;
  orderType: string;
  orderDay: string;
  total: number;
}): string {
  return `Hi ${data.customerName}! Your Spice Rack order #${data.orderNumber} is confirmed. ${data.orderType === 'delivery' ? 'Delivery' : 'Pickup'} on ${data.orderDay.charAt(0).toUpperCase() + data.orderDay.slice(1)}. Total: $${data.total.toFixed(2)}. Thank you!`;
}

export function buildOrderStatusSms(data: {
  customerName: string;
  orderNumber: string;
  newStatus: string;
  orderType: string;
}): string | null {
  const messages: Record<string, string> = {
    in_progress: `Hi ${data.customerName}! Your Spice Rack order #${data.orderNumber} is now being prepared by our kitchen. Fresh & hot coming your way!`,
    ready: `Hi ${data.customerName}! Your order #${data.orderNumber} is ready${data.orderType === 'delivery' ? ' and out for delivery!' : ' for pickup!'}`,
    completed: `Hi ${data.customerName}! Your order #${data.orderNumber} has been delivered. Enjoy your meal! We'd love your feedback.`,
    canceled: `Hi ${data.customerName}, your order #${data.orderNumber} has been canceled. Questions? Reply to this message or call (404) 555-0123.`,
    hold: `Hi ${data.customerName}, your order #${data.orderNumber} is on hold. We may reach out for more info. Questions? Call (404) 555-0123.`,
  };

  return messages[data.newStatus] || null;
}

export function buildOrderReminderSms(data: {
  customerName: string;
  orderNumber: string;
  orderType: string;
  pickupLocation?: string;
  pickupTime?: string;
}): string {
  if (data.orderType === 'pickup') {
    return `Reminder: Your Spice Rack order #${data.orderNumber} is ready for pickup today${data.pickupLocation ? ` at ${data.pickupLocation}` : ''}${data.pickupTime ? ` (${data.pickupTime})` : ''}. See you soon!`;
  }
  return `Reminder: Your Spice Rack order #${data.orderNumber} is scheduled for delivery today. Please ensure someone is available to receive it!`;
}
