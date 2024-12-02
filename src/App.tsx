import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LandingPages from "./pages/LandingPages";
import CreateLandingPage from "./pages/CreateLandingPage";
import EditLandingPage from "./pages/EditLandingPage";
import AdminProduct from "./pages/AdminProduct";
import CatalogScraper from "./pages/CatalogScraper";
import ViewLandingPage from "./pages/ViewLandingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/landing-pages" element={<LandingPages />} />
          <Route path="/landing-pages/create" element={<CreateLandingPage />} />
          <Route path="/landing-pages/:id" element={<ViewLandingPage />} />
          <Route path="/landing-pages/:id/edit" element={<EditLandingPage />} />
          <Route path="/landing-pages/:id/admin" element={<AdminProduct />} />
          <Route path="/catalog-scraper" element={<CatalogScraper />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;