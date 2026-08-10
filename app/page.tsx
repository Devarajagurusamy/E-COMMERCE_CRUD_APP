import Hero from "@/components/Hero";
import FeaturesBar from "@/components/FeaturesBar";
import CategorySection from "@/components/CategorySection";
import NewArrivalsSection from "@/components/NewArrivalsSection";
import CollectionSection from "@/components/CollectionSection";
import TestimonialSection from "@/components/TestimonialSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-16">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. FEATURES / VALUE PROPOSITIONS BAR */}
      <FeaturesBar />

      {/* OTHER SECTIONS WITH SPACING */}
      <div className="space-y-8 sm:space-y-12 pt-6">
        {/* 3. SHOP BY CATEGORY SECTION */}
        <CategorySection />

        {/* 4. NEW ARRIVALS SECTION */}
        <NewArrivalsSection />

        {/* 5. COLLECTION SECTION (2 PREMIUM HORIZONTAL CARDS) */}
        <CollectionSection />

        {/* 6. TESTIMONIAL SECTION (ENDLESS LOOP ANIMATION) */}
        <TestimonialSection />
      </div>
    </main>
  );
}
