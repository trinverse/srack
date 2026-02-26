import {
  Hero,
  Features,
  HowItWorksPreview,
  Testimonials,
  CTA,
  WelcomeOffer,
  MenuDayCards,
  WhatsAppCTA,
} from '@/components/sections';
import { DeliveryZoneChecker } from '@/components/delivery-zone-checker';

export default async function Home() {
  return (
    <>
      <Hero />
      {/* <WelcomeOffer /> */}
      {/* <HowItWorksPreview /> */}
      <Features />
      <MenuDayCards />
      <DeliveryZoneChecker />
      {/* <Testimonials /> */}
      <WhatsAppCTA />
      {/* <CTA /> */}
    </>
  );
}
