import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material'
import ModalForm from './modalForm'
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close'
import { useContext } from 'react'
import { AppContext } from '../pages/_app';
import { FetchContext } from '../pages/main';

export default function UpdateAxieAccountModal(props) {
    const { setAlert } = useContext(AppContext)
    const fetchAndMergeAxieAccountsData = useContext(FetchContext)

    async function updateScholar(formData) {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }

        try {
            const response = await fetch(`/api/axie-accounts/${formData.roninAdd}`, options)
            const data = await response.json()
            if (response.ok) {
                setAlert({ open: true, message: data.message, severity: 'success' })
                fetchAndMergeAxieAccountsData()
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
                Edit account
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
                    startIcon={<SaveIcon />}
                    onSubmit={updateScholar}
                    handleClose={props.handleClose}
                    buttonText='Save'
                    scholarUpdateData={props.scholarUpdateData}
                />
            </DialogContent>
        </Dialog>
    )
}

