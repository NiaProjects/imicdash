import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import Services from "./pages/admin/Services";
import AboutUs from "./pages/admin/AboutUs";
import WhyChooseUs from "./pages/admin/WhyChooseUs";
import Clients from "./pages/admin/Clients";
import Categories from "./pages/admin/Categories";
import Projects from "./pages/admin/Projects";
import Testimonials from "./pages/admin/Testimonials";
import ContactMessages from "./pages/admin/ContactMessages";
import NewsManagement from "./pages/admin/News";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                {/* <Route index element={<Dashboard />} /> */}
                <Route index element={<Services />} />
                <Route path="about" element={<AboutUs />} />
                <Route path="why-choose-us" element={<WhyChooseUs />} />
                <Route path="clients" element={<Clients />} />
                <Route path="categories" element={<Categories />} />
                <Route path="projects" element={<Projects />} />
                <Route path="news" element={<NewsManagement />} />
                <Route path="testimonials" element={<Testimonials />} />
                <Route path="messages" element={<ContactMessages />} />
                <Route
                  path="contact-info"
                  element={<div>Contact Info Management</div>}
                />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
