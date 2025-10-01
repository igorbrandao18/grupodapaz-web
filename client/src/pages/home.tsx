import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import WhyChoose from "@/components/why-choose";
import Plans from "@/components/plans";
import Services from "@/components/services";
import Benefits from "@/components/benefits";
import Units from "@/components/units";
import FAQ from "@/components/faq";
import Contact from "@/components/contact";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";
import BackToTop from "@/components/back-to-top";

export default function Home() {
  return (
    <div className="min-h-screen" data-testid="page-home">
      <Navigation />
      <Hero />
      <WhyChoose />
      <Plans />
      <Services />
      <Benefits />
      <Units />
      <FAQ />
      <Contact />
      <Testimonials />
      <Footer />
      <BackToTop />
    </div>
  );
}
