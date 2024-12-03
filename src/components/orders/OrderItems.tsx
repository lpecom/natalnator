import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { OrderDetailsType } from "@/types/order";
import { Plus, Minus, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface OrderItemsProps {
  order: OrderDetailsType;
  onUpdate: () => void;
}

export const OrderItems = ({ order, onUpdate }: OrderItemsProps) => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("landing_page_products")
        .select("*");
      return data;
    },
  });

  const { data: orderItems } = useQuery({
    queryKey: ["order-items", order.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("order_items")
        .select(`
          *,
          product:landing_page_products(*)
        `)
        .eq("order_id", order.id);
      return data;
    },
  });

  const handleAddProduct = async () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }

    const product = products?.find(p => p.id === selectedProduct);
    if (!product) return;

    try {
      setIsAddingProduct(true);
      const { error } = await supabase
        .from("order_items")
        .insert({
          order_id: order.id,
          product_id: selectedProduct,
          quantity,
          price: product.price,
        });

      if (error) throw error;
      
      toast.success("Product added to order");
      onUpdate();
      setSelectedProduct("");
      setQuantity(1);
    } catch (error) {
      toast.error("Failed to add product");
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("order_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      
      toast.success("Product removed from order");
      onUpdate();
    } catch (error) {
      toast.error("Failed to remove product");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Order Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orderItems?.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">{item.product?.name}</div>
              <div className="text-sm text-muted-foreground">
                Quantity: {item.quantity} × R$ {item.price}
              </div>
            </div>
            {order.call_center_confirmed && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemoveItem(item.id)}
              >
                <Minus className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}

        {order.call_center_confirmed && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Product to Order</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select a product...</option>
                    {products?.map((product: any) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - R$ {product.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
                <Button 
                  onClick={handleAddProduct}
                  disabled={isAddingProduct}
                  className="w-full"
                >
                  {isAddingProduct ? "Adding..." : "Add Product"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};