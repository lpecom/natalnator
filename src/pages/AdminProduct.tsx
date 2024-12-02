import React from "react";
import BasicProductInfo from "@/components/admin/BasicProductInfo";
import ProductImages from "@/components/admin/ProductImages";
import ProductVariants from "@/components/admin/ProductVariants";
import ReviewsManager from "@/components/admin/ReviewsManager";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminProduct } from "@/hooks/useAdminProduct";

const AdminProduct = () => {
  const { product, loading, loadProduct } = useAdminProduct();

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <AdminHeader title="Product Administration" />
      <div className="grid gap-6">
        {product && (
          <>
            <BasicProductInfo product={product} onUpdate={loadProduct} />
            <ProductImages product={product} onUpdate={loadProduct} />
            <ProductVariants product={product} onUpdate={loadProduct} />
            <ReviewsManager landingPageId={product.landing_page_id} />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProduct;