import AxieAccountRow from './axieAccountRow'
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    CircularProgress
} from '@mui/material'


export default function AxieAccountsTable(props) {
    let tableRows

    if (props.isFetching) {
        tableRows = (
            <TableRow>
                <TableCell colSpan={13}>
                    <CircularProgress disableShrink sx={{ ml: '40vw' }} />
                </TableCell>
            </TableRow>
        )
    } else if (props.axieAccountsData) {
        tableRows = props.axieAccountsData.map(accountData => (
            <AxieAccountRow
                key={accountData.roninAdd}
                accountData={accountData}
            />
        ))
    }

    return (
        <TableContainer component={Paper} sx={{ textAlign: 'center' }}>
            <Table aria-label='collapsible table'>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Yesterday SLP</TableCell>
                        <TableCell>Today SLP</TableCell>
                        <TableCell>MMR</TableCell>
                        <TableCell>Rank</TableCell>
                        <TableCell>Scholar</TableCell>
                        <TableCell>Manager</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Axies</TableCell>
                        <TableCell>Last claim</TableCell>
                        <TableCell>Next claim</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableRows}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

