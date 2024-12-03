import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { OrderDetailsType, StatusHistoryEntry } from "@/types/order";
import { CustomerCard } from "@/components/orders/CustomerCard";
import { ProductCard } from "@/components/orders/ProductCard";
import { AddressCard } from "@/components/orders/AddressCard";
import { StatusHistoryCard } from "@/components/orders/StatusHistoryCard";
import { ActionsCard } from "@/components/orders/ActionsCard";
import { formatStatus, getStatusColor } from "@/lib/utils";

const OrderDetails = () => {
  const { orderId } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data: orderData, error } = await supabase
        .from("orders")
        .select(`
          *,
          product:landing_page_products(
            name,
            price,
            original_price,
            description_html
          ),
          driver:drivers(
            name,
            phone_number
          )
        `)
        .eq("id", orderId)
        .single();

      if (error) {
        console.error("Error fetching order:", error);
        throw error;
      }

      if (!orderData) {
        throw new Error("Order not found");
      }

      // Transform the data to match our type
      const transformedOrder: OrderDetailsType = {
        ...orderData,
        status_history: (orderData.status_history as any[] || []).map((entry) => ({
          status: entry.status as string,
          timestamp: entry.timestamp as string,
        })),
        variant_selections: orderData.variant_selections as Record<string, string> | null,
        product: orderData.product?.[0] || null,
        driver: orderData.driver?.[0] || null,
      };

      return transformedOrder;
    },
  });

  const updateOrderStatus = async (newStatus: string) => {
    if (!order || !orderId) return;

    try {
      const statusHistory = [
        ...(order.status_history || []),
        {
          status: newStatus,
          timestamp: new Date().toISOString(),
        },
      ];

      // Transform the status history to match Supabase's expected JSON type
      const updates = {
        order_status: newStatus,
        status_history: statusHistory as unknown as any[],
        confirmation_date: newStatus === "confirmed" ? new Date().toISOString() : order.confirmation_date,
        pickup_date: newStatus === "ready_for_pickup" ? new Date().toISOString() : order.pickup_date,
        delivery_date: newStatus === "delivered" ? new Date().toISOString() : order.delivery_date,
      };

      const { error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", orderId);

      if (error) throw error;
      toast.success(`Order status updated to ${formatStatus(newStatus)}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!order) {
    return <div className="p-8">Order not found</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <Badge className={getStatusColor(order.order_status)}>
          {formatStatus(order.order_status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomerCard order={order} />
        <ProductCard order={order} />
        <AddressCard order={order} />
        <StatusHistoryCard order={order} />
      </div>

      <div className="mt-6">
        <ActionsCard order={order} onUpdateStatus={updateOrderStatus} />
      </div>
    </div>
  );
};

export default OrderDetails;