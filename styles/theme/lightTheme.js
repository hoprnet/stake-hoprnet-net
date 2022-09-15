import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: [
      'Source Code Pro',
    ].join(','),
  },
});

export default lightTheme;
