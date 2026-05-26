// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import PackageCatalog from '../pages/client/PackageCatalog';
import PackageManagement from '../pages/admin/PackageManagement';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas Públicas / Generales */}
      <Route path="/" element={<Home />} />
      <Route path="/packages" element={<PackageCatalog />} />

      {/* Rutas de Administración */}
      <Route path="/admin/packages" element={<PackageManagement />} />

      {/* Comodín: Redirige cualquier URL errónea al Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}