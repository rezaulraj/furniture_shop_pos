import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import NewSalePage from "./pages/sale-module/NewSalePage";
import SaleHistoryPage from "./pages/sale-module/SaleHistoryPage";
import SaleReturnsPage from "./pages/sale-module/SaleReturnsPage";
import InstallmentsPage from "./pages/sale-module/InstallmentsPage";
import NewPurchase from "./pages/puchase-module/NewPurchase";
import PurchaseHistory from "./pages/puchase-module/PurchaseHistory";
import PurchaseReturn from "./pages/puchase-module/PurchaseReturn";
import NotFoundPage from "./components/NotFoundPage";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sales/new" element={<NewSalePage />} />
          <Route path="/sales/history" element={<SaleHistoryPage />} />
          <Route path="/sales/returns" element={<SaleReturnsPage />} />
          <Route path="/sales/installments" element={<InstallmentsPage />} />
          <Route path="/purchases/new" element={<NewPurchase />} />
          <Route path="/purchases/history" element={<PurchaseHistory />} />
          <Route path="/purchases/returns" element={<PurchaseReturn />} />
          <Route path="/purchases/new" element={<div>New Purchase</div>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
