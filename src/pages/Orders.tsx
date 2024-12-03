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
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "ready_for_pickup":
      return "bg-purple-100 text-purple-800";
    case "in_transit":
      return "bg-indigo-100 text-indigo-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case "ready_for_pickup":
      return "Ready for Pickup";
    case "in_transit":
      return "In Transit";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

const Orders = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          product:landing_page_products(name, price)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getTodayOrders = () => {
    if (!orders) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });
  };

  const getFilteredOrders = (status: string) => {
    if (!orders) return [];
    return orders.filter((order) => order.order_status === status);
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <AdminHeader title="Orders" />
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="today">Today's Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="ready">Ready for Pickup</TabsTrigger>
          <TabsTrigger value="transit">In Transit</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="rounded-md border">
          <OrdersTable orders={orders || []} />
        </TabsContent>

        <TabsContent value="today" className="rounded-md border">
          <OrdersTable orders={getTodayOrders()} />
        </TabsContent>

        <TabsContent value="pending" className="rounded-md border">
          <OrdersTable orders={getFilteredOrders('pending')} />
        </TabsContent>

        <TabsContent value="ready" className="rounded-md border">
          <OrdersTable orders={getFilteredOrders('ready_for_pickup')} />
        </TabsContent>

        <TabsContent value="transit" className="rounded-md border">
          <OrdersTable orders={getFilteredOrders('in_transit')} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const OrdersTable = ({ orders }: { orders: any[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{order.customer_name}</div>
                <div className="text-sm text-muted-foreground">{order.phone_number}</div>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                <div>{order.address}</div>
                <div>{order.city}, {order.state} {order.postal_code}</div>
              </div>
            </TableCell>
            <TableCell>{formatCurrency(order.product?.price || 0)}</TableCell>
            <TableCell>
              <Badge variant="secondary" className={getStatusColor(order.order_status)}>
                {formatStatus(order.order_status)}
              </Badge>
            </TableCell>
            <TableCell>
              {format(new Date(order.created_at), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-[110px]"
                >
                  View Details
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Orders;