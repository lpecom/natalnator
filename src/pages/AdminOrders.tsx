import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "ready_for_pickup", label: "Ready for Pickup" },
  { value: "in_transit", label: "In Transit" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const AdminOrders = () => {
  const [selectedDriver, setSelectedDriver] = useState<string>("");

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          product:landing_page_products(name),
          driver:drivers(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: drivers } = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;
      return data;
    },
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ 
          order_status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleDriverAssignment = async (orderId: string, driverId: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ 
          driver_id: driverId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;
      toast.success("Driver assigned successfully");
    } catch (error) {
      console.error("Error assigning driver:", error);
      toast.error("Failed to assign driver");
    }
  };

  if (ordersLoading) {
    return <div className="p-8">Loading orders...</div>;
  }

  return (
    <div className="p-8">
      <AdminHeader title="Orders Management" />
      
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Driver</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">
                  {order.id.split("-")[0]}
                </TableCell>
                <TableCell>
                  {format(new Date(order.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.customer_name}</div>
                    <div className="text-sm text-gray-500">{order.phone_number}</div>
                  </div>
                </TableCell>
                <TableCell>{order.product?.name}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={order.order_status}
                    onValueChange={(value) => handleStatusChange(order.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={order.driver_id || ""}
                    onValueChange={(value) => handleDriverAssignment(order.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Assign driver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No driver</SelectItem>
                      {drivers?.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrders;