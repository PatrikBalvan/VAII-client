import { Dispatch, FC, SetStateAction, useState } from 'react';
import { User } from '../App';
import { Link } from 'react-router-dom';
import '../styles/Header.css'
import Login from '../sites/Login';
import { Button, IconButton } from '@mui/material';
import ReorderIcon from '@mui/icons-material/Reorder';

interface HeaderProps {
  setUser: Dispatch<SetStateAction<User>>
  user: User
}

const Header: FC<HeaderProps> = (props) => {

  const [showNav, setShowNav] = useState(false)

  const logoutHandler = () => {
    localStorage.removeItem('user')
    props.setUser(undefined) 
    window.location.href = '/'
  }

  const navHandler = () => {
    setShowNav(!showNav);
  };

  return (
		<div className='nav-bar'>
      <div className='nav-left-side'>
        <div className='nav-links' id={showNav ? 'hidden' : ''}>
            <Link className='nav-link-item' to='/'>Domov</Link>
            {props.user &&
              <>
                <Link className='nav-link-item' to='/myLikedArticles'>Moje likenute artikly</Link> 
              </>
            }
        </div>
        <IconButton className='nav-expand-button' onClick={navHandler}>
          <ReorderIcon/>
        </IconButton>
      </div>
      <div className='nav-right-side'>
        {!props.user ?
          <Link className='nav-login' to='/login'>Login</Link>
          :
          <>
            <h1 className='nav-logged-user'>{props.user.username}</h1>
            <Button onClick={logoutHandler} variant='contained' color='error'>Odhlasiť</Button>
            <Button href='/updateProfile' variant='contained'>Nastavenia</Button>
          </>
        }
      </div>
    </div>
	);
}

export default Header