import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import RichTextEditor from "./RichTextEditor";

interface BenefitsProps {
  landingPageId?: string;
  productId?: string;
  editable?: boolean;
}

const Benefits = ({ landingPageId, productId, editable = false }: BenefitsProps) => {
  const { data: product, isLoading } = useQuery({
    queryKey: ["product-benefits", landingPageId, productId],
    queryFn: async () => {
      if (!landingPageId && !productId) return null;

      let query = supabase
        .from("landing_page_products")
        .select("benefits_html");

      if (productId) {
        query = query.eq("id", productId);
      } else if (landingPageId) {
        query = query.eq("landing_page_id", landingPageId);
      }

      const { data } = await query.single();
      return data;
    },
    enabled: !!(landingPageId || productId),
  });

  const handleBenefitsChange = async (html: string) => {
    if (!product) return;

    try {
      const { error } = await supabase
        .from("landing_page_products")
        .update({ benefits_html: html })
        .eq("id", productId || product.id);

      if (error) throw error;
      
      toast.success("Benefits updated successfully");
    } catch (error) {
      toast.error("Failed to update benefits");
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 border-t border-b">
        <div className="animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 border-t border-b">
      <h2 className="text-2xl font-semibold mb-6">Benefícios do Produto</h2>
      <div className="bg-white rounded-lg">
        <RichTextEditor
          content={product?.benefits_html || "<p>Carregando benefícios do produto...</p>"}
          onChange={editable ? handleBenefitsChange : undefined}
          editable={editable}
          showSource={editable}
        />
      </div>
    </div>
  );
};

export default Benefits;