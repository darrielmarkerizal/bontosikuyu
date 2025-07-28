import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { ArrowRight, Stethoscope } from "lucide-react";

export default function Hero() {
  return (
    <main>
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://picsum.photos/1920/1080?random=1"
            alt="Desa Laiyolo Baru"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Welcome Badge */}
            <BoxReveal
              boxColor="#F8B72C"
              duration={0.6}
              width="fit-content"
              textAlign="center"
            >
              <div className="inline-flex items-center px-6 py-3 bg-brand-primary/20 backdrop-blur-sm rounded-full border border-brand-primary/40 shadow-lg">
                <span className="text-sm font-medium text-brand-primary font-plus-jakarta-sans tracking-wide uppercase">
                  Selamat Datang
                </span>
              </div>
            </BoxReveal>

            {/* Main Heading */}
            <BoxReveal
              boxColor="#F8B72C"
              duration={0.6}
              width="100%"
              textAlign="center"
            >
              <div className="space-y-2">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-sentient font-bold leading-[0.9] text-white drop-shadow-lg">
                  Website Resmi
                </h1>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-sentient font-bold leading-[0.9] text-brand-primary drop-shadow-lg">
                  Desa Laiyolo Baru
                </h1>
              </div>
            </BoxReveal>

            {/* Description */}
            <BoxReveal
              boxColor="#F8B72C"
              duration={0.6}
              width="100%"
              textAlign="center"
            >
              <p className="text-lg md:text-xl lg:text-2xl font-plus-jakarta-sans font-light text-gray-100 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
                Membangun masa depan yang lebih baik melalui inovasi teknologi
                dan pelayanan digital untuk masyarakat Desa Laiyolo Baru
              </p>
            </BoxReveal>

            {/* Call to Action Buttons */}
            <BoxReveal
              boxColor="#F8B72C"
              duration={0.6}
              width="fit-content"
              textAlign="center"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                {/* Primary CTA - Deteksi Stunting */}
                <Link href="/stunting">
                  <Button
                    size="lg"
                    className="bg-brand-primary text-brand-secondary hover:bg-white hover:text-brand-secondary px-8 py-4 text-lg font-plus-jakarta-sans font-semibold shadow-xl transition-all duration-300 group w-full sm:w-auto"
                  >
                    <Stethoscope className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    Mulai Deteksi Stunting
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>

                {/* Secondary CTA - Artikel */}
                <Link href="/artikel">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-brand-primary bg-brand-primary/10 text-brand-primary hover:bg-white hover:text-brand-secondary px-8 py-4 text-lg font-plus-jakarta-sans font-medium backdrop-blur-sm shadow-xl transition-all duration-300 group w-full sm:w-auto"
                  >
                    Jelajahi Artikel
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </BoxReveal>

            {/* Additional Info */}
            <BoxReveal
              boxColor="#21BCA8"
              duration={0.8}
              width="100%"
              textAlign="center"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-300 font-plus-jakarta-sans pt-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                  <span>AI Deteksi Stunting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                  <span>Artikel Kesehatan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                  <span>Informasi Desa</span>
                </div>
              </div>
            </BoxReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
