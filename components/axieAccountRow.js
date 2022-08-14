import { TableRow, TableCell, IconButton, Box, Button, Collapse } from '@mui/material'
import UpdateAxieAccountModal from "./updateAxieAccountModal"
import DeleteAxieAccountModal from './deleteAxieAccountModal'
import AxiesModal from "./axiesModal"
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useState, useEffect } from "react"

export default function AxieAccountRow({ accountData }) {
    const [scholarUpdateData, setScholarUpdateData] = useState({})
    // const [axies, setAxies] = useState([])
    const [roninAdd, setRoninAdd] = useState()
    const [openUpdateScholarModal, setOpenUpdateScholarModal] = useState(false)
    // const [openAxiesModal, setOpenAxiesModal] = useState(false)
    const [openDeleteScholarModal, setOpenDeleteScholarModal] = useState(false)
    const [open, setOpen] = useState(false)
    const [slpToUsd, setSlpToUsd] = useState(0)
    const name = accountData.name
    const yesterdaySLP = accountData.slp.yesterdaySLP
    const todaySoFar = accountData.slp.todaySoFar
    const elo = accountData.leaderboard.elo
    const rank = accountData.leaderboard.rank
    const scholarSlp = (
        <span>
            {accountData.slp.total * accountData.scholarShare / 100} {' | '}
            <span style={{ color: '#0288d1' }}>
                ${(accountData.slp.total * accountData.scholarShare / 100 * slpToUsd).toFixed(1)}
            </span>
        </span>
    )
    const managerSlp = (
        <span>
            {accountData.slp.total * accountData.managerShare / 100} {' | '}
            <span style={{ color: '#0288d1' }}>
                ${(accountData.slp.total * accountData.managerShare / 100 * slpToUsd).toFixed(1)}
            </span>
        </span>
    )
    const total = (
        <span>
            {accountData.slp.total} {' | '}
            <span style={{ color: '#0288d1' }}>
                ${(accountData.slp.total * slpToUsd).toFixed(1)}
            </span>
        </span>
    )
    // const axieCount = accountData.axies.length
    let now = Date.now()
    let lastClaim = new Date(accountData.slp.lastClaimedItemAt * 1000).toDateString()
    let nextClaim = (accountData.slp.lastClaimedItemAt + 1209600) * 1000
    let nextClaimCol
    if (accountData.slp.lastClaimedItemAt === 0) {
        nextClaimCol = <TableCell sx={{ color: '#f44336' }}>No data yet</TableCell>
    }
    else if (now > nextClaim) {
        nextClaimCol = <TableCell sx={{ color: '#66bb6a' }}>Claimable now</TableCell>
    }
    else {
        nextClaimCol = <TableCell>{new Date(nextClaim).toDateString()}</TableCell>
    }

    useEffect(() => {
        async function convertSlp() {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=smooth-love-potion&vs_currencies=usd')
            const data = await response.json()
            setSlpToUsd(data['smooth-love-potion'].usd)
        }
        convertSlp()
    }, [slpToUsd])

    function showUpdateScholarModal(accountData) {
        setScholarUpdateData({
            name: accountData.name,
            roninAdd: accountData.roninAdd,
            scholarShare: accountData.scholarShare,
            managerShare: accountData.managerShare,
        })
        //setRoninAdd(accountData.roninAdd)
        setOpenUpdateScholarModal(true)
    }

    function showAxiesModal(axies) {
        setAxies(axies)
        setOpenAxiesModal(true)
    }

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{name}</TableCell>
                <TableCell>{yesterdaySLP}</TableCell>
                <TableCell>{todaySoFar}</TableCell>
                <TableCell>{elo}</TableCell>
                <TableCell>{rank}</TableCell>
                <TableCell>{scholarSlp}</TableCell>
                <TableCell>{managerSlp}</TableCell>
                <TableCell >{total}</TableCell>
                {/* <TableCell >{axieCount}</TableCell> */}
                <TableCell>{lastClaim}</TableCell>
                {nextClaimCol}
            </TableRow>
            <TableRow>
                <TableCell colSpan={13} sx={{ pb: 0, pt: 0 }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box my={2} >
                            <Button
                                size='small'
                                startIcon={<EditIcon />}
                                variant="contained"
                                onClick={() => showUpdateScholarModal(accountData)}
                                sx={{ mr: 1 }}
                            >
                                Edit
                            </Button>
                            <Button
                                size='small'
                                startIcon={<DeleteIcon />}
                                color='error'
                                variant='contained'
                                onClick={() => {
                                    setOpenDeleteScholarModal(true)
                                    setRoninAdd(accountData.roninAdd)
                                }}
                                sx={{ mr: 1 }}
                            >
                                Delete
                            </Button>
                            {/* <Button
                                size='small'
                                startIcon={<VisibilityIcon />}
                                color='info'
                                variant='contained'
                                onClick={() => showAxiesModal(accountData.axies)}
                            >
                                View Axies
                            </Button> */}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

            <UpdateAxieAccountModal
                scholarUpdateData={scholarUpdateData}
                //roninAdd={roninAdd}
                open={openUpdateScholarModal}
                handleClose={() => setOpenUpdateScholarModal(false)}
            />

            {/* <AxiesModal
                axies={axies}
                open={openAxiesModal}
                handleClose={() => setOpenAxiesModal(false)}
            /> */}

            <DeleteAxieAccountModal
                open={openDeleteScholarModal}
                handleClose={() => setOpenDeleteScholarModal(false)}
                roninAdd={roninAdd}
            />
        </React.Fragment>
    )
}