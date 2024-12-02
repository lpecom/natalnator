import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data: landingPage } = await supabase
        .from("landing_pages")
        .select("*")
        .limit(1)
        .single();

      if (landingPage) {
        const { data: product } = await supabase
          .from("landing_page_products")
          .select(`
            *,
            product_images(*),
            product_variants(*)
          `)
          .eq("landing_page_id", landingPage.id)
          .single();

        setProduct(product);
      } else {
        const { data: newLandingPage } = await supabase
          .from("landing_pages")
          .insert({
            title: "Árvore de Natal + BRINDE EXCLUSIVO DE BLACK FRIDAY",
            slug: "arvore-natal-black-friday",
            status: "published"
          })
          .select()
          .single();

        if (newLandingPage) {
          const { data: newProduct } = await supabase
            .from("landing_page_products")
            .insert({
              landing_page_id: newLandingPage.id,
              name: "Árvore de Natal + BRINDE EXCLUSIVO DE BLACK FRIDAY",
              description: "Árvore de Natal premium com brinde exclusivo",
              price: 99.90,
              original_price: 187.00,
              stock: 8
            })
            .select()
            .single();

          // Add variants
          await supabase.from("product_variants").insert([
            {
              product_id: newProduct.id,
              name: "Cor",
              value: "Vermelha Noel"
            },
            {
              product_id: newProduct.id,
              name: "Altura",
              value: "1.80 m"
            }
          ]);

          await loadProduct();
        }
      }
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Error loading product");
    } finally {
      setLoading(false);
    }
  };

  const handleImportFromShopify = async () => {
    const url = prompt("Enter Shopify product URL:");
    if (!url) return;

    try {
      const { data, error } = await supabase.functions.invoke('scrape-shopify', {
        body: { url }
      });

      if (error) throw error;
      if (!data) throw new Error('No data received from scraper');
      
      console.log('Scraper response:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }

      toast.success("Product imported successfully!");
      navigate(`/admin?id=${data.productId}`);
    } catch (error: any) {
      console.error("Error importing product:", error);
      toast.error(error.message || "Failed to import product");
    }
  };

  useEffect(() => {
    loadProduct();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Product Administration</h1>
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
            onClick={() => navigate("/")}
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
