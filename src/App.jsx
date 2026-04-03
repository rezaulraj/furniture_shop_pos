import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import NewSalePage from "./pages/sale-module/NewSalePage";
import SaleHistoryPage from "./pages/sale-module/SaleHistoryPage";
import SaleReturnsPage from "./pages/sale-module/SaleReturnsPage";
import InstallmentsPage from "./pages/sale-module/InstallmentsPage";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path="/sales/new" element={<NewSalePage/>} />
          <Route path="/sales/history" element={<SaleHistoryPage/>} />
          <Route path="/sales/returns" element={<SaleReturnsPage/>} />
          <Route path="/sales/installments" element={<InstallmentsPage/>} />
          <Route path="/purchases/new" element={<div>New Purchase</div>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
