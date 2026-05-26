import { Typography, Container } from '@mui/material';

export default function PackageManagement() {
  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h4" color="secondary" gutterBottom>
        Gestión de Inventario (Administración)
      </Typography>
      <Typography variant="body1">
        Aquí se mostrará la tabla CRUD para crear, editar y aplicar borrado lógico a los paquetes (Épica 2).
      </Typography>
    </Container>
  );
}