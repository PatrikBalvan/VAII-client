import { Toolbar, AppBar, Button } from '@mui/material';
import { Dispatch, FC, SetStateAction } from 'react';
import { User } from '../App';

interface HeaderProps {
  setUser: Dispatch<SetStateAction<User>>
  user: User
}

const Header: FC<HeaderProps> = (props) => {

  const logoutHandler = () => {
    localStorage.removeItem('user')
    props.setUser(undefined) 
  }

  return (
    <div>
        <AppBar position='static'>
            <Toolbar sx={{backgroundColor:'gray'}}>
                <Button color='inherit' onClick={() => {window.location.href = window.location.origin}}> Domov </Button>
                {!props.user ?
                  <>
                    <Button color='inherit' onClick={() => {window.location.href = `/register`}}> Registracia </Button>
                    <Button color='inherit' onClick={() => {window.location.href = `/login`}}> Prihlasenie </Button>
                  </>
                  :
                  <div>
                    Prihlaseny uživatel: {props.user.username}
                    <Button color='error' variant='contained' onClick={logoutHandler}>Logout</Button>
                    <Button color='inherit' onClick={() => {window.location.href = '/profile'}}>Profil</Button>
                  </div>
                }
            </Toolbar>
        </AppBar>
    </div>
  )
}

export default Header