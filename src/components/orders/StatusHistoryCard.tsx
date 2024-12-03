import { History } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderDetailsType } from "@/types/order";
import { format } from "date-fns";
import { formatStatus } from "@/lib/utils";

export const StatusHistoryCard = ({ order }: { order: OrderDetailsType }) => {
  return (
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
  );
};