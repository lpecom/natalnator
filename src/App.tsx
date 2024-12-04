import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "./components/layouts/AdminLayout";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import LandingPages from "./pages/LandingPages";
import CreateLandingPage from "./pages/CreateLandingPage";
import EditLandingPage from "./pages/EditLandingPage";
import AdminProduct from "./pages/AdminProduct";
import SiteAdmin from "./pages/SiteAdmin";
import BannerAdmin from "./pages/BannerAdmin";
import ProductPage from "./pages/ProductPage";
import CommonPages from "./pages/CommonPages";
import EditCommonPage from "./pages/EditCommonPage";
import ViewCommonPage from "./pages/ViewCommonPage";
import Catalog from "./pages/Catalog";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAdmin(false);
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (error || !profile?.is_admin) {
          setIsAdmin(false);
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAdmin === null) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
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
          <Route path="/admin/login" element={<AdminLogin />} />
          
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
          <Route path="/admin/banners" element={
            <ProtectedRoute>
              <AdminLayout>
                <BannerAdmin />
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
          <Route path="/products" element={
            <ProtectedRoute>
              <AdminLayout>
                <LandingPages />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/products/create" element={
            <ProtectedRoute>
              <AdminLayout>
                <CreateLandingPage />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/products/:id/edit" element={
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