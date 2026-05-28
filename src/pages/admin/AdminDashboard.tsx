import { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { AttachMoney, ShoppingCart, Star, People } from '@mui/icons-material';
import { reportService } from '../../services/reportService';
import type { ReportResponseDTO } from '../../interfaces/report.interface';

export default function AdminDashboard() {
  const [stats, setStats] = useState<ReportResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await reportService.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError('No se pudieron cargar las estadísticas administrativas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: '2rem' }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', marginBottom: '3rem' }}>
        Panel de Reportes y Estadísticas (Épica 7)
      </Typography>

      {error && <Alert severity="error" sx={{ marginBottom: '2rem' }}>{error}</Alert>}

      {stats && (
        <Grid container spacing={4}>
          {/* CARD 1: RECAUDACIÓN TOTAL */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ height: '100%', borderLeft: '5px solid #2e7d32' }} elevation={3}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Recaudación Total
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                    ${stats.totalRevenue ? stats.totalRevenue.toLocaleString('es-CL') : 0}
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, color: '#2e7d32' }} />
              </CardContent>
            </Card>
          </Grid>

          {/* CARD 2: CANTIDAD DE RESERVAS */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ height: '100%', borderLeft: '5px solid #0288d1' }} elevation={3}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Ventas Concretadas
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                    {stats.totalBookings} viajes
                  </Typography>
                </Box>
                <ShoppingCart sx={{ fontSize: 40, color: '#0288d1' }} />
              </CardContent>
            </Card>
          </Grid>

          {/* CARD 3: PAQUETE TOP SELLER */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ height: '100%', borderLeft: '5px solid #ed6c02' }} elevation={3}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Paquete Destacado
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1, color: 'text.primary', lineBreak: 'anywhere' }}>
                    {stats.topPackageName}
                  </Typography>
                </Box>
                <Star sx={{ fontSize: 40, color: '#ed6c02' }} />
              </CardContent>
            </Card>
          </Grid>

          {/* CARD 4: TOTAL USUARIOS */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ height: '100%', borderLeft: '5px solid #9c27b0' }} elevation={3}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Usuarios en Sistema
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                    {stats.activeUsers} cuentas
                  </Typography>
                </Box>
                <People sx={{ fontSize: 40, color: '#9c27b0' }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}