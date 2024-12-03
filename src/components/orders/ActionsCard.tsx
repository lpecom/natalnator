import { ClipboardList, CheckCircle, XCircle, Truck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderDetailsType } from "@/types/order";

interface ActionsCardProps {
  order: OrderDetailsType;
  onUpdateStatus: (status: string) => void;
}

export const ActionsCard = ({ order, onUpdateStatus }: ActionsCardProps) => {
  return (
    <Card>
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
                onClick={() => onUpdateStatus("confirmed")}
              >
                <CheckCircle className="w-4 h-4" />
                Confirm Order
              </Button>
            )}
            {order.order_status === "confirmed" && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => onUpdateStatus("ready_for_pickup")}
              >
                <Truck className="w-4 h-4" />
                Mark Ready for Pickup
              </Button>
            )}
            {order.order_status === "ready_for_pickup" && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => onUpdateStatus("in_transit")}
              >
                <Truck className="w-4 h-4" />
                Start Delivery
              </Button>
            )}
            {order.order_status === "in_transit" && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => onUpdateStatus("delivered")}
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
                onClick={() => onUpdateStatus("cancelled")}
              >
                <XCircle className="w-4 h-4" />
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};