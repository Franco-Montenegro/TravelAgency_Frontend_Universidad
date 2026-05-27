import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Chip, 
  CircularProgress, Alert, Button 
} from '@mui/material';
import { Payment } from '@mui/icons-material';
import { bookingService } from '../../services/bookingService';
import type { Booking } from '../../interfaces/booking.interface';

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = 1;

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await bookingService.getUserHistory(currentUserId);
        setBookings(data);
      } catch (err) {
        setError('No se pudo recuperar el historial de reservas desde el servidor de Spring Boot.');
        console.error('[Mingeso-API Error]', err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const getStateChip = (state: string) => {
    switch (state) {
      case 'PENDING_PAYMENT':
        return <Chip label="Pendiente de Pago" color="warning" size="small" />;
      case 'CONFIRMED':
        return <Chip label="Confirmada" color="success" size="small" />;
      case 'CANCELLED':
        return <Chip label="Cancelada" color="error" size="small" variant="outlined" />;
      case 'EXPIRED':
        return <Chip label="Expirada" color="default" size="small" />;
      default:
        return <Chip label={state} size="small" />;
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
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', marginBottom: '2rem' }} color="text.primary">
        Mis Reservas de Viajes (Épica 6)
      </Typography>

      {error && <Alert severity="error" sx={{ marginBottom: '2rem' }}>{error}</Alert>}

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID Reserva</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Paquete / Destino</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Pasajeros</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Fecha Solicitud</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Vence el</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Cobrado</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id} hover>
                <TableCell>#{booking.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {booking.tourPackage?.name || 'Sin Nombre'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {booking.tourPackage?.destination}
                  </Typography>
                </TableCell>
                <TableCell>{booking.passengersCount}</TableCell>
                <TableCell>{booking.bookingDate}</TableCell>
                <TableCell>{booking.expirationDate}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  ${booking.totalAmount.toLocaleString('es-CL')}
                </TableCell>
                <TableCell>{getStateChip(booking.stateBooking)}</TableCell>
                <TableCell align="center">
                  {booking.stateBooking === 'PENDING_PAYMENT' ? (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<Payment />}
                      onClick={() => alert(`Procediendo a pagar la reserva #${booking.id}`)}
                    >
                      Pagar
                    </Button>
                  ) : (
                    <Typography variant="caption" color="text.secondary">—</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && !error && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                  Aún no has realizado ninguna solicitud de reserva en el sistema.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}