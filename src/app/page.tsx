import {
  Hero,
  Features,
  MenuPreview,
  HowItWorksPreview,
  Testimonials,
  CTA,
} from '@/components/sections';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <MenuPreview />
      <HowItWorksPreview />
      <Testimonials />
      <CTA />
    </>
  );
}
