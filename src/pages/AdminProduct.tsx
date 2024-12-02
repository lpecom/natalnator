import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import BasicProductInfo from "@/components/admin/BasicProductInfo";
import ProductImages from "@/components/admin/ProductImages";
import ProductVariants from "@/components/admin/ProductVariants";
import ReviewsManager from "@/components/admin/ReviewsManager";

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
        const { data: products } = await supabase
          .from("landing_page_products")
          .select(`
            *,
            product_images(*),
            product_variants(*)
          `)
          .eq("landing_page_id", landingPage.id);

        // Check if we have any products
        if (products && products.length > 0) {
          setProduct({ ...products[0], landing_page_id: landingPage.id });
        } else {
          // Create a new product if none exists
          const { data: newProduct } = await supabase
            .from("landing_page_products")
            .insert({
              landing_page_id: landingPage.id,
              name: "Árvore de Natal + BRINDE EXCLUSIVO DE BLACK FRIDAY",
              description: "Árvore de Natal premium com brinde exclusivo",
              price: 99.90,
              original_price: 187.00,
              stock: 8
            })
            .select()
            .single();

          if (newProduct) {
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

            await loadProduct(); // Reload to get the complete product data
          }
        }
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

          if (newProduct) {
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

            await loadProduct(); // Reload to get the complete product data
          }
        }
      }
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Error loading product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Product Administration</h1>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          View Page
        </button>
      </div>

      <div className="grid gap-6">
        {product && (
          <>
            <BasicProductInfo product={product} onUpdate={loadProduct} />
            <ProductImages product={product} onUpdate={loadProduct} />
            <ProductVariants product={product} onUpdate={loadProduct} />
            <ReviewsManager landingPageId={product.landing_page_id} />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProduct;