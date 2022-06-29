import { TextField, Button } from "@mui/material"
import { useState, useEffect } from "react"

export default function ModalForm(props) {
    const initialFormState = {
        name: '',
        roninAdd: '',
        scholarShare: 0,
        managerShare: 100
    }
    const [formData, setFormData] = useState(initialFormState)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (props.scholarUpdateData) setFormData(props.scholarUpdateData)
    }, [props.scholarUpdateData])


    function handleChange(e) {
        if (e.target.name === 'scholarShare') {
            setFormData({ ...formData, scholarShare: parseInt(e.target.value), managerShare: 100 - e.target.value })
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
    }

    function validate() {
        let nameError
        let scholarShareError

        if (formData.name.length < 2) {
            nameError = 'Must be at least 2 characters long.'
        }
        if (formData.scholarShare < 0 || formData.scholarShare > 100) {
            scholarShareError = true
        }
        if (nameError || scholarShareError) {
            setErrors({ nameError, scholarShareError })
            return false
        }
        return true
    }

    function handleSubmit(e) {
        e.preventDefault()

        if (validate()) {
            props.onSubmit(formData)
                .then(result => {
                    if (result === true) {
                        setFormData(initialFormState)
                        props.handleClose()
                    }
                })
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                variant='standard'
                label='Name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                margin='dense'
                error={errors.nameError ? true : false}
                helperText={errors.nameError}
            />

            {props.buttonText === 'Add' && (
                <TextField
                    variant='standard'
                    label='Ronin address'
                    name='roninAdd'
                    value={formData.roninAdd}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin='dense'
                    helperText="Replace 'ronin:' with '0x' in your ronin address."
                />
            )}

            <TextField
                variant='standard'
                label='Scholar Share'
                name='scholarShare'
                value={formData.scholarShare}
                onChange={handleChange}
                fullWidth
                required
                type="number"
                margin='dense'
                error={errors.scholarShareError}
                helperText='Enter value within 0 and 100 only, inclusive.'
            />

            <TextField
                variant='standard'
                label='Manager Share'
                name='managerShare'
                value={formData.managerShare}
                fullWidth
                type="number"
                margin='dense'
                inputProps={{ readOnly: true }}
            />

            <Button
                startIcon={props.startIcon}
                variant='contained'
                sx={{ mt: 2 }}
                type='submit'
            >
                {props.buttonText}
            </Button>
        </form>
    )
}
