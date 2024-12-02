import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusSelect } from "./OrderStatusSelect";
import { DriverSelect } from "./DriverSelect";

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  phone_number: string;
  order_status: string;
  driver_id: string | null;
  product: { name: string } | null;
}

interface OrdersTableProps {
  orders: Order[] | null;
  isLoading: boolean;
}

export const OrdersTable = ({ orders, isLoading }: OrdersTableProps) => {
  if (isLoading) {
    return (
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
          {[...Array(3)].map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell>
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-8 w-[180px]" /></TableCell>
              <TableCell><Skeleton className="h-8 w-[180px]" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (!orders || orders.length === 0) {
    return (
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
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
              No orders found
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
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
        {orders.map((order) => (
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
              <OrderStatusSelect 
                orderId={order.id} 
                currentStatus={order.order_status} 
              />
            </TableCell>
            <TableCell>
              <DriverSelect 
                orderId={order.id} 
                currentDriverId={order.driver_id} 
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};