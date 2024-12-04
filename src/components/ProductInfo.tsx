import React from "react";
import { toast } from "sonner";
import { Truck, CreditCard, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import VariantSelector from "./product/VariantSelector";
import PriceDisplay from "./product/PriceDisplay";

interface ProductInfoProps {
  landingPageId?: string;
  productId?: string;
}

const ProductInfo = ({ landingPageId, productId }: ProductInfoProps) => {
  const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string>>({});

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
      console.log("Fetched product data:", data);
      return data;
    },
    enabled: !!(landingPageId || productId),
  });

  // Group variants by option name and set default selections
  const variantGroups = React.useMemo(() => {
    if (!product?.product_variants) return {};
    
    const groups: Record<string, string[]> = {};
    
    product.product_variants.forEach((variant: any) => {
      if (!groups[variant.name]) {
        groups[variant.name] = [];
      }
      if (!groups[variant.name].includes(variant.value)) {
        groups[variant.name].push(variant.value);
      }
    });

    // Set default selections if not already set
    if (Object.keys(selectedOptions).length === 0) {
      const defaultSelections: Record<string, string> = {};
      Object.entries(groups).forEach(([name, values]) => {
        defaultSelections[name] = values[0];
      });
      setSelectedOptions(defaultSelections);
    }
    
    console.log("Variant groups:", groups);
    return groups;
  }, [product?.product_variants]);

  // Find the matching variant based on selected options
  const selectedVariant = React.useMemo(() => {
    if (!product?.product_variants || Object.keys(selectedOptions).length === 0) return null;

    // Only return a variant if all required options are selected
    const requiredOptions = Object.keys(variantGroups);
    const hasAllOptions = requiredOptions.every(option => selectedOptions[option]);
    
    if (!hasAllOptions) return null;

    // Find the variant that matches the current combination
    return product.product_variants.find((variant: any) => {
      return Object.entries(selectedOptions).some(([name, value]) => 
        variant.name === name && variant.value === value
      );
    });
  }, [product?.product_variants, selectedOptions, variantGroups]);

  const handleBuy = () => {
    const requiredOptions = Object.keys(variantGroups);
    const missingOptions = requiredOptions.filter(option => !selectedOptions[option]);
    
    if (missingOptions.length > 0) {
      toast.error(`Por favor selecione ${missingOptions.join(" e ")} antes de continuar`);
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

  // Calculate final price based on base price and variant adjustment
  const price = selectedVariant?.price_adjustment 
    ? product.price + selectedVariant.price_adjustment 
    : product.price;
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

      <PriceDisplay 
        price={price}
        originalPrice={originalPrice}
      />

      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm">
        <Truck className="w-5 h-5 text-black flex-shrink-0" />
        <div>
          <p className="text-gray-600">Frete Grátis</p>
          <p className="text-success font-medium">2 a 5 dias úteis</p>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(variantGroups).map(([optionName, values]) => (
          <VariantSelector
            key={optionName}
            optionName={optionName}
            values={values}
            selectedValue={selectedOptions[optionName]}
            onValueChange={(value) => 
              setSelectedOptions(prev => ({ ...prev, [optionName]: value }))
            }
          />
        ))}
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
            {["Visa", "Mastercard", "Pix", "Boleto"].map((method) => (
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