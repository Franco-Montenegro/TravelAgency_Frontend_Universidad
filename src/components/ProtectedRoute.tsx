import { Navigate } from 'react-router-dom';
import keycloak from '../config/keycloak';
import { api } from '../services/api';
import type { JSX } from 'react';

interface Props {
  children: JSX.Element;
  roles?: string[];
}

export const ProtectedRoute = ({ children, roles }: Props) => {
  if (!keycloak.authenticated) {
    keycloak.login();
    return null;
  }
  const syncState = sessionStorage.getItem('sync_status');

  if (!syncState && keycloak.tokenParsed) {
    sessionStorage.setItem('sync_status', 'PROCESSING');

    api.post('/users/sync')
      .then(() => {
        sessionStorage.setItem('sync_status', 'COMPLETED');
        console.log("Sincronización JIT completada con éxito.");
      })
      .catch((err) => {
        if (err.response?.status === 500) {
          sessionStorage.setItem('sync_status', 'COMPLETED');
        } else {
          sessionStorage.removeItem('sync_status');
          console.error("Fallo al sincronizar usuario:", err);
        }
      });
  }

  if (roles && !roles.some(r => keycloak.hasRealmRole(r))) {
    return <Navigate to="/" replace />;
  }

  return children;
};