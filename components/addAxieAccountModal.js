import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material'
import ModalForm from './modalForm'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { useContext } from 'react'
import { AppContext } from '../pages/_app'

export default function AddAxieAccountModal(props) {
    const { setAlert } = useContext(AppContext)

    async function addScholar(formData) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }

        try {
            const response = await fetch('/api/axie-accounts', options)
            const data = await response.json()

            if (response.ok) {
                setAlert({ open: true, message: data.message, severity: 'success' })
                props.fetchAndMergeAxieAccountsData()
                return true
            }
            else {
                setAlert({ open: true, message: data.message, severity: 'error' })
                return false
            }
        }
        catch (err) {
            console.error(err)
        }
    }


    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby='dialog-title'
        >
            <DialogTitle
                id='dialog-title'
            >
                Add new account
                <IconButton
                    aria-label="close"
                    onClick={props.handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <ModalForm
                    startIcon={<AddIcon />}
                    onSubmit={addScholar}
                    handleClose={props.handleClose}
                    buttonText='Add'
                />
            </DialogContent>
        </Dialog>
    )
}