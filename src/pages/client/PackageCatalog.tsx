import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Grid, Card, CardContent, 
  Button, TextField, CircularProgress, Alert, InputAdornment, 
  Paper
} from '@mui/material';
import { Search, FlightTakeoff, Event, Person } from '@mui/icons-material';
import { packageService } from '../../services/packageService';
import type { TourPackage } from '../../interfaces/package.interface';

export default function PackageCatalog() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchDestination, setSearchDestination] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  useEffect(() => {
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
    fetchCatalog();
  }, []);

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

      {/* 🛒 GRILLA DEL CATÁLOGO DE VIAJES */}
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
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }} color={pkg.totalSlots <= 5 ? 'error.main' : 'success.main'}>
                      {pkg.totalSlots} cupos disponibles
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
                
                {/* 💡 Este botón conectará directamente con la Épica 4 (Proceso de Reserva) */}
                <Button 
                  variant="contained" 
                  color="secondary" 
                  fullWidth 
                  size="large"
                  sx={{ borderRadius: '8px', fontWeight: 'bold' }}
                  onClick={() => alert(`¡Próximamente! Conectaremos la reserva del paquete: ${pkg.name}`)}
                >
                  Reservar Viaje
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
    </Container>
  );
}