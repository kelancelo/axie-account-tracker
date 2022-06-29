import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import {AppContext} from './_app'

let managerData

export default function ManageAccount() {
    const router = useRouter()
    const {token, setAlert} = useContext(AppContext)
    const [formData, setFormData] = useState({ email: '', firstName: '', lastName: '' })
    const [password, setPassword] = useState({ oldPassword: '', newPassword: '' })
    const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false)
    const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false)
    
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

    useEffect(() => {
        if (!token) router.push('/login')
    })
    
    useEffect(() => {
        managerData = JSON.parse(localStorage.getItem('managerData'))
        if (managerData) setFormData({
            email: managerData.email,
            firstName: managerData.first_name,
            lastName: managerData.last_name
        })
    }, [])

    async function updateAccount(e) {
        e.preventDefault()

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ ...formData, password: managerData.password })
        }

        const response = await fetch('/api/update-manager', options)
        const responseJSON = await response.json()
        if (response.ok) {
            const loginResponse = await fetch('/api/login', options)
            const data = await loginResponse.json()
            localStorage.setItem('token', JSON.stringify('Bearer ' + data.access_token))
            localStorage.setItem('managerData', JSON.stringify(data.manager_data))
            setAlert({ open: true, message: responseJSON.msg, severity: 'success' })
        } else {
            setAlert({ open: true, message: responseJSON.msg, severity: 'error' })
        }
    }

    async function changePassword() {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ email: managerData.email, password: password.newPassword })
        }

        if (password.oldPassword !== managerData.password) {
            setAlert({ open: true, message: 'Wrong old password.', severity: 'error' })
        } else {
            const response = await fetch('/api/change-password', options)
            if (response.ok) {
                const loginResponse = await fetch('/api/login', options)
                const data = await loginResponse.json()
                localStorage.setItem('token', JSON.stringify('Bearer ' + data.access_token))
                localStorage.setItem('managerData', JSON.stringify(data.manager_data))
                setAlert({ open: true, message: 'Changed password successfully.', severity: 'success' })
                setPassword({})
                setOpenChangePasswordDialog(false)
            } else {
                setAlert({ open: true, message: responseJSON.msg, severity: 'error' })
            }
        }
    }

    async function deleteAccount() {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ email: formData.email })
        }

        const response = await fetch('/api/delete-manager', options)
        if (response.ok) {
            localStorage.removeItem('token')
            localStorage.removeItem('managerData')
            router.push('/login')
            setAlert({ open: true, message: 'Account deleted successfully.', severity: 'success' })
        } else {
            setAlert({ open: true, message: responseJSON.msg, severity: 'error' })
        }
    }

    if (token) return (
        <>
            <Container maxWidth='sm' sx={{ marginY: 6 }}>
                <Typography variant='h5' component='h1' align='center' gutterBottom>EDIT ACCOUNT DETAILS</Typography>
                <form onSubmit={updateAccount}>
                    <TextField
                        variant='outlined'
                        label='First name'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin='normal'
                    />

                    <TextField
                        variant='outlined'
                        label='Last name'
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin='normal'
                    />

                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                    }}
                    >
                        <Button
                            startIcon={<SaveIcon />}
                            variant='contained'
                            type='submit'
                            sx={{ mr: 2, mt: 2 }}
                        >
                            Save
                        </Button>

                        <Button
                            startIcon={<DeleteIcon />}
                            variant='contained'
                            color='error'
                            onClick={() => setOpenConfirmDeleteDialog(true)}
                            sx={{ mr: 2, mt: 2 }}
                        >
                            Delete account
                        </Button>

                        <Button
                            startIcon={<EditIcon />}
                            variant='contained'
                            color='info'
                            onClick={() => setOpenChangePasswordDialog(true)}
                            sx={{ mt: 2 }}
                        >
                            Change password
                        </Button>
                    </Box>
                </form>
            </Container>

            <Dialog
                open={openConfirmDeleteDialog}
                onClose={() => setOpenConfirmDeleteDialog(false)}
                aria-labelledby="confirm-delete-dialog-title"
                aria-describedby="confirm-delete-dialog-description"
            >
                <DialogTitle id="confirm-delete-dialog-title">
                    {"Confirm Delete"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-delete-dialog-description">
                        Are you sure about deleting your account?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDeleteDialog(false)} autoFocus>No</Button>
                    <Button onClick={() => {
                        deleteAccount()
                        setOpenConfirmDeleteDialog(false)
                    }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openChangePasswordDialog}
                onClose={() => setOpenChangePasswordDialog(false)}
                aria-labelledby="change-password-dialog-title"
            >
                <DialogTitle id="change-password-dialog-title">
                    {"Change password"}
                </DialogTitle>
                <DialogContent>
                    <form>
                        <TextField
                            variant='standard'
                            label='Old password'
                            type='password'
                            value={password.oldPassword}
                            onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })}
                            fullWidth
                            required
                            margin='normal'
                        />

                        <TextField
                            variant='standard'
                            label='New password'
                            type='password'
                            value={password.newPassword}
                            onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                            fullWidth
                            required
                            margin='normal'
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setPassword({})
                            setOpenChangePasswordDialog(false)
                        }}
                        autoFocus
                    >
                        Cancel
                    </Button>
                    <Button onClick={changePassword}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}