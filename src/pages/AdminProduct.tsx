import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import BasicProductInfo from "@/components/admin/BasicProductInfo";
import ProductImages from "@/components/admin/ProductImages";
import ProductVariants from "@/components/admin/ProductVariants";
import ReviewsManager from "@/components/admin/ReviewsManager";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const AdminProduct = () => {
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["admin-product"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_page_products")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <AdminHeader title="Product Management" />
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <AdminHeader title="Product Management" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading product: {(error as Error).message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <AdminHeader title="Product Management" />
      <div className="space-y-6">
        <BasicProductInfo product={product} />
        <ProductImages productId={product?.id} />
        <ProductVariants productId={product?.id} />
        <ReviewsManager landingPageId={product?.landing_page_id} />
      </div>
    </div>
  );
};

export default AdminProduct;