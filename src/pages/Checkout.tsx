import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { CheckoutForm } from "@/components/CheckoutForm";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { CheckoutBenefits } from "@/components/checkout/CheckoutBenefits";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { SuccessMessage } from "@/components/checkout/SuccessMessage";

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const productId = searchParams.get("productId");
  const variantColor = searchParams.get("color");
  const variantHeight = searchParams.get("height");

  const { data: product, isLoading } = useQuery({
    queryKey: ["checkout-product", productId],
    queryFn: async () => {
      if (!productId) return null;
      const { data } = await supabase
        .from("landing_page_products")
        .select("*, product_images(*)")
        .eq("id", productId)
        .single();
      return data;
    },
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <button
          onClick={() => navigate("/")}
          className="text-primary hover:underline"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const handleCheckoutSuccess = () => {
    setCurrentStep(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent-light to-background">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <CheckoutSteps currentStep={currentStep} />

        <div className="max-w-4xl mx-auto space-y-6">
          <CheckoutBenefits />
          <OrderSummary 
            product={product}
            variantColor={variantColor}
            variantHeight={variantHeight}
          />

          {currentStep === 3 ? (
            <SuccessMessage onContinueShopping={() => navigate("/")} />
          ) : (
            <Card className="bg-white/80 backdrop-blur p-4 md:p-6 animate-fade-in">
              <CheckoutForm
                productId={product.id}
                variantSelections={{
                  cor: variantColor || "",
                  altura: variantHeight || "",
                }}
                onSuccess={handleCheckoutSuccess}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;