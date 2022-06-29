import { Dialog, DialogTitle, DialogContent, IconButton, Card, CardMedia, CardContent, Typography, Container, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export default function AxiesModal(props) {
    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby='dialog-title'
        >
            <DialogTitle
                id='dialog-title'
            >
                Axies
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
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-around'
                    }}
                >
                    {props.axies.map(axie => (
                        <Card
                            key={axie.image}
                            variant='outlined'
                            sx={{ width: '240px', margin: 1.5 }}
                        >
                            <CardMedia
                                component='img'
                                image={axie.image}

                            />
                            <CardContent>
                                <Typography
                                    variant='h6'
                                    component='h3'
                                    textAlign='center'
                                >
                                    {axie.name}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </DialogContent>
        </Dialog>
    )
}
