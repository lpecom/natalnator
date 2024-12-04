import { Route } from "react-router-dom";
import AdminLayout from "@/components/layouts/AdminLayout";
import AdminProduct from "@/pages/AdminProduct";
import SiteAdmin from "@/pages/SiteAdmin";
import BannerAdmin from "@/pages/BannerAdmin";
import CommonPages from "@/pages/CommonPages";
import EditCommonPage from "@/pages/EditCommonPage";
import LandingPages from "@/pages/LandingPages";
import CreateLandingPage from "@/pages/CreateLandingPage";
import EditLandingPage from "@/pages/EditLandingPage";
import ProtectedRoute from "./ProtectedRoute";

export const AdminRoutes = [
  <Route
    key="admin-dashboard"
    path="/admin"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <AdminProduct />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-settings"
    path="/admin/settings"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <SiteAdmin />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-banners"
    path="/admin/banners"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <BannerAdmin />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-common-pages"
    path="/admin/common-pages"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <CommonPages />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-common-pages-edit"
    path="/admin/common-pages/:id/edit"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <EditCommonPage />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-products"
    path="/admin/products"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <LandingPages />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-products-create"
    path="/admin/products/create"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <CreateLandingPage />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-products-edit"
    path="/admin/products/:id/edit"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <EditLandingPage />
        </AdminLayout>
      </ProtectedRoute>
    }
  />
];