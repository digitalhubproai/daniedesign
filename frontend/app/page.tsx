import Hero from "@/components/home/Hero";
import ClientsMarquee from "@/components/home/ClientsMarquee";
import AgencyIntro from "@/components/home/AgencyIntro";
import Services from "@/components/home/Services";
import Process from "@/components/home/Process";
import CreativeMarquee from "@/components/home/CreativeMarquee";
import TrustStatement from "@/components/home/TrustStatement";
import FeaturedWork from "@/components/home/FeaturedWork";
import FeaturedStack from "@/components/home/FeaturedStack";
import ImpactStats from "@/components/home/ImpactStats";
import BlogPreview from "@/components/home/BlogPreview";

export default function Home() {
  return (
    <main>
      <Hero />
      <ClientsMarquee />
      <AgencyIntro />
      <Services />
      <Process />
      <CreativeMarquee />
      <TrustStatement />
      <FeaturedWork />
      <FeaturedStack />
      <ImpactStats />
      <BlogPreview />
    </main>
  );
}