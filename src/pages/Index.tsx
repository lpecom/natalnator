import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeBanners from "@/components/HomeBanners";
import { Link } from "react-router-dom";

const Index = () => {
  const { data: featuredProducts, isLoading: isProductsLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .limit(8);
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        <HomeBanners />
        
        {/* Featured Products Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isProductsLoading ? (
              Array(8)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 animate-pulse rounded-lg h-64"
                  />
                ))
            ) : (
              featuredProducts?.map((product) => (
                <Link
                  key={product.id}
                  to={`/p/${product.id}`}
                  className="group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-gray-600">
                    {product.name}
                  </h3>
                  <p className="text-gray-500">
                    ${product.price.toLocaleString()}
                  </p>
                </Link>
              ))
            )}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/catalog"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;