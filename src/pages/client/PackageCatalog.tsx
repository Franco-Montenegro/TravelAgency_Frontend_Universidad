import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Grid, Card, CardContent, 
  Button, TextField, CircularProgress, Alert, InputAdornment, 
  Paper, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Search, FlightTakeoff, Event, Person } from '@mui/icons-material';
import { packageService } from '../../services/packageService';
import { bookingService } from '../../services/bookingService';
import type { TourPackage } from '../../interfaces/package.interface';

export default function PackageCatalog() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchDestination, setSearchDestination] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  const [openReserveModal, setOpenReserveModal] = useState(false);
  const [activePackage, setActivePackage] = useState<TourPackage | null>(null);
  const [passengers, setPassengers] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const data = await packageService.getAllPackages();
      const availableOnly = data.filter(p => p.status === 'AVAILABLE');
      setPackages(availableOnly);
    } catch (err) {
      setError('No se pudo cargar el catálogo de viajes. Inténtalo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleOpenReserve = (pkg: TourPackage) => {
    setActivePackage(pkg);
    setPassengers(1);
    setOpenReserveModal(true);
  };

  const handleConfirmReservation = async () => {
    if (!activePackage) return;
    if (passengers <= 0) {
      alert('La cantidad de pasajeros debe ser mayor que cero.');
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        passengersCount: passengers,
        user: { id: 1 }, 
        tourPackage: { id: activePackage.id }
      };

      const result = await bookingService.createBooking(payload);
      
      alert(`¡Reserva Creada Exitosamente!\nMonto Final Calculado: $${result.totalAmount.toLocaleString('es-CL')}\nEstado: ${result.stateBooking}`);
      
      setOpenReserveModal(false);
      fetchCatalog(); 
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al procesar la reserva. Verifica los cupos libres.';
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesDestination = pkg.destination.toLowerCase().includes(searchDestination.toLowerCase()) ||
                               pkg.name.toLowerCase().includes(searchDestination.toLowerCase());
    const matchesPrice = maxPrice === '' || pkg.price <= maxPrice;
    return matchesDestination && matchesPrice;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: '3rem', marginBottom: '3rem' }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', marginBottom: '1rem' }} color="primary">
        Descubre tu Próximo Destino
      </Typography>
      <Typography variant="h6" sx={{ color: 'text.secondary', marginBottom: '3rem' }}>
        Explora nuestros paquetes turísticos exclusivos con todo incluido.
      </Typography>

      {error && <Alert severity="error" sx={{ marginBottom: '2rem' }}>{error}</Alert>}

      <Paper elevation={2} sx={{ p: 3, marginBottom: '4rem', backgroundColor: '#fafafa', borderRadius: '12px' }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>  
            <TextField
              label="¿A dónde quieres ir?"
              fullWidth
              value={searchDestination}
              onChange={(e) => setSearchDestination(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>  
            <TextField
              label="Precio Máximo ($)"
              type="number"
              fullWidth
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                },
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {filteredPackages.map((pkg) => (
          <Grid size={{ xs: 12, sm: 6,  md: 4 }} key={pkg.id}>  
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '16px' }} elevation={4}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '1rem' }}>
                  <FlightTakeoff color="primary" />
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                    {pkg.name}
                  </Typography>
                </Box>
                
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 2 }}>
                  Destino: {pkg.destination}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ minHeight: '60px', mb: 3 }}>
                  {pkg.description || 'Disfruta de una experiencia única con itinerarios organizados por expertos locales.'}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, backgroundColor: '#f0f4f8', p: 2, borderRadius: '8px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Event fontSize="small" color="action" />
                    <Typography variant="caption" color="text.primary">
                      {pkg.startDate} al {pkg.endDate}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person fontSize="small" color="action" />
                    {/* Se asume el uso de availableSlots de acuerdo con la definición de tu servicio */}
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }} color={(pkg.availableSlots !== undefined ? pkg.availableSlots : pkg.totalSlots) <= 5 ? 'error.main' : 'success.main'}>
                      {pkg.availableSlots !== undefined ? pkg.availableSlots : pkg.totalSlots} cupos disponibles
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              <Box sx={{ p: 3, pt: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">Precio por persona</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    ${pkg.price.toLocaleString('es-CL')}
                  </Typography>
                </Box>
                
                <Button 
                  variant="contained" 
                  color="secondary" 
                  fullWidth 
                  size="large"
                  disabled={pkg.availableSlots !== undefined && pkg.availableSlots <= 0}
                  sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                  onClick={() => handleOpenReserve(pkg)}
                >
                  {pkg.availableSlots !== undefined && pkg.availableSlots <= 0 ? 'Agotado' : 'Reservar Viaje'}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}

        {filteredPackages.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No encontramos paquetes disponibles que coincidan con tus criterios de búsqueda.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      <Dialog open={openReserveModal} onClose={() => !submitting && setOpenReserveModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Solicitud de Reserva</DialogTitle>
        <DialogContent dividers>
          {activePackage && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Typography variant="subtitle1">
                Vas a reservar para el paquete: <strong>{activePackage.name}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Precio unitario base: ${activePackage.price.toLocaleString('es-CL')}
              </Typography>
              <Typography variant="body2" color="primary.main">
                Cupos reales remanentes: {activePackage.availableSlots !== undefined ? activePackage.availableSlots : activePackage.totalSlots}
              </Typography>

              <TextField
                label="Cantidad de Pasajeros"
                type="number"
                fullWidth
                slotProps={{
                  input: {
                    inputProps: {
                      min: 1,
                      max: activePackage.availableSlots !== undefined ? activePackage.availableSlots : activePackage.totalSlots,
                    }
                  }
                }}
                value={passengers}
                onChange={(e) => setPassengers(Math.max(1, Number(e.target.value)))}
                margin="normal"
              />

              <Box sx={{ backgroundColor: '#fcf8e3', p: 2, borderRadius: '8px', border: '1px solid #fbeed5' }}>
                <Typography variant="caption" color="orange">
                  * Nota: El sistema calculará de forma automática los descuentos correspondientes por volumen de pasajeros o fidelidad comercial histórica directa en el Backend.
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReserveModal(false)} color="inherit" disabled={submitting}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmReservation} 
            color="secondary" 
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Procesando...' : 'Confirmar Reserva'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}