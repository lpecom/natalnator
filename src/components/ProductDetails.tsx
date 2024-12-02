import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import RichTextEditor from "./RichTextEditor";

interface ProductDetailsProps {
  landingPageId?: string;
}

const ProductDetails = ({ landingPageId }: ProductDetailsProps) => {
  const { data: product, isLoading } = useQuery({
    queryKey: ["product-details", landingPageId],
    queryFn: async () => {
      if (!landingPageId) return null;
      const { data } = await supabase
        .from("landing_page_products")
        .select("description_html")
        .eq("landing_page_id", landingPageId)
        .single();
      return data;
    },
    enabled: !!landingPageId,
  });

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
      <h2 className="text-2xl font-semibold mb-6">Detalhes do Produto</h2>
      <div className="bg-white rounded-lg">
        <RichTextEditor
          content={product?.description_html || "<p>Carregando detalhes do produto...</p>"}
          editable={false}
          showSource={false}
        />
      </div>
    </div>
  );
};

export default ProductDetails;