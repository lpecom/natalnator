import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadProduct = async () => {
    try {
      setLoading(true);
      
      if (!id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("landing_page_products")
        .select(`
          *,
          landing_page: landing_pages (
            *
          ),
          product_variants (*)
        `)
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Error loading product");
        throw error;
      }

      setProduct(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  return { product, loading, loadProduct };
};