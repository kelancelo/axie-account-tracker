
import { useContext, useEffect } from 'react'
import { Typography, Card } from "@mui/material"
import { useSession } from "next-auth/react"
import { AppContext } from './_app'
import { useRouter } from 'next/router'

export default function Home() {
  const { status } = useSession()
  const { mode } = useContext(AppContext)
  const router = useRouter()

  if (status === 'authenticated') {
    router.push('/main')
  }
  else if (status === 'unauthenticated') {
    return (
      <div id='welcome-bg'>
        <Card style={{
          backgroundColor: mode === 'light' && '#1976d2',
          color: '#fff',
          textAlign: 'center',
          padding: '2rem',
          maxWidth: '90%'
        }}>
          <Typography variant='h3' component='h1' sx={{ mb: 2 }}>Welcome to Axie Account Tracker</Typography>
          <Typography variant='body1' component='h2'>Log in to start tracking your axie accounts.</Typography>
        </Card>
      </div>
    )
  }
}