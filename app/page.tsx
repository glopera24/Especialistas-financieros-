import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import Problems from "@/components/sections/problems";
import Solution from "@/components/sections/solution";
import Sectors from "@/components/sections/sectors";
import Benefits from "@/components/sections/benefits";
import ChatSection from "@/components/sections/chat-section";
import DashboardPreviewSection from "@/components/sections/dashboard-preview";
import FormSection from "@/components/sections/form-section";
import FAQ from "@/components/sections/faq";
import FinalCta from "@/components/sections/final-cta";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problems />
        <Solution />
        <Sectors />
        <Benefits />
        <ChatSection />
        <DashboardPreviewSection />
        <FormSection />
        <FAQ />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
