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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  { value: "ready_for_pickup", label: "Ready for Pickup", color: "bg-purple-100 text-purple-800" },
  { value: "in_transit", label: "In Transit", color: "bg-indigo-100 text-indigo-800" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

const AdminOrders = () => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<string>("all");

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders", statusFilter, timeFilter],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select(`
          *,
          product:landing_page_products(name, price),
          driver:drivers(name)
        `)
        .order("created_at", { ascending: false });

      if (statusFilter) {
        query = query.eq("order_status", statusFilter);
      }

      if (timeFilter === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query = query.gte("created_at", today.toISOString());
      }

      const { data, error } = await query;

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
      const statusHistory = {
        status: newStatus,
        timestamp: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("orders")
        .update({ 
          order_status: newStatus,
          updated_at: new Date().toISOString(),
          status_history: supabase.sql`status_history || ${JSON.stringify([statusHistory])}::jsonb`,
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

  const getStatusBadgeColor = (status: string) => {
    return statusOptions.find(opt => opt.value === status)?.color || "bg-gray-100 text-gray-800";
  };

  if (ordersLoading) {
    return <div className="p-8">Loading orders...</div>;
  }

  return (
    <div className="p-8">
      <AdminHeader title="Orders Management" />
      
      <div className="mb-6 flex items-center gap-4">
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(statusFilter || timeFilter !== "all") && (
          <Button
            variant="outline"
            onClick={() => {
              setStatusFilter("");
              setTimeFilter("all");
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">
                  {order.id.split("-")[0]}
                </TableCell>
                <TableCell>
                  {format(new Date(order.created_at), "MMM d, yyyy p")}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.customer_name}</div>
                    <div className="text-sm text-gray-500">{order.phone_number}</div>
                  </div>
                </TableCell>
                <TableCell>{order.product?.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusBadgeColor(order.order_status)}>
                      {statusOptions.find(s => s.value === order.order_status)?.label || order.order_status}
                    </Badge>
                    <Select
                      value={order.order_status}
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
                  </div>
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
                <TableCell className="font-medium">
                  ${order.product?.price || 0}
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