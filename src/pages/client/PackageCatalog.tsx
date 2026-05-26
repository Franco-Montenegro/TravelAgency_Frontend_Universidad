import { useState } from 'react';
import { 
  Container, Typography, Box, TextField, Card, CardContent, 
  CardActions, Button, Grid, Paper, InputAdornment 
} from '@mui/material';
import { Search, AttachMoney, FlightTakeoff, Event } from '@mui/icons-material';
import type { TourPackage } from '../../interfaces/package.interface';

const PACKAGES_CATALOG_MOCK: TourPackage[] = [
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
    availableSlots: 4,
    startDate: '2026-08-01',
    endDate: '2026-08-10',
    status: 'AVAILABLE'
  },
  {
    id: 3,
    destination: 'Isla de Pascua',
    price: 1200000,
    availableSlots: 8,
    startDate: '2026-09-10',
    endDate: '2026-09-18',
    status: 'AVAILABLE'
  },
  {
    id: 4,
    destination: 'San Pedro de Atacama (Express)',
    price: 250000,
    availableSlots: 0,
    startDate: '2026-07-18',
    endDate: '2026-07-21',
    status: 'SOLD_OUT' 
  }
];

export default function PackageCatalog() {
  const [searchDestination, setSearchDestination] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [filterDate, setFilterDate] = useState('');

  const filteredPackages = PACKAGES_CATALOG_MOCK.filter((pkg) => {
    if (pkg.status !== 'AVAILABLE') return false;
    
    const matchesDestination = pkg.destination.toLowerCase().includes(searchDestination.toLowerCase());
    const matchesPrice = maxPrice === '' || pkg.price <= maxPrice;
    const matchesDate = !filterDate || pkg.startDate >= filterDate;

    return matchesDestination && matchesPrice && matchesDate;
  });

  return (
    <Container maxWidth="lg" sx={{ marginTop: '2rem' }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        color="text.primary"
        sx={{ fontWeight: 'bold' }}
      >
        Encuentra tu Próximo Destino
      </Typography>

      <Typography 
        variant="subtitle1" 
        color="text.secondary" 
        sx={{ marginBottom: '2.5rem' }}
      >
        Explora nuestros paquetes turísticos disponibles y compra de forma 100% autónoma.
      </Typography>

      <Paper elevation={2} sx={{ padding: '1.5rem', marginBottom: '3rem', backgroundColor: '#fff' }}>
        <Grid 
          container 
          spacing={2} 
          sx={{ alignItems: 'center' }}
        >
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="¿A dónde quieres ir?"
              fullWidth
              variant="outlined"
              size="small"
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
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Precio Máximo"
              type="number"
              fullWidth
              variant="outlined"
              size="small"
              value={maxPrice}
              onChange={(e) => setFormDataPrice(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="A partir de la fecha"
              type="date"
              fullWidth
              variant="outlined"
              size="small"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              slotProps={{
                inputLabel: { shrink: true }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {filteredPackages.length === 0 ? (
        <Box sx={{ textAlign: 'center', marginTop: '4rem', color: 'text.secondary' }}>
          <Typography variant="h6">No se encontraron viajes disponibles con los filtros aplicados.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredPackages.map((pkg) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={pkg.id}>
              <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1.5 }}>
                    <FlightTakeoff color="primary" />
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      {pkg.destination}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', marginY: 1.5 }}>
                    ${pkg.price.toLocaleString('es-CL')}
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, marginTop: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Event fontSize="small" /> 
                      {pkg.startDate} al {pkg.endDate}
                    </Typography>
                    <Typography variant="body2" color={pkg.availableSlots <= 5 ? 'error.main' : 'text.secondary'} sx={{ fontWeight: 'medium' }}>
                      Cupos disponibles: {pkg.availableSlots}
                    </Typography>
                  </Box>
                </CardContent>
                
                <CardActions sx={{ padding: '1rem', paddingTop: 0 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    onClick={() => console.log(`[Mingeso-Cliente] Redirigiendo a reserva del paquete: ${pkg.id}`)}
                  >
                    Reservar Ahora
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );

  function setFormDataPrice(value: string) {
    if (value === '') {
      setMaxPrice('');
    } else {
      setMaxPrice(Number(value));
    }
  }
}