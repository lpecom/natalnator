import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layouts/AdminLayout";
import Index from "./pages/Index";
import LandingPages from "./pages/LandingPages";
import CreateLandingPage from "./pages/CreateLandingPage";
import EditLandingPage from "./pages/EditLandingPage";
import AdminProduct from "./pages/AdminProduct";
import SiteAdmin from "./pages/SiteAdmin";
import ProductPage from "./pages/ProductPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/p/:id" element={<ProductPage />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={
            <AdminLayout>
              <AdminProduct />
            </AdminLayout>
          } />
          <Route path="/admin/site" element={
            <AdminLayout>
              <SiteAdmin />
            </AdminLayout>
          } />
          <Route path="/landing-pages" element={
            <AdminLayout>
              <LandingPages />
            </AdminLayout>
          } />
          <Route path="/landing-pages/create" element={
            <AdminLayout>
              <CreateLandingPage />
            </AdminLayout>
          } />
          <Route path="/landing-pages/:id/edit" element={
            <AdminLayout>
              <EditLandingPage />
            </AdminLayout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;