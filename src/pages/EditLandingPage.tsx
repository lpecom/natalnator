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
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import PageSettings from "@/components/admin/landing-page/PageSettings";
import PriceManager from "@/components/admin/landing-page/PriceManager";

const EditLandingPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleUpdateLandingPage = async (updates: Partial<typeof landingPage>) => {
    if (!landingPage) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("landing_pages")
        .update(updates)
        .eq("id", landingPage.id);

      if (error) throw error;

      await refetch();
      toast({
        title: "Success",
        description: "Landing page updated successfully",
      });
    } catch (error) {
      console.error("Error updating landing page:", error);
      toast({
        title: "Error",
        description: "Failed to update landing page",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateProduct = async (updates: any) => {
    if (!landingPage?.landing_page_products?.[0]) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("landing_page_products")
        .update(updates)
        .eq("id", landingPage.landing_page_products[0].id);

      if (error) throw error;

      await refetch();
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

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
              <Settings className="w-5 h-5 text-muted-foreground" />
              <h1 className="text-xl font-semibold">{landingPage.title}</h1>
            </div>
            <div className="flex items-center gap-2">
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
      </div>

      <div className="container max-w-5xl py-8">
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="settings">Page Settings</TabsTrigger>
            <TabsTrigger value="product">Product Information</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <PageSettings 
              landingPage={landingPage} 
              onUpdate={handleUpdateLandingPage} 
            />
          </TabsContent>

          {product && (
            <>
              <TabsContent value="product">
                <BasicProductInfo product={product} onUpdate={refetch} />
              </TabsContent>

              <TabsContent value="pricing">
                <PriceManager product={product} onUpdate={handleUpdateProduct} />
              </TabsContent>

              <TabsContent value="media">
                <ProductImages product={product} onUpdate={refetch} />
              </TabsContent>

              <TabsContent value="variants">
                <ProductVariants product={product} onUpdate={refetch} />
              </TabsContent>

              <TabsContent value="benefits">
                <Benefits productId={product.id} editable={true} />
              </TabsContent>

              <TabsContent value="reviews">
                <ReviewsManager landingPageId={landingPage.id} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default EditLandingPage;