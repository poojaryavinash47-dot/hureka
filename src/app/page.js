import Hero from "@/components/Hero";
import LatestProducts from "@/components/LatestProducts";
import FeaturesSection from "@/components/FeaturesSection";
import PromoSection from "@/components/PromoSection";
import OilFreeSection from "@/components/OilFreeSection";
import BlogPreviewSection from "@/components/BlogPreviewSection";
import Footer from "@/components/Footer";
import HomeCategorySlider from "@/components/HomeCategorySlider";
export default function Home() {
  return (
    <main className="home-page">
      <Hero />
         
      <LatestProducts />
      <FeaturesSection />
      <PromoSection />
      <OilFreeSection />
      <BlogPreviewSection />
       <HomeCategorySlider />
    </main>
  );
}