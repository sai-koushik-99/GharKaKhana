import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DishDetails from './pages/DishDetails';
import CustomerOrders from './pages/CustomerOrders';
import ChefDashboard from './pages/ChefDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ChefProfile from './pages/ChefProfile';
import ChefDiscovery from './pages/ChefDiscovery';
import ChefOnboarding from './pages/ChefOnboarding';
import ChefProfileEdit from './pages/ChefProfileEdit';
import HowItWorks from './pages/HowItWorks';

import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/dish/:id" element={<DishDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chefs" element={<ChefDiscovery />} />
            <Route path="/how-it-works" element={<HowItWorks />} />

            {/* Customer-only routes */}
            <Route
              path="/customer/orders"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerOrders />
                </ProtectedRoute>
              }
            />

            {/* Chef-only routes — static paths before dynamic :id */}
            <Route
              path="/chef/dashboard"
              element={
                <ProtectedRoute allowedRoles={['chef']}>
                  <ChefDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chef/onboarding"
              element={
                <ProtectedRoute allowedRoles={['chef']}>
                  <ChefOnboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chef/profile/edit"
              element={
                <ProtectedRoute allowedRoles={['chef']}>
                  <ChefProfileEdit />
                </ProtectedRoute>
              }
            />

            {/* Public chef profile — dynamic, must come after static /chef/* routes */}
            <Route path="/chef/:id" element={<ChefProfile />} />

            {/* Admin-only routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 — catch all unmatched routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
