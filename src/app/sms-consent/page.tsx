import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SMS Consent & Terms | The Spice Rack Atlanta',
  description:
    'Learn about the SMS messages you may receive from The Spice Rack Atlanta, how to opt out, and your rights.',
};

export default function SmsConsentPage() {
  return (
    <div className="pt-20 min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">SMS Messaging Terms</h1>
        <p className="text-muted-foreground mb-8">
          The Spice Rack Atlanta &mdash; SMS Consent &amp; Disclosure
        </p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-2">What messages will I receive?</h2>
            <p>
              When you opt in to SMS notifications from The Spice Rack Atlanta, you may receive
              text messages related to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Order confirmations</li>
              <li>Delivery status updates and reminders</li>
              <li>Pickup notifications</li>
              <li>Order deadline reminders</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Message frequency</h2>
            <p>
              Message frequency varies. You will typically receive 2&ndash;4 messages per order
              placed. You will not receive marketing or promotional messages unless you separately
              opt in to those.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Message and data rates</h2>
            <p>
              Message and data rates may apply. Please contact your wireless carrier for details
              about your messaging plan.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">How to opt out</h2>
            <p>
              You can opt out of SMS messages at any time by replying <strong>STOP</strong> to any
              message you receive from us. After opting out, you will receive one final confirmation
              message and no further texts.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">How to get help</h2>
            <p>
              If you need assistance, reply <strong>HELP</strong> to any message or contact us at{' '}
              <a
                href="mailto:hello@thespicerackatlanta.com"
                className="text-emerald hover:underline"
              >
                hello@thespicerackatlanta.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Consent language</h2>
            <p>
              During account creation you are asked to check a box with the following language:
            </p>
            <blockquote className="border-l-4 border-emerald/40 pl-4 py-2 mt-2 bg-muted/50 rounded-r-md text-muted-foreground italic">
              &ldquo;I agree to receive order updates and delivery notifications via SMS from The
              Spice Rack Atlanta. Message frequency varies. Msg &amp; data rates may apply. Reply
              STOP to opt out.&rdquo;
            </blockquote>
            <p className="mt-2">
              Consent is not a condition of purchase. You may create an account and place orders
              without opting in to SMS notifications.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Privacy</h2>
            <p>
              Your phone number and messaging preferences are stored securely and are never shared
              with third parties for marketing purposes. For more information, see our{' '}
              <Link href="/privacy" className="text-emerald hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Contact us</h2>
            <p>
              The Spice Rack Atlanta
              <br />
              <a
                href="mailto:hello@thespicerackatlanta.com"
                className="text-emerald hover:underline"
              >
                hello@thespicerackatlanta.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
