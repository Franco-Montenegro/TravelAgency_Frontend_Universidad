import { Typography, Container, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container style={{ marginTop: '4rem', textAlign: 'center' }}>
      <Typography 
        variant="h2" 
        component="h1" 
        gutterBottom 
        sx={{ fontStyle: 'italic' }}
      >
        TravelAgency Web
      </Typography>
      
      <Typography variant="h6" component="p" color="text.secondary">
        Bienvenido al sistema de comercialización de paquetes turísticos automatizado.
      </Typography>
      
      <Stack direction="row" spacing={2} sx={{ marginTop: '2rem', justifyContent: 'center' }}>
        <Button variant="contained" color="primary" onClick={() => navigate('/packages')}>
          Ver Catálogo (Cliente)
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/admin/packages')}>
          Panel de Control (Admin)
        </Button>
      </Stack>
    </Container>
  );
}