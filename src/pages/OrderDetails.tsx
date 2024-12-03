import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { OrderDetailsType } from "@/types/order";
import { CustomerCard } from "@/components/orders/CustomerCard";
import { ProductCard } from "@/components/orders/ProductCard";
import { AddressCard } from "@/components/orders/AddressCard";
import { StatusHistoryCard } from "@/components/orders/StatusHistoryCard";
import { ActionsCard } from "@/components/orders/ActionsCard";
import { formatStatus, getStatusColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const customerFormSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  phone_number: z.string().min(10, "Phone number must be at least 10 characters"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postal_code: z.string().min(5, "Postal code must be at least 5 characters"),
});

const OrderDetails = () => {
  const { orderId } = useParams();

  const { data: order, isLoading, error, refetch } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!orderId) throw new Error("Order ID is required");

      const { data: orderData, error } = await supabase
        .from("orders")
        .select(`
          *,
          product:landing_page_products(
            name,
            price,
            original_price,
            description_html
          )
        `)
        .eq("id", orderId)
        .single();

      if (error) {
        console.error("Error fetching order:", error);
        throw error;
      }

      if (!orderData) {
        console.error("No order data found for ID:", orderId);
        throw new Error("Order not found");
      }

      const transformedOrder: OrderDetailsType = {
        ...orderData,
        status_history: (orderData.status_history as any[] || []).map((entry) => ({
          status: entry.status as string,
          timestamp: entry.timestamp as string,
        })),
        variant_selections: orderData.variant_selections as Record<string, string> | null,
        product: orderData.product?.[0] || null,
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

      const updates = {
        order_status: newStatus,
        status_history: statusHistory.map(entry => ({
          status: entry.status,
          timestamp: entry.timestamp
        })),
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
      refetch();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const updateCustomerDetails = async (values: z.infer<typeof customerFormSchema>) => {
    if (!orderId) return;

    try {
      const { error } = await supabase
        .from("orders")
        .update(values)
        .eq("id", orderId);

      if (error) throw error;
      toast.success("Customer details updated successfully");
      refetch();
    } catch (error) {
      console.error("Error updating customer details:", error);
      toast.error("Failed to update customer details");
    }
  };

  const EditCustomerDialog = () => {
    const form = useForm<z.infer<typeof customerFormSchema>>({
      resolver: zodResolver(customerFormSchema),
      defaultValues: {
        customer_name: order?.customer_name || "",
        phone_number: order?.phone_number || "",
        email: order?.email || "",
        address: order?.address || "",
        city: order?.city || "",
        state: order?.state || "",
        postal_code: order?.postal_code || "",
      },
    });

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">Edit Customer Details</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Customer Details</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(updateCustomerDetails)} className="space-y-4">
              <FormField
                control={form.control}
                name="customer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Save Changes</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  };

  if (error) {
    return <div className="p-8">Error loading order: {error.message}</div>;
  }

  if (isLoading) {
    return <div className="p-8">Loading order details...</div>;
  }

  if (!order) {
    return <div className="p-8">Order not found</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <Badge className={getStatusColor(order.order_status)}>
          {formatStatus(order.order_status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CustomerCard order={order} />
          <EditCustomerDialog />
        </div>
        <ProductCard order={order} />
        <AddressCard order={order} />
        <StatusHistoryCard order={order} />
      </div>

      <div>
        <ActionsCard order={order} onUpdateStatus={updateOrderStatus} />
      </div>
    </div>
  );
};

export default OrderDetails;