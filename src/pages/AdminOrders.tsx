import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import { OrdersTable } from "@/components/admin/orders/OrdersTable";

const AdminOrders = () => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          product:landing_page_products(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (error) {
    return (
      <div className="p-8">
        <AdminHeader title="Orders Management" />
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          Error loading orders: {(error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <AdminHeader title="Orders Management" />
      <div className="bg-white rounded-lg shadow">
        <OrdersTable orders={orders} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default AdminOrders;