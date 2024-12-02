import React from "react";
import Header from "@/components/Header";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="text-sm text-gray-500 mb-4 md:mb-6 flex flex-wrap items-center gap-1">
            <span>Página Inicial</span>
            <span>/</span>
            <span className="line-clamp-1">Árvore de Natal + BRINDE EXCLUSIVO DE BLACK FRIDAY</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            <ProductGallery />
            <ProductInfo />
          </div>
          <Reviews />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;