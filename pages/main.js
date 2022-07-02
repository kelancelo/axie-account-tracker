import AddAxieAccountModal from '../components/addAxieAccountModal'
import AxieAccountsTable from '../components/axieAccountsTable'
import { useState, useEffect, createContext } from 'react'
import { Button, Container } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'

export const FetchContext = createContext()

export default function Main() {
    const { status } = useSession()
    const [axieAccountsData, setAxieAccountsData] = useState([])
    const [isFetching, setIsFetching] = useState()
    const [openAddaccountModal, setOpenAddaccountModal] = useState(false)
    const router = useRouter()

    async function fetchAndMergeAxieAccountsData(setAxieAccountsData, setIsFetching) {
        setIsFetching(true)

        async function fetchAxieAccounts() {
            const response = await fetch('/api/axie-accounts')
            if (response.ok) {
                const data = await response.json()
                return data
            }
            else {
                console.info(response.body)
            }
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
        //console.log('axieAccounts', axieAccounts)
        for (const account of axieAccounts) {
            const axies = await fetchAxies(account.roninAdd)
            const SLPAndMMR = await fetchSLPAndMMR(account.roninAdd)
            axieAccountsData.push({ ...account, axies, ...SLPAndMMR })
        }

        setAxieAccountsData(axieAccountsData)
        setIsFetching(false)
    }

    useEffect(() => {
        if (status === 'authenticated') {
            try {
                fetchAndMergeAxieAccountsData(setAxieAccountsData, setIsFetching)
            }
            catch (err) {
                console.error(err)
            }
        }
    }, [status])

    if (status === 'unauthenticated') {
        router.push('/')
    }
    else if (status === 'authenticated') {
        return (
            <FetchContext.Provider value={() => fetchAndMergeAxieAccountsData(setAxieAccountsData, setIsFetching)}>
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
}

