import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { notify } from '../reducers/notificationReducer.js'
import { Typography, Box, Stack, TextField, Button } from '@mui/material'

const NewBlogForm = ({ onCreate }) => {
    const [titleField, setTitleField] = useState('')
    const [authorField, setAuthorField] = useState('')
    const [urlField, setUrlField] = useState('')

    const dispatch = useDispatch()

    const reset = () => {
        setTitleField('')
        setAuthorField('')
        setUrlField('')
    }

    const handleBlogCreation = async (event) => {
        event.preventDefault()

        if (titleField && authorField && urlField) {
            onCreate({ title: titleField, author: authorField, url: urlField })
            reset()
            dispatch(notify(`A new blog: ${titleField} by ${authorField} added`, true))
        } else {
            dispatch(notify('All fields are mandatory!'))
        }
    }

    return (
        <div>
            <Typography variant='h5'>Create new</Typography>
            <Box component='form' onSubmit={handleBlogCreation}>
                <Stack spacing={2} sx={{ maxWidth: 400 }}>

                    <TextField
                        label="Title"
                        variant="outlined"
                        value={titleField}
                        onChange={({ target }) => setTitleField(target.value)}
                        fullWidth
                        required
                    />

                    <TextField
                        label="Author"
                        variant="outlined"
                        value={authorField}
                        onChange={({ target }) => setAuthorField(target.value)}
                        fullWidth
                        required
                    />

                    <TextField
                        label="Url"
                        variant="outlined"
                        value={urlField}
                        onChange={({ target }) => setUrlField(target.value)}
                        fullWidth
                        required
                    />

                    <Button
                        type='submit'
                        variant="contained"
                        size="large"
                    >
                        Create
                    </Button>

                </Stack>
            </Box>
        </div>
    )
}

export default NewBlogForm
