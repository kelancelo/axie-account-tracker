import { Container, TextField, Button, Typography } from '@mui/material'
import { useState, useContext, useEffect } from 'react'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import { useRouter } from 'next/router'
import { AppContext } from './_app'

export default function SignUp() {
    const initialFormState = {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    }
    console.log('sign up rendered')
    const router = useRouter()
    const [formData, setFormData] = useState(initialFormState)
    const {token, setAlert} = useContext(AppContext)

    useEffect(() => {
        if(token) router.push('/')
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    async function signUp(e) {
        e.preventDefault()
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }
        const response = await fetch('/api/sign-up', options)
        const data = await response.json()
        if (response.ok) {
            router.push('/login')
            setAlert({open: true, message: data.msg, severity: 'success'})
        } else {
            setAlert({ open: true, message: data.msg, severity: 'error' })
        }
    }

    if (!token) return (
        <Container maxWidth='sm' sx={{ marginY: 6 }}>
            <Typography variant='h5' component='h1' align='center' gutterBottom>SIGN UP</Typography>
            <form onSubmit={signUp}>
                <TextField
                    variant='outlined'
                    label='First name'
                    fullWidth
                    required
                    name='firstName'
                    value={formData.firstName}
                    onChange={handleChange}
                    margin='normal'
                />

                <TextField
                    variant='outlined'
                    label='Last name'
                    fullWidth
                    required
                    name='lastName'
                    value={formData.lastName}
                    onChange={handleChange}
                    margin='normal'
                />

                <TextField
                    variant='outlined'
                    label='Email'
                    fullWidth
                    required
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    margin='normal'
                />

                <TextField
                    variant='outlined'
                    label='Password'
                    fullWidth
                    required
                    name='password'
                    type='password'
                    value={formData.password}
                    onChange={handleChange}
                    margin='normal'
                />

                <Button
                    startIcon={<AppRegistrationIcon />}
                    type='submit'
                    variant='contained'
                    sx={{ marginY: 2 }}
                >
                    Sign up
                </Button>
            </form>
        </Container>
    )
}