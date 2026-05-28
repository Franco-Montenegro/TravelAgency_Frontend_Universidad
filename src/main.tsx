import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import keycloak from './config/keycloak';
import './index.css';

keycloak.init({ 
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  checkLoginIframe: false 
})
.then((authenticated) => {
  if (authenticated) {
    sessionStorage.setItem('token', keycloak.token || '');
  } else {
    sessionStorage.removeItem('token');
  }
  
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})
.catch((err) => {
  console.error("Error de inicialización:", err);
  sessionStorage.removeItem('token');
  ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
});