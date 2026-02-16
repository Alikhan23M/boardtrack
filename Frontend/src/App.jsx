import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Client";
import Boards from "./pages/Boards";
import Deals from "./pages/Deals";
import Installments from "./pages/Installments";
import Printings from "./pages/Printings";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Router>
      <Toaster richColors position="top-right" />
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/boards" element={<Boards />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/installments" element={<Installments />} />
          <Route path="/printing-services" element={<Printings />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
