import {
  Hero,
  Features,
  HowItWorksPreview,
  Testimonials,
  CTA,
  WelcomeOffer,
} from '@/components/sections';
import { DeliveryZoneChecker } from '@/components/delivery-zone-checker';

export default async function Home() {
  return (
    <>
      <Hero />
      <WelcomeOffer />
      <DeliveryZoneChecker />
      <Features />
      <HowItWorksPreview />
      <Testimonials />
      <CTA />
    </>
  );
}
