import React from 'react'
import { Toolbar, AppBar, Button } from '@mui/material';

function Header() {

  return (
    <div>
        <AppBar position='static'>
            <Toolbar sx={{backgroundColor:'gray'}}>
                <Button color='inherit' onClick={() => {window.location.href = window.location.origin}}> Domov </Button>
                <Button color='inherit' onClick={() => {window.location.href = `${window.location.origin}/article`}}> Pridať článok </Button>
            </Toolbar>
        </AppBar>
    </div>
  )
}

export default Header