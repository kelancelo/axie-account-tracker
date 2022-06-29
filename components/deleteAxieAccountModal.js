import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material"
import { useContext } from "react"
import { AppContext } from "../pages/_app"
import { FetchContext } from "../pages"

export default function DeleteAxieAccountModal({ open, handleClose, roninAdd, token }) {
    const { setAlert } = useContext(AppContext)
    const fetchAndMergeAxieAccountsData = useContext(FetchContext)

    async function deleteScholar(roninAdd) {
        try {
            const response = await fetch(`/api/axie-accounts/${roninAdd}`, {
                method: "DELETE"
            })
            const data = await response.json()
            if (response.ok) {
                setAlert({ open: true, message: data.message, severity: 'success' })
                fetchAndMergeAxieAccountsData()
            } else {
                setAlert({ open: true, message: data.message, severity: 'success' })
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="confirm-delete-dialog-title"
            aria-describedby="confirm-delete-dialog-description"
        >
            <DialogTitle id="confirm-delete-dialog-title">
                {"Confirm Delete"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-delete-dialog-description">
                    Delete this account?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>No</Button>
                <Button onClick={() => {
                    deleteScholar(roninAdd)
                    handleClose()
                }}>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}