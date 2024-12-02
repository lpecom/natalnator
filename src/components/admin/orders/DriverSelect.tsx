import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface DriverSelectProps {
  orderId: string;
  currentDriverId: string | null;
}

export const DriverSelect = ({ orderId, currentDriverId }: DriverSelectProps) => {
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

  const handleDriverAssignment = async (driverId: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ 
          driver_id: driverId || null,
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

  return (
    <Select value={currentDriverId || ""} onValueChange={handleDriverAssignment}>
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
  );
};