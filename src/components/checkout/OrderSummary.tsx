import { Card } from "@/components/ui/card";

interface OrderSummaryProps {
  product: {
    name: string;
    price: number;
    product_images?: { url: string }[];
  };
  variantColor?: string | null;
  variantHeight?: string | null;
}

export const OrderSummary = ({ product, variantColor, variantHeight }: OrderSummaryProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur p-4 md:p-6 mb-4 md:mb-6 animate-fade-in">
      <h2 className="text-base md:text-lg font-semibold mb-4">Order Summary</h2>
      <div className="flex items-center gap-3 md:gap-4">
        <div className="relative group">
          <img
            src={product.product_images?.[0]?.url || "/placeholder.svg"}
            alt={product.name}
            className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base md:text-lg truncate">{product.name}</h3>
          <div className="text-xs md:text-sm text-muted mt-1 space-x-2">
            {variantColor && <span>Color: {variantColor}</span>}
            {variantHeight && <span className="ml-2">Height: {variantHeight}</span>}
          </div>
          <div className="text-lg md:text-xl font-semibold mt-2 text-primary">
            R$ {product.price.toFixed(2)}
          </div>
        </div>
      </div>
    </Card>
  );
};