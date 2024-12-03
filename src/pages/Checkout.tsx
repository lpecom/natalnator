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
import { Link } from "react-router-dom";

interface ThemeSettings {
  colors?: {
    primary: string;
    success: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  fonts?: {
    primary: string;
  };
  logo?: {
    url: string;
    alt: string;
  };
}

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const productId = searchParams.get("productId");
  const variantColor = searchParams.get("color");
  const variantHeight = searchParams.get("height");

  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'theme')
        .single();

      if (error) throw error;
      return data ? { ...data, value: data.value as ThemeSettings } : null;
    }
  });

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
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="inline-block">
            {settings?.value?.logo?.url ? (
              <img 
                src={settings.value.logo.url} 
                alt={settings.value.logo.alt || "Site Logo"}
                className="h-16 md:h-20 w-auto animate-fade-in" 
              />
            ) : (
              <img
                src="/lovable-uploads/afad369a-bb88-4bbc-aba2-54ae54f3591e.png"
                alt="Logo"
                className="h-16 md:h-20 w-auto animate-fade-in"
              />
            )}
          </Link>
        </div>

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