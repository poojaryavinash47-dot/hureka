import Hero from "@/components/Hero";
import LatestProducts from "@/components/LatestProducts";
import FeaturesSection from "@/components/FeaturesSection";
import PromoSection from "@/components/PromoSection";
import OilFreeSection from "@/components/OilFreeSection";
import Footer from "@/components/Footer";
import HomeCategorySlider from "@/components/HomeCategorySlider";
export default function Home() {
  return (
    <main>
      <Hero />
         
      <LatestProducts />
      <FeaturesSection />
      <PromoSection />
      <OilFreeSection />
       <HomeCategorySlider />
    </main>
  );
}