import AddAxieAccountModal from '../components/addAxieAccountModal'
import AxieAccountsTable from '../components/axieAccountsTable'
import { useState, useContext, useEffect, createContext } from 'react'
import { Button, Container, Typography, Card } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import { useSession, signIn, signOut } from "next-auth/react"
import { AppContext } from './_app'

export const FetchContext = createContext()

export default function Home() {
  //console.log('home rendered')
  const { data } = useSession()
  const [axieAccountsData, setAxieAccountsData] = useState([])
  const [isFetching, setIsFetching] = useState()
  const [openAddaccountModal, setOpenAddaccountModal] = useState(false)
  const { mode } = useContext(AppContext)

  async function fetchAndMergeAxieAccountsData(setAxieAccountsData, setIsFetching) {
    setIsFetching(true)

    async function fetchAxieAccounts() {
      const response = await fetch('/api/axie-accounts')
      const data = await response.json()
      return data
    }

    async function fetchAxies(roninAdd) {
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': "61cefd3036mshfd967ab31e5ab15p190affjsnf7ad87c90e78",
          'X-RapidAPI-Host': "axie-infinity.p.rapidapi.com"
        }
      }
      const response = await fetch(`https://axie-infinity.p.rapidapi.com/axie/get-axies/${roninAdd}`, options)
      const data = await response.json()
      return data.response.result.data.axies.results
    }

    async function fetchSLPAndMMR(roninAdd) {
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '61cefd3036mshfd967ab31e5ab15p190affjsnf7ad87c90e78',
          'X-RapidAPI-Host': 'axie-infinity.p.rapidapi.com'
        }
      }
      const response = await fetch(`https://axie-infinity.p.rapidapi.com/axie/get-update/${roninAdd}?id=${roninAdd}`, options)
      const data = await response.json()
      return data
    }

    const axieAccountsData = []
    const axieAccounts = await fetchAxieAccounts()

    try {
      for (const account of axieAccounts) {
        const axies = await fetchAxies(account.roninAdd)
        const SLPAndMMR = await fetchSLPAndMMR(account.roninAdd)
        axieAccountsData.push({ ...account, axies, ...SLPAndMMR })
      }
    }
    catch (err) {
      console.error(err)
    }

    setAxieAccountsData(axieAccountsData)
    setIsFetching(false)
  }

  useEffect(() => {
    if (data) fetchAndMergeAxieAccountsData(setAxieAccountsData, setIsFetching)
  }, [data])

  if (!data) return (
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

  return (
    <FetchContext.Provider value={() => fetchAndMergeAxieAccountsData(setAxieAccountsData, setIsFetching)}>
      {/* <p>{JSON.stringify(data)}</p> */}
      <Container sx={{ marginY: 6 }}>
        <Button
          startIcon={<AddIcon />}
          variant='contained'
          size='large'
          onClick={() => setOpenAddaccountModal(true)}
          sx={{ mb: 3 }}
        >
          Add New account
        </Button>

        <AddAxieAccountModal
          fetchAndMergeAxieAccountsData={() => fetchAndMergeAxieAccountsData(setAxieAccountsData, setIsFetching)}
          open={openAddaccountModal}
          handleClose={() => setOpenAddaccountModal(false)}
        />

        <AxieAccountsTable
          axieAccountsData={axieAccountsData}
          isFetching={isFetching}
        />
      </Container>
    </FetchContext.Provider>
  )
}

