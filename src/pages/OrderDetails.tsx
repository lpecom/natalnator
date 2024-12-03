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
      const { data, error } = await supabase
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
      return {
        ...data,
        status_history: (data.status_history || []) as StatusHistoryEntry[]
      };
    },
  });

  const updateOrderStatus = async (newStatus: string) => {
    try {
      const statusHistory = [
        ...(order?.status_history || []),
        {
          status: newStatus,
          timestamp: new Date().toISOString(),
        },
      ];

      const updates: Partial<OrderDetailsType> = {
        order_status: newStatus,
        status_history: statusHistory,
      };

      // Add specific date fields based on status
      if (newStatus === "confirmed") {
        updates.confirmation_date = new Date().toISOString();
      } else if (newStatus === "ready_for_pickup") {
        updates.pickup_date = new Date().toISOString();
      } else if (newStatus === "delivered") {
        updates.delivery_date = new Date().toISOString();
      }

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