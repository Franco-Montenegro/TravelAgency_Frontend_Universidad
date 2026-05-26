import { Typography, Container } from '@mui/material';

export default function PackageCatalog() {
  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Catálogo de Paquetes Turísticos (Cliente)
      </Typography>
      <Typography variant="body1">
        Aquí se mostrarán los filtros y las tarjetas dinámicas de viajes (Épica 3).
      </Typography>
    </Container>
  );
}