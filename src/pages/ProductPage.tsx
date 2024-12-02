import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getTemplate } from "@/components/templates";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ProductPage = () => {
  const { id } = useParams();

  const { data: landingPage, isLoading, error } = useQuery({
    queryKey: ["landing-page", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("slug", id)
        .single();

      if (error) throw error;
      return data;
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !landingPage) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <p>The page you're looking for doesn't exist or has been removed.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const Template = getTemplate(landingPage.template_name);
  return <Template landingPageId={landingPage.id} />;
};

export default ProductPage;