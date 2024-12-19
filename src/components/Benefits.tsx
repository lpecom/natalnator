import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import RichTextEditor from "./RichTextEditor";
import { Button } from "./ui/button";
import { Save } from "lucide-react";
import { useState, useEffect } from "react";

interface BenefitsProps {
  landingPageId?: string;
  productId?: string;
  editable?: boolean;
}

interface ProductData {
  id: string;
  benefits_html: string;
}

const Benefits = ({ landingPageId, productId, editable = false }: BenefitsProps) => {
  const queryClient = useQueryClient();
  const [content, setContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product-benefits", landingPageId, productId],
    queryFn: async () => {
      if (!landingPageId && !productId) return null;

      let query = supabase
        .from("landing_page_products")
        .select("id, benefits_html");

      if (productId) {
        query = query.eq("id", productId);
      } else if (landingPageId) {
        query = query.eq("landing_page_id", landingPageId);
      }

      const { data } = await query.single();
      return data as ProductData;
    },
    enabled: !!(landingPageId || productId),
  });

  // Initialize content when product data is first loaded
  useEffect(() => {
    if (product?.benefits_html) {
      setContent(product.benefits_html);
    }
  }, [product]);

  const handleBenefitsChange = (html: string) => {
    setContent(html);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!product) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("landing_page_products")
        .update({ benefits_html: content })
        .eq("id", product.id);

      if (error) throw error;
      
      await queryClient.invalidateQueries({ queryKey: ["product-benefits"] });
      setHasChanges(false);
      toast.success("Benefits saved successfully");
    } catch (error) {
      toast.error("Failed to save benefits");
    } finally {
      setIsSaving(false);
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

  const displayContent = content || product?.benefits_html || "<p></p>";

  return (
    <div className="py-8 border-t border-b">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Benefícios do Produto</h2>
        {editable && hasChanges && (
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        )}
      </div>
      <div className="bg-white rounded-lg">
        {editable ? (
          <RichTextEditor
            content={displayContent}
            onChange={handleBenefitsChange}
            editable={true}
            showSource={true}
          />
        ) : (
          <div 
            className="prose max-w-none p-4"
            dangerouslySetInnerHTML={{ __html: displayContent }}
          />
        )}
      </div>
    </div>
  );
};

export default Benefits;