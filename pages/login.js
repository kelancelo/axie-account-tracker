import { Container, TextField, Button, Typography } from '@mui/material'
import { useState, useContext, useEffect } from 'react'
import LoginIcon from '@mui/icons-material/Login'
import { useRouter } from 'next/router'
import { AppContext } from './_app'

export default function Login() {
    console.log('login rendered')
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const { token, setToken, setAlert } = useContext(AppContext)

    useEffect(() => {
        if (token) router.push('/')
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    async function login(e) {
        e.preventDefault()

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }

        const response = await fetch('/api/login', options)
        const data = await response.json()

        if (response.ok) {
            setToken('Bearer ' + data.access_token)
            localStorage.setItem('token', JSON.stringify('Bearer ' + data.access_token))
            localStorage.setItem('managerData', JSON.stringify(data.manager_data))
            router.push('/')
        } else {
            setAlert({ open: true, message: data.msg, severity: 'error' })
        }
    }


    if (!token) return (
        <Container maxWidth='sm' sx={{ marginY: 6 }}>
            <Typography variant='h5' component='h1' align='center' gutterBottom>LOGIN</Typography>
            <form onSubmit={login}>
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
                    type='password'
                    fullWidth
                    required
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    margin='normal'
                />

                <Button
                    startIcon={<LoginIcon />}
                    type='submit'
                    variant='contained'
                    sx={{ marginY: 2 }}
                >
                    Login
                </Button>
            </form>
        </Container>
    )
}