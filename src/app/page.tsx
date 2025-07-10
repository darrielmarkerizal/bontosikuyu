import Hero from "@/components/hero";
import TransitionSection from "@/components/transition-section";
import VillageSection from "@/components/village-section";

export default function Home() {
  return (
    <div>
      <Hero />
      <VillageSection />
      <TransitionSection />
    </div>
  );
}
