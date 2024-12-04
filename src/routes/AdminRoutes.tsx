import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "@/components/layouts/AdminLayout";
import SiteAdmin from "@/pages/SiteAdmin";
import AdminProduct from "@/pages/AdminProduct";
import LandingPages from "@/pages/LandingPages";
import CreateLandingPage from "@/pages/CreateLandingPage";
import EditLandingPage from "@/pages/EditLandingPage";
import CommonPages from "@/pages/CommonPages";
import EditCommonPage from "@/pages/EditCommonPage";
import BannerAdmin from "@/pages/BannerAdmin";
import ImportProducts from "@/pages/ImportProducts";

export const adminRoutes = [
  <Route
    key="admin-dashboard"
    path="/admin"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <SiteAdmin />
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
          <AdminProduct />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-product-edit"
    path="/admin/products/:id"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <AdminProduct />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-import-products"
    path="/admin/import-products"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <ImportProducts />
        </AdminLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-landing-pages"
    path="/admin/landing-pages"
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
    path="/admin/landing-pages/create"
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
    path="/admin/landing-pages/:id/edit"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <EditLandingPage />
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
    key="admin-banners"
    path="/admin/banners"
    element={
      <ProtectedRoute>
        <AdminLayout>
          <BannerAdmin />
        </AdminLayout>
      </ProtectedRoute>
    }
  />
];