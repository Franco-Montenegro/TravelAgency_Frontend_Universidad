import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import PackageCatalog from '../pages/client/PackageCatalog';
import PackageManagement from '../pages/admin/PackageManagement';
import MyBookings from '../pages/client/MyBookings';
import AdminDashboard from '../pages/admin/AdminDashboard';
import { ProtectedRoute } from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas Públicas / Generales */}
      <Route path="/" element={<Home />} />

      {/* Rutas Cliente */}
      <Route path="/packages" element={
        <ProtectedRoute roles={['CLIENT']}>
          <PackageCatalog />
        </ProtectedRoute>
      } />
      <Route path="/my-bookings" element={
        <ProtectedRoute roles={['CLIENT']}>
          <MyBookings />
        </ProtectedRoute>
      } />

      {/* Rutas de Administración */}
      <Route path="/admin/packages" element={
        <ProtectedRoute roles={['ADMIN']}>
          <PackageManagement />
        </ProtectedRoute>
      } />
  
      <Route path="/admin/dashboard" element={
        <ProtectedRoute roles={['ADMIN']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Comodín: Redirige cualquier URL errónea al Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}