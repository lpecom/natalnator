import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductDetails from "@/components/ProductDetails";
import Benefits from "@/components/Benefits";
import Reviews from "@/components/Reviews";

interface DefaultTemplateProps {
  landingPageId: string;
}

const DefaultTemplate = ({ landingPageId }: DefaultTemplateProps) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <ProductGallery landingPageId={landingPageId} />
            <ProductInfo landingPageId={landingPageId} />
          </div>
          <ProductDetails landingPageId={landingPageId} />
          <Benefits landingPageId={landingPageId} />
          <Reviews landingPageId={landingPageId} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DefaultTemplate;