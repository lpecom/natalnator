import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Settings, Image, Package2, Truck, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    setLoading(true);
    try {
      // Get the first landing page (we'll assume it's our main product page)
      const { data: landingPage } = await supabase
        .from("landing_pages")
        .select("*")
        .limit(1)
        .single();

      if (landingPage) {
        const { data: product } = await supabase
          .from("landing_page_products")
          .select(`
            *,
            product_images(*),
            product_variants(*),
            shipping_options:shipping_options(*)
          `)
          .eq("landing_page_id", landingPage.id)
          .single();

        setProduct(product);
      } else {
        // Create initial landing page and product
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

          // Add variants
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

          // Add shipping option
          await supabase.from("shipping_options").insert({
            landing_page_id: newLandingPage.id,
            name: "Frete Grátis",
            description: "Entrega em 2-5 dias úteis",
            price: 0,
            estimated_days: 5
          });

          await loadProduct();
        }
      }
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Erro ao carregar o produto");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Administração do Produto</h1>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Ver Página
        </button>
      </div>

      <div className="grid gap-6">
        <div className="p-6 border rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Informações Básicas</h2>
          </div>
          {product && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  value={product.name}
                  className="w-full p-2 border rounded"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preço</label>
                <input
                  type="number"
                  value={product.price}
                  className="w-full p-2 border rounded"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Preço Original
                </label>
                <input
                  type="number"
                  value={product.original_price}
                  className="w-full p-2 border rounded"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estoque</label>
                <input
                  type="number"
                  value={product.stock}
                  className="w-full p-2 border rounded"
                  readOnly
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Image className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Imagens</h2>
          </div>
          <div className="grid grid-cols-6 gap-4">
            {product?.product_images?.map((image: any) => (
              <div key={image.id} className="relative">
                <img
                  src={image.url}
                  alt={image.alt_text}
                  className="w-full h-24 object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Package2 className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Variantes</h2>
          </div>
          <div className="space-y-4">
            {product?.product_variants?.map((variant: any) => (
              <div key={variant.id} className="flex gap-4">
                <input
                  type="text"
                  value={variant.name}
                  className="w-1/3 p-2 border rounded"
                  readOnly
                />
                <input
                  type="text"
                  value={variant.value}
                  className="w-2/3 p-2 border rounded"
                  readOnly
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Opções de Envio</h2>
          </div>
          {product?.shipping_options?.map((option: any) => (
            <div key={option.id} className="space-y-2">
              <input
                type="text"
                value={option.name}
                className="w-full p-2 border rounded"
                readOnly
              />
              <input
                type="text"
                value={option.description}
                className="w-full p-2 border rounded"
                readOnly
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProduct;