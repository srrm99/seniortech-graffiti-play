import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserPreferencesProvider } from "./contexts/UserPreferencesContext";
import LanguageSelection from "./pages/LanguageSelection";
import Home from "./pages/Home";
import Games from "./pages/Games";
import InfoAssistant from "./pages/Help";
import EnglishCompanions from "./pages/companions/EnglishCompanions";
import HindiCompanions from "./pages/companions/HindiCompanions";
import EnglishReadings from "./pages/readings/EnglishReadings";
import HindiReadings from "./pages/readings/HindiReadings";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <UserPreferencesProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<LanguageSelection />} />
            <Route path="/home" element={<Home />} />
            <Route path="/games" element={<Games />} />
            <Route path="/info-assistant" element={<InfoAssistant />} />
            <Route path="/companions/english" element={<EnglishCompanions />} />
            <Route path="/companions/hindi" element={<HindiCompanions />} />
            <Route path="/readings/english" element={<EnglishReadings />} />
            <Route path="/readings/hindi" element={<HindiReadings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </TooltipProvider>
      </UserPreferencesProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;