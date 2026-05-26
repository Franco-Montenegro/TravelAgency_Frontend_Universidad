// src/components/Navbar.tsx
import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo o Nombre de la Agencia clickeable hacia el Home */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ cursor: 'pointer', fontWeight: 'bold', letterSpacing: 1 }}
          onClick={() => navigate('/')}
        >
          ✈️ TravelAgency
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button color="inherit" onClick={() => navigate('/packages')}>
            Catálogo
          </Button>
          <Button color="inherit" onClick={() => navigate('/admin/packages')}>
            Admin Panel
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}