import React, { useEffect } from "react";
import { toast } from "sonner";
import { Truck, ShieldCheck } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProductInfo = () => {
  const { slug } = useParams();
  
  const { data: landingPage } = useQuery({
    queryKey: ["landingPage", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_pages")
        .select(`
          *,
          landing_page_products (*)
        `)
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const product = landingPage?.landing_page_products?.[0];

  const handleBuy = () => {
    toast.success("Product added to cart!");
  };

  const paymentMethods = [
    { name: "Visa", image: "/payment-methods/001.svg" },
    { name: "Mastercard", image: "/payment-methods/002.png" },
    { name: "Hipercard", image: "/payment-methods/003.png" },
    { name: "Elo", image: "/payment-methods/004.png" },
    { name: "Amex", image: "/payment-methods/005.png" },
    { name: "Discover", image: "/payment-methods/006.png" },
    { name: "Pix", image: "/payment-methods/007.png" },
    { name: "Boleto", image: "/payment-methods/008.png" },
  ];

  if (!product) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          {product.name}
        </h1>
      </div>

      <div className="flex items-baseline gap-4">
        <span className="text-4xl font-bold">
          R$ {product.price.toFixed(2)}
        </span>
        {product.original_price && (
          <>
            <span className="text-xl text-gray-500 line-through">
              R$ {product.original_price.toFixed(2)}
            </span>
            <span className="text-white bg-primary px-2 py-1 text-sm font-bold rounded">
              {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
            </span>
          </>
        )}
      </div>

      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <Truck className="w-12 h-12 text-black flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg">Free Shipping</h3>
          <p className="text-gray-600">Delivery time: 2-5 business days</p>
        </div>
      </div>

      <button
        onClick={handleBuy}
        className="w-full bg-success hover:bg-success/90 text-white py-4 rounded-lg font-bold text-lg transition-colors uppercase"
      >
        Buy Now
      </button>

      <div className="space-y-6 pt-4">
        <div className="border-t pt-6">
          <h3 className="text-center font-medium text-gray-600 mb-4">
            PAYMENT METHODS
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="h-12 bg-gray-50 rounded-lg border flex items-center justify-center"
              >
                <img
                  src={method.image}
                  alt={method.name}
                  className="h-6 object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500 justify-center text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>100% Secure Payment</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Truck className="w-5 h-5 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold">Free Shipping</h4>
              <p className="text-gray-600 text-sm">
                Free shipping on orders over R$99
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold">Free Returns</h4>
              <p className="text-gray-600 text-sm">
                100% money back guarantee
              </p>
              <p className="text-gray-600 text-sm">
                Within 7 days of receiving your order
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;