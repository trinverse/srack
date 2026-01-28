import {
  Hero,
  Features,
  MenuPreview,
  HowItWorksPreview,
  Testimonials,
  CTA,
  WelcomeOffer,
} from '@/components/sections';
import { DeliveryZoneChecker } from '@/components/delivery-zone-checker';

export default function Home() {
  return (
    <>
      <Hero />
      <WelcomeOffer />
      <DeliveryZoneChecker />
      <Features />
      <MenuPreview />
      <HowItWorksPreview />
      <Testimonials />
      <CTA />
    </>
  );
}
