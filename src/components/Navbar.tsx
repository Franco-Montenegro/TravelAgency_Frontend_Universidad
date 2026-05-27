import { AppBar, Toolbar, Typography, Button, Stack, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, userRole, userEmail, loginAs, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
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
          {/* Si está autenticado, mostramos los accesos según su rol */}
          {isAuthenticated ? (
            <>
              <Chip 
                label={`${userRole}: ${userEmail}`} 
                color="secondary" 
                variant="outlined" 
                sx={{ color: '#fff', borderColor: '#fff' }}
              />
              
              {userRole === 'CLIENT' && (
                <Button color="inherit" onClick={() => navigate('/packages')}>Catálogo</Button>
              )}

              {userRole === 'CLIENT' && (
                <Button color="inherit" onClick={() => navigate('/my-bookings')}>Mis Reservas</Button>
              )}
              
              {userRole === 'ADMIN' && (
                <Button color="inherit" onClick={() => navigate('/admin/packages')}>Admin Panel</Button>
              )}

              <Button variant="contained" color="error" size="small" onClick={handleLogout}>
                Salir
              </Button>
            </>
          ) : (

            <>
              <Button color="inherit" onClick={() => loginAs('CLIENT')}>
                Simular Cliente
              </Button>
              <Button variant="outlined" color="inherit" onClick={() => loginAs('ADMIN')}>
                Simular Admin
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}