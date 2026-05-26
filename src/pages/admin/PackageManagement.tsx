import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip,
  CircularProgress, Alert 
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { packageService } from '../../services/packageService';
import type { TourPackage, TourPackageRequest } from '../../interfaces/package.interface';

export default function PackageManagement() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);

  const [formData, setFormData] = useState<TourPackageRequest>({
    name: '',
    destination: '',
    description: '',
    price: 0,
    totalSlots: 0, //
    startDate: '',
    endDate: '',
    status: 'AVAILABLE'
  });

  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await packageService.getAllPackages();
      setPackages(data);
    } catch (err: any) {
      setError('Error al conectar con el servidor Spring Boot. Verifica que el Backend esté encendido.');
      console.error('[Mingeso-API Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleOpenModal = (pkg: TourPackage | null = null) => {
    if (pkg) {
      setSelectedPackage(pkg);
      setFormData({
        name: pkg.name,
        destination: pkg.destination,
        description: pkg.description,
        price: pkg.price,
        totalSlots: pkg.totalSlots,
        startDate: pkg.startDate,
        endDate: pkg.endDate,
        status: pkg.status
      });
    } else {
      setSelectedPackage(null);
      setFormData({
        name: '',
        destination: '',
        description: '',
        price: 0,
        totalSlots: 0,
        startDate: '',
        endDate: '',
        status: 'AVAILABLE'
      });
    }
    setOpenModal(true);
  };

  const handleSave = async () => {
    try {
      if (selectedPackage) {
        const updated = await packageService.updatePackage(selectedPackage.id, formData);
        setPackages(packages.map(p => p.id === selectedPackage.id ? updated : p));
      } else {
        const created = await packageService.createPackage(formData);
        setPackages([...packages, created]);
      }
      setOpenModal(false);
    } catch (err) {
      alert('Error al guardar el paquete turístico. Revisa los campos y la consola.');
    }
  };

  const handleDeleteLogical = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas aplicar borrado lógico a este paquete?')) {
      try {
        await packageService.deletePackageLogical(id);
        loadPackages();
      } catch (err) {
        alert('No se pudo procesar el borrado lógico del paquete.');
      }
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return <Chip label="Disponible" color="success" size="small" />;
      case 'SOLD_OUT': return <Chip label="Agotado" color="warning" size="small" />;
      case 'CANCELLED': return <Chip label="Cancelado" color="default" size="small" />;
      case 'EXPIRED': return <Chip label="Expirado" color="default" size="small" />;
      case 'DELETED': return <Chip label="Eliminado" color="error" size="small" variant="outlined" />;
      default: return <Chip label={status} size="small" />;
    }
  };
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: '2rem' }}>
      {error && <Alert severity="error" sx={{ marginBottom: '2rem' }}>{error}</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }} color="text.primary">
          Gestión de Paquetes Turísticos (Modo Integrado)
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
        >
          Nuevo Paquete
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Destino</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Precio Base</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Cupos</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Inicio</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Término</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow key={pkg.id} hover sx={{ opacity: pkg.status === 'DELETED' ? 0.5 : 1 }}>
                <TableCell>{pkg.destination}</TableCell>
                <TableCell>${pkg.price.toLocaleString('es-CL')}</TableCell>
                <TableCell>{pkg.totalSlots}</TableCell>
                <TableCell>{pkg.startDate}</TableCell>
                <TableCell>{pkg.endDate}</TableCell>
                <TableCell>{getStatusChip(pkg.status)}</TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="primary" 
                    disabled={pkg.status === 'DELETED'}
                    onClick={() => handleOpenModal(pkg)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    disabled={pkg.status === 'DELETED'}
                    onClick={() => handleDeleteLogical(pkg.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {packages.length === 0 && !error && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                  No existen paquetes creados en la base de datos de Spring Boot aún.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Formulario Modal (Dialog) */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedPackage ? 'Editar Paquete Turístico' : 'Crear Nuevo Paquete Turístico'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 1 }}>
            <TextField
              label="Destino del Viaje"
              fullWidth
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Precio ($)"
                type="number"
                fullWidth
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
              <TextField
                label="Cupos Disponibles"
                type="number"
                fullWidth
                value={formData.totalSlots || ''}
                onChange={(e) => setFormData({ ...formData, totalSlots: Number(e.target.value) })}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Fecha Inicio"
                type="date"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              <TextField
                label="Fecha Término"
                type="date"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </Box>
            <TextField
              select
              label="Estado Operativo"
              fullWidth
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <MenuItem value="AVAILABLE">AVAILABLE (Disponible)</MenuItem>
              <MenuItem value="SOLD_OUT">SOLD_OUT (Agotado)</MenuItem>
              <MenuItem value="CANCELLED">CANCELLED (Cancelado)</MenuItem>
              <MenuItem value="EXPIRED">EXPIRED (Expirado)</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleSave} color="primary" variant="contained">Guardar Cambios</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}