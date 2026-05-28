import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';

const theme = createTheme({});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <BrowserRouter>
        <Navbar /> 
        <main style={{ minHeight: '85vh', padding: '2rem' }}>
          <AppRoutes />
        </main>
      </BrowserRouter>
    </ThemeProvider>
  );
}