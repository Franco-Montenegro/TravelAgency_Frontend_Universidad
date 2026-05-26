import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'CLIENT' | 'ADMIN' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  userEmail: string | null;
  loginAs: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [email, setEmail] = useState<string | null>(null);

  const loginAs = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setEmail(selectedRole ? `test-${selectedRole.toLowerCase()}@usach.cl` : null);
    console.log(`[Mingeso-Auth] Modo simulado activo: ${selectedRole}`);
  };

  const logout = () => {
    setRole(null);
    setEmail(null);
    console.log('[Mingeso-Auth] Sesión simulada finalizada');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: role !== null,
      userRole: role,
      userEmail: email,
      loginAs,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}