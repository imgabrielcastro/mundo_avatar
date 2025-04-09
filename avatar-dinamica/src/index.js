// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // o tema que você criou

import '@fontsource/roboto'; // importa a Roboto corretamente

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* limpa estilos padrões do navegador */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
