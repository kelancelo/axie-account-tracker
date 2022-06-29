import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Menu from '@mui/material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import logo from '../public/logo.png'
import { useState, useContext } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import ColorModeToggle from './colorModeToggle'
import { useSession, signIn, signOut } from "next-auth/react"


export default function Navbar() {
    //console.log('nav rendered')
    const { data } = useSession()
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const router = useRouter()


    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };


    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                {/* desktop mode */}
                <Toolbar disableGutters>
                    <Box
                        onClick={() => router.push(data && '/')}
                        sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
                    >
                        <Image src={logo} width={40} height={40} alt='Yellow axie wearing shades with lots of cash in the background'/>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            sx={{
                                mx: 1,
                                display: { xs: 'none', md: 'flex' },
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            AXIE ACCOUNT TRACKER
                        </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1, justifyContent: 'flex-end', display: { xs: 'none', md: 'flex' } }}>
                        {!data && (
                            <Button
                                key='Login'
                                onClick={() => signIn('google')}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                Login
                            </Button>
                        )}
                    </Box>

                    {/* Mobile mode */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        {!data &&
                            <>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenNavMenu}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>

                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElNav}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    sx={{
                                        display: { xs: 'block', md: 'none' },
                                    }}
                                >

                                    <MenuItem key='Login' onClick={() => {
                                        signIn('google')
                                        handleCloseNavMenu()
                                    }}>
                                        <Typography textAlign="center">Login</Typography>
                                    </MenuItem>

                                </Menu>
                            </>
                        }
                    </Box>

                    <Box
                        sx={{ flexGrow: 1, alignItems: 'center', display: { xs: 'flex', md: 'none' } }}
                        onClick={() => router.push(data && '/')}
                    >
                        <Image src={logo} width={40} height={40} alt='Yellow axie wearing shades with lots of cash in the background'/>
                        <Typography
                            ml={1}
                            variant="body1"
                            noWrap
                            component="a"
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            AXIE ACCOUNT TRACKER
                        </Typography>
                    </Box>

                    <Box sx={{ display: !data ? 'none' : 'block' }}>
                        <Tooltip title="Account menu">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar src={data && data.user.image}></Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >

                            <MenuItem key='Logout' onClick={() => {
                                signOut()
                                handleCloseUserMenu()
                            }}
                            >
                                <Typography textAlign="center">Logout</Typography>
                            </MenuItem>

                            <Divider />

                            <MenuItem>
                                <Typography textAlign='center' fontSize='.75rem'>
                                    Logged in as {data && data.user.name}
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                    <ColorModeToggle />
                </Toolbar>
            </Container>
        </AppBar>
    );
};

