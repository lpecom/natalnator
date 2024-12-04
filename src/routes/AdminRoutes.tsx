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
    key="admin-landing-pages"
    path="/landing-pages"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <LandingPages />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-landing-pages-create"
    path="/landing-pages/create"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <CreateLandingPage />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-landing-pages-edit"
    path="/landing-pages/:id/edit"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <EditLandingPage />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-product-edit"
    path="/admin/product/:id"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <AdminProduct />
        </AdminLayout>
      </ProtectedRoute>
    }
  />
];