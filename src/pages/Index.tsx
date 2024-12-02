import React from "react";
import Header from "@/components/Header";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="text-sm text-gray-500 mb-6">
          <span>Página Inicial</span> /{" "}
          <span>Árvore de Natal + BRINDE EXCLUSIVO DE BLACK FRIDAY</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <ProductGallery />
          <ProductInfo />
        </div>
      </main>
    </div>
  );
};

export default Index;