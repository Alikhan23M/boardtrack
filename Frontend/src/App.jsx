import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import DashboardLayout from "./layouts/DashboardLayout";
import PublicLayout from "./layouts/PublicLayout";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import Clients from "./pages/admin/Client";
import Boards from "./pages/admin/Boards";
import Deals from "./pages/admin/Deals";
import Installments from "./pages/admin/Installments";
import Printings from "./pages/admin/Printings";

// Public pages
import Home from "./pages/public/Home";
import AllBoards from "./pages/public/AllBoards";
import BoardDetails from "./pages/public/BoardDetails";
import Contact from "./pages/public/Contact";
import Messages from "./pages/admin/Messages";

function App() {
  return (
    <Router>
      <Toaster richColors position="top-right" />

      <Routes>

        {/* 🌍 PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/boards" element={<AllBoards />} />
          <Route path="/boards/:id" element={<BoardDetails />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* 🔐 ADMIN ROUTES */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="boards" element={<Boards />} />
          <Route path="deals" element={<Deals />} />
          <Route path="installments" element={<Installments />} />
          <Route path="printing-services" element={<Printings />} />
          <Route path="messages" element={<Messages />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;