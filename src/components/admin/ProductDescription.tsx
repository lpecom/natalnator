import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProductDescriptionProps {
  product: any;
  onUpdate: () => void;
}

const ProductDescription = ({ product, onUpdate }: ProductDescriptionProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: product.description_html || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none",
      },
    },
  });

  const handleSave = async () => {
    if (!editor) return;
    
    try {
      const { error } = await supabase
        .from("landing_page_products")
        .update({
          description_html: editor.getHTML(),
        })
        .eq("id", product.id);

      if (error) throw error;
      
      toast.success("Product description updated successfully");
      onUpdate();
    } catch (error) {
      toast.error("Failed to update product description");
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Product Description</h2>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Save Changes
        </button>
      </div>
      <div className="border rounded-lg p-4">
        <EditorContent editor={editor} className="min-h-[200px]" />
      </div>
    </div>
  );
};

export default ProductDescription;