import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Truck, CreditCard, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductInfoProps {
  landingPageId?: string;
  productId?: string;
}

const ProductInfo = ({ landingPageId, productId }: ProductInfoProps) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedHeight, setSelectedHeight] = useState<string>("");
  const navigate = useNavigate();

  const { data: product } = useQuery({
    queryKey: ["product-info", landingPageId, productId],
    queryFn: async () => {
      if (!landingPageId && !productId) return null;

      let query = supabase
        .from("landing_page_products")
        .select(`
          *,
          product_variants (*)
        `);

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

  const colorVariants = product?.product_variants?.filter(v => v.name === "Cor") || [];
  const heightVariants = product?.product_variants?.filter(v => v.name === "Altura") || [];

  const handleBuy = () => {
    if (!product) {
      toast.error("Produto não encontrado");
      return;
    }

    if (colorVariants.length > 0 && !selectedColor) {
      toast.error("Por favor selecione uma cor");
      return;
    }

    if (heightVariants.length > 0 && !selectedHeight) {
      toast.error("Por favor selecione uma altura");
      return;
    }
    
    const searchParams = new URLSearchParams({
      productId: product.id,
      ...(selectedColor && { color: selectedColor }),
      ...(selectedHeight && { height: selectedHeight }),
    });
    
    navigate(`/checkout?${searchParams.toString()}`);
  };

  if (!product) {
    return <div className="text-center p-4">Loading product information...</div>;
  }

  const price = product.price;
  const originalPrice = product.original_price || price * 1.5;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-black text-white px-2 py-1 rounded">
            ÚLTIMAS UNIDADES DA BLACK FRIDAY 🔥
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold">
          {product.name}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-2xl md:text-4xl font-bold">R$ {price.toFixed(2)}</span>
        <span className="text-lg md:text-xl text-gray-500 line-through">R$ {originalPrice.toFixed(2)}</span>
        <span className="text-white bg-primary px-2 py-1 text-sm font-bold rounded">
          -47%
        </span>
      </div>

      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm">
        <Truck className="w-5 h-5 text-black flex-shrink-0" />
        <div>
          <p className="text-gray-600">Frete Grátis</p>
          <p className="text-success font-medium">2 a 5 dias úteis</p>
        </div>
      </div>

      <div className="space-y-3">
        {colorVariants.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Cor: <span className="text-primary">{selectedColor || "Selecione uma cor"}</span>
            </label>
            <div className="flex gap-2">
              {colorVariants.map((variant) => (
                <button
                  key={variant.id}
                  className={`w-14 h-14 border-2 rounded ${
                    selectedColor === variant.value ? "border-primary" : "border-gray-200"
                  }`}
                  style={{
                    backgroundColor: variant.value.toLowerCase()
                  }}
                  onClick={() => setSelectedColor(variant.value)}
                />
              ))}
            </div>
          </div>
        )}

        {heightVariants.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Altura: <span className="text-primary">{selectedHeight || "Selecione uma altura"}</span>
            </label>
            <div className="flex gap-2">
              {heightVariants.map((variant) => (
                <button
                  key={variant.id}
                  className={`px-4 py-2 border-2 rounded font-medium text-sm ${
                    selectedHeight === variant.value
                      ? "border-primary text-primary"
                      : "border-gray-200 text-gray-500"
                  }`}
                  onClick={() => setSelectedHeight(variant.value)}
                >
                  {variant.value}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleBuy}
        className="w-full bg-success hover:bg-success/90 text-white py-3 rounded-lg font-bold text-lg transition-colors"
      >
        COMPRAR AGORA
      </button>

      <div className="pt-4 space-y-4">
        <div className="border-t pt-4">
          <h3 className="text-center font-medium text-gray-600 mb-3 text-sm">
            FORMAS DE PAGAMENTO
          </h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="h-10 bg-gray-50 rounded-lg border flex items-center justify-center text-sm text-gray-600">
              <CreditCard className="w-4 h-4 mr-2" />
              Pagamento na Entrega
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500 justify-center text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Compra 100% segura</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;