import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Benefits from "@/components/Benefits";
import BasicProductInfo from "@/components/admin/BasicProductInfo";
import ProductImages from "@/components/admin/ProductImages";
import ProductVariants from "@/components/admin/ProductVariants";
import ReviewsManager from "@/components/admin/ReviewsManager";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EditLandingPage = () => {
  const { id } = useParams();

  const { data: landingPage, isLoading, refetch } = useQuery({
    queryKey: ["landing-page", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_pages")
        .select(`
          *,
          landing_page_products (
            *,
            product_images (*)
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container max-w-5xl py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  if (!landingPage) {
    return (
      <div className="container max-w-5xl py-8">
        <h1 className="text-2xl font-bold">Landing page not found</h1>
      </div>
    );
  }

  const product = landingPage.landing_page_products[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container max-w-5xl py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-muted" />
              <h1 className="text-xl font-semibold">{landingPage.title}</h1>
            </div>
            <a 
              href={`/p/${landingPage.slug}`} 
              target="_blank"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/90 font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Preview Page
            </a>
          </div>
        </div>
      </div>

      {product && (
        <div className="container max-w-5xl py-8">
          <Tabs defaultValue="product" className="space-y-6">
            <TabsList className="bg-white border">
              <TabsTrigger value="product">Product Information</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="product" className="mt-6">
              <BasicProductInfo product={product} onUpdate={refetch} />
            </TabsContent>

            <TabsContent value="media" className="mt-6">
              <ProductImages product={product} onUpdate={refetch} />
            </TabsContent>

            <TabsContent value="variants" className="mt-6">
              <ProductVariants product={product} onUpdate={refetch} />
            </TabsContent>

            <TabsContent value="benefits" className="mt-6">
              <Benefits productId={product.id} editable={true} />
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ReviewsManager landingPageId={landingPage.id} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default EditLandingPage;