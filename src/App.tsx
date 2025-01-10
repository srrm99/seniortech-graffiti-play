import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LanguageSelection from "./pages/LanguageSelection";
import Home from "./pages/Home";
import Games from "./pages/Games";
import InfoAssistant from "./pages/Help";
import Companions from "./pages/Companions";
import DailyReadings from "./pages/DailyReadings";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<LanguageSelection />} />
          <Route path="/home" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/info-assistant" element={<InfoAssistant />} />
          <Route path="/companions" element={<Companions />} />
          <Route path="/daily-readings" element={<DailyReadings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;