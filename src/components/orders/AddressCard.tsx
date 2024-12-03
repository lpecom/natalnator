import { MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderDetailsType } from "@/types/order";

export const AddressCard = ({ order }: { order: OrderDetailsType }) => {
  return (
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
  );
};