import { Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderDetailsType } from "@/types/order";
import { formatCurrency } from "@/lib/utils";

export const ProductCard = ({ order }: { order: OrderDetailsType }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Product Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="font-medium">{order.product?.name}</div>
          <div className="text-sm text-muted-foreground">
            Price: {formatCurrency(order.product?.price || 0)}
          </div>
          {order.variant_selections && Object.keys(order.variant_selections).length > 0 && (
            <div className="mt-2">
              <div className="text-sm font-medium">Selected Options:</div>
              {Object.entries(order.variant_selections).map(([key, value]) => (
                <div key={key} className="text-sm text-muted-foreground">
                  {key}: {String(value)}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};