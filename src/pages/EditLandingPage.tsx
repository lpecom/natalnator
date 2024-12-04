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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

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
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <div className="bg-white p-6 rounded-lg border space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Page Title</Label>
                  <Input
                    id="title"
                    value={landingPage.title}
                    onChange={(e) => handleUpdateLandingPage({ title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={landingPage.slug}
                    onChange={(e) => handleUpdateLandingPage({ slug: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select
                    value={landingPage.template_name}
                    onValueChange={(value) => handleUpdateLandingPage({ template_name: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={landingPage.status}
                    onValueChange={(value) => handleUpdateLandingPage({ status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_homepage"
                  checked={landingPage.is_homepage}
                  onCheckedChange={(checked) => handleUpdateLandingPage({ is_homepage: checked })}
                />
                <Label htmlFor="is_homepage">Set as Homepage</Label>
              </div>
            </div>
          </TabsContent>

          {product && (
            <>
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
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default EditLandingPage;