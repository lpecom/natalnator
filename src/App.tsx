import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/layouts/AdminLayout";
import Index from "./pages/Index";
import LandingPages from "./pages/LandingPages";
import CreateLandingPage from "./pages/CreateLandingPage";
import EditLandingPage from "./pages/EditLandingPage";
import AdminProduct from "./pages/AdminProduct";
import SiteAdmin from "./pages/SiteAdmin";
import ProductPage from "./pages/ProductPage";
import CommonPages from "./pages/CommonPages";
import EditCommonPage from "./pages/EditCommonPage";
import ViewCommonPage from "./pages/ViewCommonPage";
import Catalog from "./pages/Catalog";

const queryClient = new QueryClient();

// Simple authentication check - in a real app, you'd want to use a proper auth system
const isAuthenticated = () => {
  // For development, we'll always return true
  // In production, this should check for actual authentication
  return process.env.NODE_ENV === 'development';
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/p/:id" element={<ProductPage />} />
          <Route path="/pages/:slug" element={<ViewCommonPage />} />
          
          {/* Protected Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminProduct />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/site" element={
            <ProtectedRoute>
              <AdminLayout>
                <SiteAdmin />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/common-pages" element={
            <ProtectedRoute>
              <AdminLayout>
                <CommonPages />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/common-pages/:id/edit" element={
            <ProtectedRoute>
              <AdminLayout>
                <EditCommonPage />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/landing-pages" element={
            <ProtectedRoute>
              <AdminLayout>
                <LandingPages />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/landing-pages/create" element={
            <ProtectedRoute>
              <AdminLayout>
                <CreateLandingPage />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/landing-pages/:id/edit" element={
            <ProtectedRoute>
              <AdminLayout>
                <EditLandingPage />
              </AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;