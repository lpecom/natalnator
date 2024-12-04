import { Route } from "react-router-dom";
import Index from "@/pages/Index";
import Catalog from "@/pages/Catalog";
import ProductPage from "@/pages/ProductPage";
import ViewCommonPage from "@/pages/ViewCommonPage";
import AdminLogin from "@/pages/AdminLogin";

export const PublicRoutes = [
  <Route key="home" path="/" element={<Index />} />,
  <Route key="catalog" path="/catalog" element={<Catalog />} />,
  <Route key="product" path="/p/:id" element={<ProductPage />} />,
  <Route key="common-page" path="/pages/:slug" element={<ViewCommonPage />} />,
  <Route key="admin-login" path="/admin/login" element={<AdminLogin />} />
];