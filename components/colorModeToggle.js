import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import { useContext } from 'react'
import { AppContext } from '../pages/_app'

export default function ColorModeToggle() {
    const theme = useTheme();
    const { setMode } = useContext(AppContext)

    return (
        <Box sx={{ml: 1}}>
            <IconButton
                onClick={() => {
                    const prevMode = JSON.parse(localStorage.getItem('mode'))
                    const newMode = prevMode === 'light' ? 'dark' : 'light'
                    setMode(newMode)
                    localStorage.setItem('mode', JSON.stringify(newMode))
                }}
                color="inherit"
            >
                {theme.palette.mode === 'dark' ? <LightModeIcon /> : <ModeNightIcon />}
            </IconButton>
        </Box>
    );
}