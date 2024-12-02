import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Truck, User, MapPin } from "lucide-react";
import { CheckoutForm } from "@/components/CheckoutForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const steps = [
  { id: 1, name: "Personal Info", icon: User },
  { id: 2, name: "Delivery", icon: Truck },
  { id: 3, name: "Confirmation", icon: CheckCircle },
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
    <div className="min-h-screen bg-gray-50">
      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <nav aria-label="Progress">
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
                        className={`absolute top-1/2 -translate-y-1/2 right-8 sm:right-16 w-full h-0.5 ${
                          currentStep > step.id ? "bg-primary" : "bg-gray-200"
                        }`}
                        style={{ width: "100px" }}
                      />
                    )}
                    <div className="relative flex flex-col items-center group">
                      <span
                        className={`w-10 h-10 flex items-center justify-center rounded-full ${
                          currentStep >= step.id
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        <StepIcon className="w-5 h-5" />
                      </span>
                      <span className="text-sm font-medium mt-2">{step.name}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="flex items-center gap-4">
              <img
                src={product.product_images?.[0]?.url || "/placeholder.svg"}
                alt={product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <div className="text-sm text-gray-500 mt-1">
                  {variantColor && <span>Color: {variantColor}</span>}
                  {variantHeight && (
                    <span className="ml-2">Height: {variantHeight}</span>
                  )}
                </div>
                <div className="text-lg font-semibold mt-1">
                  R$ {product.price.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {currentStep === 3 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Order Confirmed!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your order. We'll contact you shortly to confirm delivery details.
              </p>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <CheckoutForm
                productId={product.id}
                variantSelections={{
                  cor: variantColor || "",
                  altura: variantHeight || "",
                }}
                onSuccess={handleCheckoutSuccess}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;