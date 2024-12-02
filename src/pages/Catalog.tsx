import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

const Catalog = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["catalog-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_page_products")
        .select(`
          *,
          landing_page: landing_pages(id, slug),
          product_images(url, is_primary)
        `)
        .eq("landing_pages.status", "published")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Catálogo de Produtos</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="w-full aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.map((product) => {
              const primaryImage = product.product_images?.find(img => img.is_primary)?.url || 
                                 product.product_images?.[0]?.url ||
                                 "/placeholder.svg";
              
              return (
                <Link
                  key={product.id}
                  to={`/p/${product.landing_page?.slug}`}
                  className="group"
                >
                  <div className="space-y-4">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={primaryImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold text-gray-900">
                        R$ {product.price.toFixed(2)}
                      </p>
                      {product.original_price && (
                        <p className="text-sm text-gray-500 line-through">
                          R$ {product.original_price.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;