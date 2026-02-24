/**
 * Notification Service for The Spice Rack Atlanta
 *
 * Sends email (via Resend) and SMS (via Twilio) notifications
 * for order lifecycle events. Respects customer preferences
 * (email_opt_in, sms_opt_in) from the customers table.
 *
 * Environment variables required:
 *   - RESEND_API_KEY          — Resend API key
 *   - FROM_EMAIL              — Sender email address (default: orders@thespicerackatlanta.com)
 *   - TWILIO_ACCOUNT_SID      — Twilio Account SID
 *   - TWILIO_AUTH_TOKEN        — Twilio Auth Token
 *   - TWILIO_PHONE_NUMBER      — Twilio sender phone number (E.164 format)
 *   - NEXT_PUBLIC_SITE_URL     — Site URL for links in emails
 */

export { sendEmail, buildOrderConfirmationEmail, buildOrderStatusEmail, buildOrderReminderEmail } from './email';
export type { OrderConfirmationData, OrderStatusUpdateData, OrderReminderData, EmailPayload } from './email';

export { sendSms, buildOrderConfirmationSms, buildOrderStatusSms, buildOrderReminderSms } from './sms';
export type { SmsPayload } from './sms';

// ─── Unified Notification Sender ────────────────────────────────────────

import { sendEmail } from './email';
import { sendSms } from './sms';

export interface NotificationResult {
  email: { success: boolean; messageId?: string; error?: string } | null;
  sms: { success: boolean; messageSid?: string; error?: string } | null;
}

/**
 * Send both email and SMS notifications in parallel.
 * Respects opt-in preferences. Never throws — returns results for each channel.
 */
export async function sendNotification(options: {
  email?: { to: string; subject: string; html: string };
  sms?: { to: string; body: string };
  emailOptIn?: boolean;
  smsOptIn?: boolean;
}): Promise<NotificationResult> {
  const results: NotificationResult = { email: null, sms: null };

  const promises: Promise<void>[] = [];

  // Send email if opted in (default true if preference not set)
  if (options.email && (options.emailOptIn !== false)) {
    promises.push(
      sendEmail({
        to: options.email.to,
        subject: options.email.subject,
        html: options.email.html,
      }).then((result) => {
        results.email = result;
      })
    );
  }

  // Send SMS if opted in AND phone number provided
  if (options.sms && options.sms.to && (options.smsOptIn !== false)) {
    promises.push(
      sendSms({
        to: options.sms.to,
        body: options.sms.body,
      }).then((result) => {
        results.sms = result;
      })
    );
  }

  await Promise.allSettled(promises);

  return results;
}
