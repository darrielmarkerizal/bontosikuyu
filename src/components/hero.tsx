import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
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
        {/* Dark Overlay - Made darker for better visibility */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-brand-primary/20 backdrop-blur-sm rounded-full border border-brand-primary/40 shadow-lg">
            <span className="text-sm font-medium text-brand-primary">
              Selamat Datang
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white drop-shadow-lg">
            Website Resmi
            <br />
            <span className="text-brand-primary drop-shadow-lg">
              Desa Laiyolo Baru
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Membangun masa depan yang lebih baik melalui inovasi teknologi dan
            pelayanan digital untuk masyarakat Desa Laiyolo Baru
          </p>

          {/* Description */}
          <p className="text-lg text-gray-100 max-w-2xl mx-auto drop-shadow-md">
            Portal informasi terpadu yang menyediakan layanan deteksi stunting
            berbasis AI, artikel kesehatan, dan berbagai informasi penting untuk
            kemajuan desa
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-brand-primary text-brand-secondary hover:bg-white hover:text-brand-secondary px-8 py-4 text-lg font-semibold shadow-xl transition-colors duration-300"
            >
              Mulai Deteksi Stunting
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-brand-primary bg-brand-primary/10 text-brand-primary hover:bg-white hover:text-brand-secondary px-8 py-4 text-lg font-semibold backdrop-blur-sm shadow-xl transition-colors duration-300"
            >
              Jelajahi Artikel
            </Button>
          </div>

          {/* Features Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="text-center space-y-2 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-brand-primary/40 transition-colors">
              <div className="w-12 h-12 bg-brand-accent/30 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <span className="text-brand-accent font-bold text-xl">🏥</span>
              </div>
              <h3 className="font-semibold text-lg text-white">
                AI Deteksi Stunting
              </h3>
              <p className="text-gray-100 text-sm">
                Teknologi canggih untuk deteksi dini stunting pada anak
              </p>
            </div>

            <div className="text-center space-y-2 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-brand-primary/40 transition-colors">
              <div className="w-12 h-12 bg-brand-primary/30 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <span className="text-brand-primary font-bold text-xl">📚</span>
              </div>
              <h3 className="font-semibold text-lg text-white">
                Artikel Kesehatan
              </h3>
              <p className="text-gray-100 text-sm">
                Informasi terpercaya seputar kesehatan dan gizi anak
              </p>
            </div>

            <div className="text-center space-y-2 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-brand-primary/40 transition-colors">
              <div className="w-12 h-12 bg-brand-secondary/30 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <span className="text-brand-secondary font-bold text-xl">
                  🌟
                </span>
              </div>
              <h3 className="font-semibold text-lg text-white">
                Pelayanan Digital
              </h3>
              <p className="text-gray-100 text-sm">
                Kemudahan akses informasi dan layanan desa online
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm text-white drop-shadow-lg">
            Scroll untuk melihat lebih banyak
          </span>
          <div className="w-6 h-6 border-2 border-brand-primary rounded-full flex items-center justify-center shadow-lg">
            <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
