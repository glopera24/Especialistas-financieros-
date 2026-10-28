import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import NecesidadFinanciera from "@/components/sections/problems";
import ChatSection from "@/components/sections/chat-section";
import Metodologia from "@/components/sections/solution";
import VideoPresentacion from "@/components/sections/video-presentacion";
import SimuladorHome from "@/components/sections/simulador-home";
import Ventajas from "@/components/sections/benefits";
import Publico from "@/components/sections/audiencias";
import FormSection from "@/components/sections/form-section";
import FAQ from "@/components/sections/faq";
import FinalCta from "@/components/sections/final-cta";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <NecesidadFinanciera />
        <ChatSection />
        <Metodologia />
        <SimuladorHome />
        <VideoPresentacion />
        <Ventajas />
        <Publico />
        <FormSection />
        <FAQ />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
