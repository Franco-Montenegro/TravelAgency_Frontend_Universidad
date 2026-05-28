import { Button, Box, Typography } from '@mui/material';
import keycloak from '../config/keycloak';

export const AuthButtons = () => {
  if (keycloak.authenticated) {
    return (
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="body2">
          Hola, {keycloak.tokenParsed?.preferred_username}
        </Typography>
        <Button 
          variant="outlined" 
          color="inherit" 
          onClick={() => keycloak.logout()}
        >
          Logout
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => keycloak.login()}
      >
        Login
      </Button>
      <Button 
        variant="outlined" 
        color="inherit" 
        onClick={() => keycloak.register()}
      >
        Registrarse
      </Button>
    </Box>
  );
};