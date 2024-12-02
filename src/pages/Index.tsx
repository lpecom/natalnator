import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import Reviews from "@/components/Reviews";

const Index = () => {
  const { data: landingPage } = useQuery({
    queryKey: ["defaultLandingPage"],
    queryFn: async () => {
      const { data: landingPage } = await supabase
        .from("landing_pages")
        .select(`
          *,
          landing_page_products (
            *,
            product_images (*)
          )
        `)
        .limit(1)
        .single();
      return landingPage;
    },
  });

  const productImages = landingPage?.landing_page_products?.[0]?.product_images?.map(
    (image: any) => image.url
  ) || [];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="text-sm text-gray-500 mb-6">
          <span>Página Inicial</span> /{" "}
          <span>Árvore de Natal + BRINDE EXCLUSIVO DE BLACK FRIDAY</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <ProductGallery images={productImages} />
          <ProductInfo />
        </div>
        <div className="py-12">
          <div className="prose max-w-none" id="description" />
        </div>
        <Reviews />
      </main>
    </div>
  );
};

export default Index;