import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react'

import '../styles/App.css'

function App() {
  const [reload, setReload] = React.useState<boolean>(false)
  const [clankyData, setClankyData] = React.useState<any>(null)

  React.useEffect(() => {
    fetch('/get_blogs')
      .then((response) => {
        response.json()
          .then((data) => {
            setClankyData(data)
          })
          .catch((err) => {
            console.error(err)
          })
      })
      .catch((err) => {
        console.error(err)
      })
    setReload(false)
  },[reload])

  const del_blog = (clanok_id: string) => {
      fetch(`/del_blog`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: clanok_id})
      }).then(() => {
        setReload(true)
      }).catch((err) => {
        console.error(err)
      })
  }

  return (
    <div>
      <Paper className='clanky-wrap'>
        <Typography variant='h5'>Články</Typography>
        <Stack direction='column' spacing={2}>
          {
          clankyData ?
          clankyData.map((cl, i) => {
            return (
              <Box sx={{mt: 3, border: '1px solid black', borderRadius: '5px', width: '100%'}}>
                <Typography variant='h6' style={{wordWrap:'break-word', width:'100%'}} >{cl.title}</Typography>
                <Typography variant='body1' style={{wordWrap:'break-word', width:'100%'}}>{cl.content}</Typography>
                <Button size='medium' variant='outlined' startIcon={<EditIcon/>} onClick={() => {
                  window.location.href = `${window.location.origin}/article/${cl._id}`}}>Upraviť</Button>
                <Button size='medium' variant='outlined' startIcon={<DeleteIcon/>} onClick={() => {del_blog(cl._id)}}>Vymazať</Button>  
              </Box>
            )
          })
          :
          <Typography variant='body1'>Članky sa načitavaju..</Typography>
        }
        </Stack>
        
      </Paper>
    </div>
  )
}

export default App