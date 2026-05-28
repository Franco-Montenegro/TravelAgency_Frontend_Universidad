import { AppBar, Toolbar, Typography, Button, Stack, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import keycloak from '../config/keycloak'; // Importa tu instancia real

export default function Navbar() {
  const navigate = useNavigate();

  // Verificamos roles directamente desde Keycloak
  const isAuthenticated = keycloak.authenticated;
  const isAdmin = keycloak.hasRealmRole('ADMIN');
  const isClient = keycloak.hasRealmRole('CLIENT');
  const userName = keycloak.tokenParsed?.preferred_username || 'Usuario';

  const handleLogout = () => {

  sessionStorage.removeItem('token');
  keycloak.logout({ 
    redirectUri: window.location.origin + '/' 
  });
};

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => navigate('/')}
        >
          ✈️ TravelAgency
        </Typography>

        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Chip 
                label={userName} 
                color="secondary" 
                variant="outlined" 
                sx={{ color: '#fff', borderColor: '#fff' }}
              />
              
              {/* Botones visibles para todos los autenticados */}
              <Button color="inherit" onClick={() => navigate('/packages')}>Catálogo</Button>
              
              {isClient && (
                <Button color="inherit" onClick={() => navigate('/my-bookings')}>Mis Reservas</Button>
              )}
              
              {isAdmin && (
                <>
                  <Button color="inherit" onClick={() => navigate('/admin/packages')}>Admin Paquetes</Button>
                  <Button color="inherit" onClick={() => navigate('/admin/dashboard')}>Dashboard</Button>
                </>
              )}

              <Button variant="contained" color="error" size="small" onClick={handleLogout}>
                Salir
              </Button>
            </>
          ) : (
            // Botones cuando NO hay sesión iniciada
            <>
              <Button color="inherit" onClick={() => keycloak.login()}>
                Login
              </Button>
              <Button variant="outlined" color="inherit" onClick={() => keycloak.register()}>
                Registrarse
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}