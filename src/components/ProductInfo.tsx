import React from "react";
import { toast } from "sonner";
import { Truck, CreditCard, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductInfoProps {
  landingPageId?: string;
  productId?: string;
}

const ProductInfo = ({ landingPageId, productId }: ProductInfoProps) => {
  const [selectedColor, setSelectedColor] = React.useState<string>("");
  const [selectedHeight, setSelectedHeight] = React.useState<string>("");

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

  // Find the matching variant combination
  const selectedVariant = product?.product_variants?.find(
    v => {
      if (v.name === "Cor" && v.value === selectedColor) return true;
      if (v.name === "Altura" && v.value === selectedHeight) return true;
      return false;
    }
  );

  const handleBuy = () => {
    if (!selectedColor || !selectedHeight) {
      toast.error("Por favor selecione a cor e altura antes de continuar");
      return;
    }
    
    if (selectedVariant?.checkout_url) {
      window.location.href = selectedVariant.checkout_url;
    } else {
      toast.error("Link de checkout não encontrado para esta variante");
    }
  };

  if (!product) {
    return <div className="text-center p-4">Loading product information...</div>;
  }

  const price = selectedVariant?.price_adjustment 
    ? product.price + selectedVariant.price_adjustment 
    : product.price;
  const originalPrice = product.original_price || price * 1.5;
  const pixDiscount = 0.05; // 5% discount
  const pixPrice = price * (1 - pixDiscount);
  const pixSavings = price - pixPrice;

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

      <div className="inline-flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1 text-success">
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor">
              <path d="M20.3873 7.1575L11.9999 12L3.61255 7.1575" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 12V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.9999 3L20.3873 7.1575L11.9999 12L3.61255 7.1575L11.9999 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            5% OFF no pix
          </span>
        </div>
        <span className="px-2 py-0.5 bg-[#F2FCE2] text-success rounded-full text-xs font-medium">
          + Envio Prioritário
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
          <div className="grid grid-cols-4 gap-2">
            {[
              "Visa",
              "Mastercard",
              "Pix",
              "Boleto",
            ].map((method) => (
              <div
                key={method}
                className="h-10 bg-gray-50 rounded-lg border flex items-center justify-center text-xs text-gray-600"
              >
                <CreditCard className="w-4 h-4 mr-1" />
                {method}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500 justify-center text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Pagamento 100% seguro</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;