import { createTheme } from '@mui/material/styles';
import { pink, purple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ff69b4', light: '#ff9ed2', dark: '#c2185b', contrastText: '#fff' },
    secondary: { main: '#da70d6', light: '#f0a8ef', dark: '#9c27b0', contrastText: '#fff' },
    background: { default: '#0a0010', paper: 'rgba(26,0,37,0.8)' },
    text: { primary: '#fff', secondary: 'rgba(255,255,255,0.7)' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 50,
          fontWeight: 600,
          letterSpacing: '0.05em',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: '#ff69b4' },
        thumb: { boxShadow: '0 0 10px rgba(255,105,180,0.6)' },
      },
    },
  },
});

export { pink, purple };
export default theme;
