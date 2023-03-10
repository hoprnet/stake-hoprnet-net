import '../styles/globals.css'

// Mui and emotion
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import createEmotionCache from '../utils/createEmotionCache';
import lightTheme from '../styles/theme/lightTheme';

//Components
import Head from '../future-hopr-lib-components/Layout/head';

const clientSideEmotionCache = createEmotionCache();

function MyApp({ Component, pageProps }) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Head/>
        <Component {...pageProps} />   
      </ThemeProvider>
    </CacheProvider>
  )
}

export default MyApp
