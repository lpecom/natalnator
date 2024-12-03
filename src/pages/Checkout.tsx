import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Truck, User, MapPin, CreditCard, Shield, Clock } from "lucide-react";
import { CheckoutForm } from "@/components/CheckoutForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

const steps = [
  { id: 1, name: "Personal Info", icon: User },
  { id: 2, name: "Delivery", icon: Truck },
  { id: 3, name: "Confirmation", icon: CheckCircle },
];

const benefits = [
  {
    icon: CreditCard,
    title: "Pay on Delivery",
    description: "Only pay when you receive your order - no upfront payment required!"
  },
  {
    icon: Shield,
    title: "100% Safe",
    description: "Your satisfaction is guaranteed with our secure delivery process"
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description: "Quick delivery to your doorstep within 2-5 business days"
  }
];

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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <nav aria-label="Progress" className="animate-fade-in">
            <ol className="flex items-center justify-center">
              {steps.map((step, stepIdx) => {
                const StepIcon = step.icon;
                return (
                  <li
                    key={step.name}
                    className={`relative ${
                      stepIdx !== steps.length - 1 ? "pr-20 sm:pr-32" : ""
                    }`}
                  >
                    {stepIdx !== steps.length - 1 && (
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 right-8 sm:right-16 w-full h-0.5 transition-colors duration-500 ${
                          currentStep > step.id ? "bg-primary" : "bg-gray-200"
                        }`}
                        style={{ width: "100px" }}
                      />
                    )}
                    <div className="relative flex flex-col items-center group">
                      <span
                        className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 ${
                          currentStep >= step.id
                            ? "bg-primary text-white scale-110"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        <StepIcon className="w-6 h-6" />
                      </span>
                      <span className="text-sm font-medium mt-2">{step.name}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Benefits Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-6 hover-card bg-white/80 backdrop-blur">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{benefit.title}</h3>
                    <p className="text-muted text-sm">{benefit.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <Card className="bg-white/80 backdrop-blur p-6 mb-6 animate-fade-in">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <img
                  src={product.product_images?.[0]?.url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <div className="text-sm text-muted mt-1 space-x-2">
                  {variantColor && <span>Color: {variantColor}</span>}
                  {variantHeight && (
                    <span className="ml-2">Height: {variantHeight}</span>
                  )}
                </div>
                <div className="text-xl font-semibold mt-2 text-primary">
                  R$ {product.price.toFixed(2)}
                </div>
              </div>
            </div>
          </Card>

          {currentStep === 3 ? (
            <Card className="bg-white/80 backdrop-blur p-8 text-center animate-fade-in">
              <div className="w-20 h-20 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
              <p className="text-muted text-lg mb-8 max-w-md mx-auto">
                Thank you for your order. We'll contact you shortly to confirm delivery details.
                Remember, you only pay when your order arrives!
              </p>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-primary hover:bg-primary/90 transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </Card>
          ) : (
            <Card className="bg-white/80 backdrop-blur p-6 animate-fade-in">
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