import '../styles/globals.css'
import Navbar from "../components/navbar"
import Head from 'next/head'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useEffect, createContext } from "react"
import { useRouter } from 'next/router'
import { SessionProvider } from "next-auth/react"

export const AppContext = createContext()

export default function MyApp({ Component, pageProps }) {
  const initialAlertState = {
    open: false,
    message: '',
    severity: ''
  }
  const router = useRouter()
  const [mode, setMode] = useState()
  const [alert, setAlert] = useState(initialAlertState)
  const theme = createTheme({
    palette: {
      mode: mode
    }
  })

  useEffect(() => {
    let storedMode = localStorage.getItem('mode')
    storedMode ? storedMode = JSON.parse(storedMode) : storedMode = 'dark'
    setMode(storedMode)
  }, [])


  if (mode) return (
    <AppContext.Provider value={{ mode, setMode, setAlert }}>

      <ThemeProvider theme={theme}>
        <CssBaseline />

        <SessionProvider session={pageProps.session} refetchInterval={5 * 60} refetchOnWindowFocus={false}>
          <Head>
            <title>Axie Account Tracker</title>
          </Head>
          <Navbar />
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={alert.open}
            autoHideDuration={5000}
            onClose={() => setAlert(initialAlertState)}
          >
            <Alert
              severity={alert.severity}
              onClose={() => setAlert(initialAlertState)}
            >
              {alert.message}
            </Alert>
          </Snackbar>
          <Component {...pageProps} />
        </SessionProvider>

      </ThemeProvider>

    </AppContext.Provider>
  )
}