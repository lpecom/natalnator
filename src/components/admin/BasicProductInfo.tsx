import React, { useState } from "react";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import RichTextEditor from "@/components/RichTextEditor";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";

interface BasicProductInfoProps {
  product: any;
  onUpdate: () => void;
}

const BasicProductInfo = ({ product, onUpdate }: BasicProductInfoProps) => {
  const queryClient = useQueryClient();
  const [slug, setSlug] = useState(product.landing_page?.slug || '');
  
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    if (!slug || slug === product.landing_page?.slug) {
      // Only auto-generate slug if it hasn't been manually edited
      setSlug(generateSlug(newName));
    }
  };
  
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      // First update the landing page product
      const { error: productError } = await supabase
        .from("landing_page_products")
        .update({
          name: formData.get("name")?.toString() || "",
          price: Number(formData.get("price")),
          original_price: Number(formData.get("original_price")),
          stock: Number(formData.get("stock")),
        })
        .eq("id", product.id);

      if (productError) throw productError;

      // Then update the landing page slug
      const { error: pageError } = await supabase
        .from("landing_pages")
        .update({
          slug: slug || generateSlug(formData.get("name")?.toString() || ""),
        })
        .eq("id", product.landing_page_id);

      if (pageError) throw pageError;
      
      queryClient.invalidateQueries({ queryKey: ["product-details"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product"] });
      queryClient.invalidateQueries({ queryKey: ["landing-page"] });
      
      toast.success("Product information updated successfully");
      onUpdate();
    } catch (error) {
      toast.error("Failed to update product information");
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
      
      toast.success("Description updated successfully");
      onUpdate();
    } catch (error) {
      toast.error("Failed to update description");
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Basic Information</h2>
      </div>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            name="name"
            type="text"
            defaultValue={product.name}
            onChange={handleNameChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL Slug</label>
          <Input
            name="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="product-url-slug"
          />
          <p className="text-sm text-muted-foreground mt-1">
            This will be used in the URL: /p/{slug}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <Input
            name="price"
            type="number"
            step="0.01"
            defaultValue={product.price}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Original Price</label>
          <Input
            name="original_price"
            type="number"
            step="0.01"
            defaultValue={product.original_price}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <Input
            name="stock"
            type="number"
            defaultValue={product.stock}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
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
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default BasicProductInfo;