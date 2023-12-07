import { Button, Paper, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import { useParams } from "react-router-dom";

import '../styles/CreateArticle.css'
import axios from 'axios'

function CreateArticle() { 
    const { articleId } = useParams()
    const [disabledSend, setDisabledSend] = React.useState<boolean>(true)
    const [titleState, setTitleState] = React.useState<string>('')
    const [contentState, setContentState] = React.useState<string>('')

    React.useEffect(() => {
        if(articleId) {
            fetch(`/get_blog_by_id`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: articleId})
            }).then((res) => {
                res.json().then((data) => {
                    setTitleState(data[0].title)
                    setContentState(data[0].content)
                })
            }).catch((err) => {
                console.error(err)
            })
        }
    },[articleId])

    React.useEffect(() => {
        setDisabledSend(titleState === '' || contentState === '')
    },[titleState, contentState])

    const sendArticle = () => {
        const data = {title: titleState, content: contentState}

        fetch('/save_blog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(data)
        }).then((res) => {
            window.location.href = window.location.origin
        }).catch((err) => {
            console.error(err)
        })
    }

    const updateArticle = () => {
        const data = {title: titleState, content: contentState, id: articleId}

        fetch('/update_blog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(data)
        }).then((res) => {
            window.location.href = window.location.origin
        }).catch((err) => {
            console.error(err)
        })
    }

    return (
        <div>
            <Paper className='create-clanok-wrap'>
                <Stack direction='column' spacing={2}>
                    <Typography variant='h4'>Vytvorenie nového článku</Typography>
                    <TextField label='Názov článku' variant='outlined' inputProps={{ maxLength: 60 }} value={titleState} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setTitleState(event.target.value)}}/>
                    <TextField label='Obsah článku' variant='outlined' multiline={true} minRows={4} inputProps={{ maxLength: 200 }} value={contentState} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setContentState(event.target.value)}}/>
           
                    <Stack direction='row' spacing={2}>
                        <Button variant='contained' color='success' disabled={disabledSend} onClick={() => {articleId ? updateArticle() : sendArticle()}}>Odoslať</Button>
                        <Button variant='contained' color='error' onClick={() => {window.location.href = window.location.origin}}>Zrušiť</Button>
                    </Stack>
                </Stack>
            </Paper>
        </div>
    )
}

export default CreateArticle