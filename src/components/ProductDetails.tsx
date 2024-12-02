import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import RichTextEditor from "./RichTextEditor";

const ProductDetails = () => {
  const { data: product } = useQuery({
    queryKey: ["product-details"],
    queryFn: async () => {
      const { data } = await supabase
        .from("landing_page_products")
        .select("description_html")
        .limit(1)
        .single();
      return data;
    },
  });

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