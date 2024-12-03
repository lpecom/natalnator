import React from "react";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import RichTextEditor from "@/components/RichTextEditor";
import { useQueryClient } from "@tanstack/react-query";

interface BasicProductInfoProps {
  product: any;
  onUpdate: () => void;
}

const BasicProductInfo = ({ product, onUpdate }: BasicProductInfoProps) => {
  const queryClient = useQueryClient();
  
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase
        .from("landing_page_products")
        .update({
          name: formData.get("name")?.toString() || "",
          price: Number(formData.get("price")),
          original_price: Number(formData.get("original_price")),
          stock: Number(formData.get("stock")),
        })
        .eq("id", product.id);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["product-details"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product"] });
      
      toast.success("Informações do produto atualizadas com sucesso");
      onUpdate();
    } catch (error) {
      toast.error("Falha ao atualizar informações do produto");
    }
  };

  const handleDescriptionChange = async (html: string) => {
    try {
      const { error } = await supabase
        .from("landing_page_products")
        .update({
          description_html: html,
        })
        .eq("id", product.id);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["product-details"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product"] });
      
      toast.success("Descrição atualizada com sucesso");
      onUpdate();
    } catch (error) {
      toast.error("Falha ao atualizar descrição");
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Informações Básicas</h2>
      </div>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input
            name="name"
            type="text"
            defaultValue={product.name}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Preço</label>
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={product.price}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Preço Original</label>
          <input
            name="original_price"
            type="number"
            step="0.01"
            defaultValue={product.original_price}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Estoque</label>
          <input
            name="stock"
            type="number"
            defaultValue={product.stock}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <RichTextEditor
            content={product.description_html || ""}
            onChange={handleDescriptionChange}
            showSource={true}
            debounceMs={1000}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
};

export default BasicProductInfo;