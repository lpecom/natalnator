import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";

const Index = () => {
  const { data: landingPage } = useQuery({
    queryKey: ["homepage"],
    queryFn: async () => {
      const { data } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("is_homepage", true)
        .single();
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-3">
          <div className="text-xs text-gray-500 mb-3 flex flex-wrap items-center gap-1">
            <span>Página Inicial</span>
            <span>/</span>
            <span className="line-clamp-1">{landingPage?.title}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <ProductGallery landingPageId={landingPage?.id} />
            <ProductInfo landingPageId={landingPage?.id} />
          </div>
          <Reviews />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;