import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/landing/Hero";
import { FeaturesBento } from "@/components/landing/FeaturesBento";
import { CTA } from "@/components/landing/CTA";

export default function HomePage() {
  return (
    <>
      <Navbar landing />
      <main className="relative">
        <Hero />
        <FeaturesBento />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
