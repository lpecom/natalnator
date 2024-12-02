import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "ready_for_pickup", label: "Ready for Pickup" },
  { value: "in_transit", label: "In Transit" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
}

export const OrderStatusSelect = ({ orderId, currentStatus }: OrderStatusSelectProps) => {
  const handleStatusChange = async (newStatus: string) => {
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

  return (
    <Select defaultValue={currentStatus} onValueChange={handleStatusChange}>
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
  );
};