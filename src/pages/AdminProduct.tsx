import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import BasicProductInfo from "@/components/admin/BasicProductInfo";
import ProductImages from "@/components/admin/ProductImages";
import ProductVariants from "@/components/admin/ProductVariants";
import ProductDescription from "@/components/admin/ProductDescription";
import { Button } from "@/components/ui/button";
import { Import } from "lucide-react";

const AdminProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get landing page ID from URL
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [landingPage, setLandingPage] = useState<any>(null);

  const loadProduct = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // First get the landing page
      const { data: landingPageData, error: landingPageError } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("id", id)
        .single();

      if (landingPageError) throw landingPageError;
      setLandingPage(landingPageData);

      // Then get the associated product with all its relations
      const { data: productData, error: productError } = await supabase
        .from("landing_page_products")
        .select(`
          *,
          product_images(*),
          product_variants(*)
        `)
        .eq("landing_page_id", id)
        .single();

      if (productError) throw productError;
      setProduct(productData);
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Error loading product");
    } finally {
      setLoading(false);
    }
  };

  const handleImportFromShopify = async () => {
    if (!id) return;
    
    const url = prompt("Enter Shopify product URL:");
    if (!url) return;

    try {
      const { data, error } = await supabase.functions.invoke('scrape-shopify', {
        body: { url, landingPageId: id }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to import product');
      }

      if (!data) {
        throw new Error('No data received from scraper');
      }
      
      console.log('Scraper response:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }

      toast.success("Product imported successfully!");
      await loadProduct(); // Reload the product after import
    } catch (error: any) {
      console.error("Error importing product:", error);
      toast.error(error.message || "Failed to import product");
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!landingPage) {
    return <div className="p-8">Landing page not found</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Product Editor</h1>
          <p className="text-gray-500">Landing Page: {landingPage.title}</p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={handleImportFromShopify}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Import className="w-4 h-4" />
            Import from Shopify
          </Button>
          <Button
            onClick={() => navigate(`/landing-pages/${id}`)}
            variant="default"
          >
            View Page
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {product && (
          <>
            <BasicProductInfo product={product} onUpdate={loadProduct} />
            <ProductDescription product={product} onUpdate={loadProduct} />
            <ProductImages product={product} onUpdate={loadProduct} />
            <ProductVariants product={product} onUpdate={loadProduct} />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProduct;