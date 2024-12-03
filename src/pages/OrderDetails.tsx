import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  ClipboardList,
  User,
  Package,
  MapPin,
  History,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";
import { OrderDetails as OrderDetailsType, StatusHistoryEntry } from "@/types/order";
import { Database } from "@/integrations/supabase/types";

type OrderResponse = Database["public"]["Tables"]["orders"]["Row"] & {
  product: (Database["public"]["Tables"]["landing_page_products"]["Row"] & {
    name: string;
    price: number;
    original_price: number | null;
    description_html: string | null;
  })[];
  driver: {
    name: string;
    phone_number: string;
  }[];
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "ready_for_pickup":
      return "bg-purple-100 text-purple-800";
    case "in_transit":
      return "bg-indigo-100 text-indigo-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case "ready_for_pickup":
      return "Ready for Pickup";
    case "in_transit":
      return "In Transit";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

const OrderDetails = () => {
  const { orderId } = useParams();

  const { data: order, isLoading } = useQuery<OrderDetailsType>({
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

      if (error) throw error;

      const rawOrder = orderData as OrderResponse;

      // Transform the data to match our TypeScript interface
      const transformedOrder: OrderDetailsType = {
        ...rawOrder,
        status_history: (rawOrder.status_history as any[] || []).map((entry) => ({
          status: entry.status as string,
          timestamp: entry.timestamp as string,
        })),
        variant_selections: rawOrder.variant_selections as Record<string, string> | null,
        product: rawOrder.product?.[0] || null,
        driver: rawOrder.driver?.[0] || null
      };

      return transformedOrder;
    },
  });

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    try {
      const statusHistory = [
        ...(order.status_history || []),
        {
          status: newStatus,
          timestamp: new Date().toISOString(),
        },
      ];

      const updates: Database["public"]["Tables"]["orders"]["Update"] = {
        order_status: newStatus,
        status_history: statusHistory as any,
        confirmation_date: newStatus === "confirmed" ? new Date().toISOString() : undefined,
        pickup_date: newStatus === "ready_for_pickup" ? new Date().toISOString() : undefined,
        delivery_date: newStatus === "delivered" ? new Date().toISOString() : undefined,
      };

      const { error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", orderId);

      if (error) throw error;
      toast.success(`Order status updated to ${formatStatus(newStatus)}`);
    } catch (error) {
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
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="font-medium">{order.customer_name}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                {order.phone_number}
              </div>
              {order.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {order.email}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
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
                      {key}: {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div>{order.address}</div>
              <div>
                {order.city}, {order.state} {order.postal_code}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Status History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.status_history.map((history, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                  <div>
                    <div className="font-medium">
                      {formatStatus(history.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(history.timestamp), "PPp")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Panel */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            Actions
          </CardTitle>
          <CardDescription>
            Manage order status and add notes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {order.order_status === "pending" && (
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => updateOrderStatus("confirmed")}
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirm Order
                </Button>
              )}
              {order.order_status === "confirmed" && (
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => updateOrderStatus("ready_for_pickup")}
                >
                  <Truck className="w-4 h-4" />
                  Mark Ready for Pickup
                </Button>
              )}
              {order.order_status === "ready_for_pickup" && (
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => updateOrderStatus("in_transit")}
                >
                  <Truck className="w-4 h-4" />
                  Start Delivery
                </Button>
              )}
              {order.order_status === "in_transit" && (
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => updateOrderStatus("delivered")}
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Delivered
                </Button>
              )}
              {["pending", "confirmed", "ready_for_pickup", "in_transit"].includes(
                order.order_status
              ) && (
                <Button
                  variant="outline"
                  className="gap-2 text-destructive"
                  onClick={() => updateOrderStatus("cancelled")}
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;