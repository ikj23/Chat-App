// src/theme.ts

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(40, 42, 54, 0.75)', // Made slightly more opaque
    },
    text: {
      primary: '#f8f8f2',
      secondary: '#bd93f9',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
      color: '#f8f8f2',
    },
  },
  components: {
    // THIS 'COMPONENTS' SECTION IS UPDATED
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#f8f8f2', // Ensure primary list text is light
        },
        secondary: {
          color: '#a9a9a9', // A clear but subtle grey for secondary text
        },
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
  }
});

export default theme;