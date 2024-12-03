import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { OrderDetailsType } from "@/types/order";
import { CheckCircle } from "lucide-react";

interface CallCenterActionsProps {
  order: OrderDetailsType;
  onUpdate: () => void;
}

export const CallCenterActions = ({ order, onUpdate }: CallCenterActionsProps) => {
  const [notes, setNotes] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirmOrder = async () => {
    try {
      setIsConfirming(true);
      const { error } = await supabase
        .from("orders")
        .update({
          call_center_confirmed: true,
          call_center_confirmed_at: new Date().toISOString(),
          call_center_notes: notes,
        })
        .eq("id", order.id);

      if (error) throw error;
      
      toast.success("Order confirmed by call center");
      onUpdate();
    } catch (error) {
      toast.error("Failed to confirm order");
    } finally {
      setIsConfirming(false);
    }
  };

  if (order.call_center_confirmed) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="success" className="gap-1">
          <CheckCircle className="w-4 h-4" />
          Confirmed by Call Center
        </Badge>
        {order.call_center_notes && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">View Notes</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Call Center Notes</DialogTitle>
              </DialogHeader>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                {order.call_center_notes}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Confirm Order</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any relevant notes about the order confirmation..."
              className="min-h-[100px]"
            />
          </div>
          <Button 
            onClick={handleConfirmOrder}
            disabled={isConfirming}
            className="w-full"
          >
            {isConfirming ? "Confirming..." : "Confirm Order"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};