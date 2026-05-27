import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Chip, 
  CircularProgress, Alert, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField 
} from '@mui/material';
import { Payment as PaymentIcon, CreditCard } from '@mui/icons-material';
import { bookingService } from '../../services/bookingService';
import { paymentService } from '../../services/paymentService';
import type { Booking } from '../../interfaces/booking.interface';
import type { PaymentRequest } from '../../interfaces/payment.interface';

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const [cardForm, setCardForm] = useState<PaymentRequest>({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: ''
  });

  const currentUserId = 1;

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

  useEffect(() => {
    loadHistory();
  }, []);

  const handleOpenPayment = (booking: Booking) => {
    setSelectedBooking(booking);
    setCardForm({ cardNumber: '', cardHolderName: '', expiryDate: '', cvv: '' });
    setOpenPaymentModal(true);
  };

  const handleExecutePayment = async () => {
    if (!selectedBooking) return;
    
    if (!cardForm.cardNumber || !cardForm.cardHolderName || !cardForm.expiryDate || !cardForm.cvv) {
      alert('Por favor complete todos los datos de la tarjeta bancaria para la simulación.');
      return;
    }

    try {
      setSubmittingPayment(true);
      
      const payloadDto = {
        cardDetails: {
          cardNumber: cardForm.cardNumber,
          cardHolderName: cardForm.cardHolderName,
          expirationDate: cardForm.expiryDate,
          cvv: cardForm.cvv
        }
      };

      const result = await paymentService.processBookingPayment(selectedBooking.id, payloadDto as any);
      
      alert(`¡Pago Procesado Exitosamente!\nCódigo de Transacción Pasarela: ${result.transactionId}\nMonto Total Liquidado: $${result.amount.toLocaleString('es-CL')}`);
      
      setOpenPaymentModal(false);
      loadHistory(); 
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al procesar el pago simulación. Inténtelo nuevamente.';
      alert(errorMsg);
    } finally {
      setSubmittingPayment(false);
    }
  };

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
                      startIcon={<PaymentIcon />}
                      onClick={() => handleOpenPayment(booking)}
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

      <Dialog open={openPaymentModal} onClose={() => !submittingPayment && setOpenPaymentModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCard color="primary" /> Pasarela de Pago Simulada
        </DialogTitle>
        <DialogContent dividers>
          {selectedBooking && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Typography variant="subtitle2">
                Liquidación de Reserva: <strong>#{selectedBooking.id}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Destino: {selectedBooking.tourPackage?.destination}
              </Typography>
              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold', my: 1 }}>
                Monto a Pagar: ${selectedBooking.totalAmount.toLocaleString('es-CL')}
              </Typography>

              <TextField
                label="Número de Tarjeta"
                fullWidth
                required
                slotProps={{ htmlInput: { maxLength: 16 } }}
                value={cardForm.cardNumber}
                onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value.replace(/\D/g, '') })}
                placeholder="1234567812345678"
              />

              <TextField
                label="Nombre del Titular"
                fullWidth
                required
                value={cardForm.cardHolderName}
                onChange={(e) => setCardForm({ ...cardForm, cardHolderName: e.target.value })}
                placeholder="JUAN PEREZ"
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Vencimiento (MM/AA)"
                  fullWidth
                  required
                  slotProps={{ htmlInput: { maxLength: 5 } }}
                  value={cardForm.expiryDate}
                  onChange={(e) => setCardForm({ ...cardForm, expiryDate: e.target.value })}
                  placeholder="12/29"
                />
                <TextField
                  label="CVV"
                  type="password"
                  fullWidth
                  required
                  slotProps={{ htmlInput: { maxLength: 3 } }}
                  value={cardForm.cvv}
                  onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '') })}
                  placeholder="123"
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentModal(false)} color="inherit" disabled={submittingPayment}>
            Cancelar
          </Button>
          <Button 
            onClick={handleExecutePayment} 
            color="success" 
            variant="contained"
            disabled={submittingPayment}
          >
            {submittingPayment ? 'Procesando Pago...' : 'Confirmar Transacción'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}