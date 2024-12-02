import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAdminProduct = () => {
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

        if (products && products.length > 0) {
          setProduct({ ...products[0], landing_page_id: landingPage.id });
        } else {
          await createInitialProduct(landingPage.id);
        }
      } else {
        await createInitialLandingPage();
      }
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Error loading product");
    } finally {
      setLoading(false);
    }
  };

  const createInitialProduct = async (landingPageId: string) => {
    const { data: newProduct } = await supabase
      .from("landing_page_products")
      .insert({
        landing_page_id: landingPageId,
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

      await loadProduct();
    }
  };

  const createInitialLandingPage = async () => {
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
      await createInitialProduct(newLandingPage.id);
    }
  };

  useEffect(() => {
    loadProduct();
  }, []);

  return { product, loading, loadProduct };
};