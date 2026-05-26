import { useState } from 'react';
import { 
  Container, Typography, Box, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip 
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import type { TourPackage, TourPackageRequest } from '../../interfaces/package.interface';

const INITIAL_PACKAGES_MOCK: TourPackage[] = [
  {
    id: 1,
    destination: 'San Pedro de Atacama',
    price: 450000,
    availableSlots: 12,
    startDate: '2026-07-15',
    endDate: '2026-07-22',
    status: 'AVAILABLE'
  },
  {
    id: 2,
    destination: 'Torres del Paine',
    price: 890000,
    availableSlots: 0,
    status: 'SOLD_OUT',
    startDate: '2026-08-01',
    endDate: '2026-08-10'
  }
];

export default function PackageManagement() {
  const [packages, setPackages] = useState<TourPackage[]>(INITIAL_PACKAGES_MOCK);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);

  const [formData, setFormData] = useState<TourPackageRequest>({
    destination: '',
    price: 0,
    availableSlots: 0,
    startDate: '',
    endDate: '',
    status: 'AVAILABLE'
  });

  const handleOpenModal = (pkg: TourPackage | null = null) => {
    if (pkg) {
      setSelectedPackage(pkg);
      setFormData({
        destination: pkg.destination,
        price: pkg.price,
        availableSlots: pkg.availableSlots,
        startDate: pkg.startDate,
        endDate: pkg.endDate,
        status: pkg.status
      });
    } else {
      setSelectedPackage(null);
      setFormData({
        destination: '',
        price: 0,
        availableSlots: 0,
        startDate: '',
        endDate: '',
        status: 'AVAILABLE'
      });
    }
    setOpenModal(true);
  };

  const handleSave = () => {
    if (selectedPackage) {
      setPackages(packages.map(p => p.id === selectedPackage.id ? { ...p, ...formData } : p));
      console.log(`[Mingeso-Admin] Simulación PUT exitosa para ID: ${selectedPackage.id}`);
    } else {
      const newPkg: TourPackage = {
        id: Date.now(), 
        ...formData
      };
      setPackages([...packages, newPkg]);
      console.log('[Mingeso-Admin] Simulación POST exitosa');
    }
    setOpenModal(false);
  };

  const handleDeleteLogical = (id: number) => {
    setPackages(packages.map(p => p.id === id ? { ...p, status: 'DELETED' } : p));
    console.log(`[Mingeso-Admin] Simulación DELETE Lógico ejecutada para ID: ${id}`);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return <Chip label="Disponible" color="success" size="small" />;
      case 'SOLD_OUT': return <Chip label="Agotado" color="warning" size="small" />;
      case 'DELETED': return <Chip label="Eliminado" color="error" size="small" variant="outlined" />;
      default: return <Chip label={status} size="small" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: '2rem' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Gestión de Paquetes Turísticos
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

      {/* Tabla Maestra de MUI */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Destino</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Precio Base</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Cupos</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Inicio</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Término</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell style={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow key={pkg.id} hover style={{ opacity: pkg.status === 'DELETED' ? 0.6 : 1 }}>
                <TableCell>{pkg.destination}</TableCell>
                <TableCell>${pkg.price.toLocaleString('es-CL')}</TableCell>
                <TableCell>{pkg.availableSlots}</TableCell>
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
          </TableBody>
        </Table>
      </TableContainer>

      {/* Formulario Modal (Dialog) para Crear y Editar */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedPackage ? 'Editar Paquete' : 'Crear Nuevo Paquete'}</DialogTitle>
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
                value={formData.availableSlots || ''}
                onChange={(e) => setFormData({ ...formData, availableSlots: Number(e.target.value) })}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Fecha Inicio"
                type="date"
                fullWidth
                slotProps={{
                  inputLabel: { shrink: true }
                }}
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              <TextField
                label="Fecha Término"
                type="date"
                fullWidth
                slotProps={{
                  inputLabel: { shrink: true }
                }}
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
          <Button onClick={handleSave} color="primary" variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}