import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LandingPages from "./pages/LandingPages";
import CreateLandingPage from "./pages/CreateLandingPage";
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
          <Route path="/" element={<Index />} />
          <Route path="/p/:id" element={<ProductPage />} />
          <Route path="/landing-pages" element={<LandingPages />} />
          <Route path="/landing-pages/create" element={<CreateLandingPage />} />
          <Route path="/admin" element={<AdminProduct />} />
          <Route path="/admin/site" element={<SiteAdmin />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;