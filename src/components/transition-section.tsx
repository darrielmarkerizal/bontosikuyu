import { TextReveal } from "@/components/magicui/text-reveal";

export default function TransitionSection() {
  return (
    <section className="relative bg-brand-secondary">
      <div className="[&_.text-black]:!text-brand-primary [&_.text-white]:!text-brand-primary [&_.text-black\/20]:!text-brand-primary/30 [&_.text-white\/20]:!text-brand-primary/30">
        <TextReveal className="bg-transparent">
          Kepulauan yang indah dengan pantai biru jernih, terumbu karang yang
          memukau, dan masyarakat yang hangat. Desa Laiyolo Baru menjadi permata
          di antara pulau-pulau Selayar, tempat tradisi bertemu dengan inovasi,
          dimana setiap rumah menyimpan cerita dan setiap gelombang membawa
          harapan baru untuk masa depan yang gemilang.
        </TextReveal>
      </div>
    </section>
  );
}
