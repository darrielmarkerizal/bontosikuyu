import Hero from "@/components/hero";
import TransitionSection from "@/components/transition-section";
import VillageSection from "@/components/village-section";
import ArticlesSection from "@/components/articles-section";

export default function Home() {
  return (
    <div>
      <Hero />
      <VillageSection />
      <TransitionSection />
      <ArticlesSection />
    </div>
  );
}
