import { Dispatch, FC, SetStateAction, useState } from 'react';
import { User } from '../App';
import { Link } from 'react-router-dom';
import { ReorderFourOutline, CloseOutline } from "react-ionicons";

interface HeaderProps {
  setUser: Dispatch<SetStateAction<User>>
  user: User
}

const Header: FC<HeaderProps> = (props) => {

  const [showNav, setShowNav] = useState(false)

  const logoutHandler = () => {
    localStorage.removeItem('user')
    props.setUser(undefined) 
  }

  const navHandler = () => {
    setShowNav(!showNav);
  };


  const navLinks = [
		{ title: "Domov", path: "/" },
    { title: "Registracia", path: "/register" },
	];

  return (
		<div className='flex justify-between items-center h-24 max-w-[80%] mx-auto px-4 bg-black text-white'>
      <h1 className='w-full text-3xl font-bold'>Auto forum</h1>
      <div className='hidden md:flex'>
        {navLinks.map((item) => (
          <Link className='p-4' to={item.path} key={item.title}>{item.title}</Link>
        ))}
      </div>
      <div onClick={navHandler} className='block md:hidden'>
          {showNav ? <CloseOutline color={'#ffffff'}/> : <ReorderFourOutline color={'#ffffff'}/>}
      </div>
      <div className={showNav ? 'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500' : 'ease-in-out duration-500 fixed left-[-100%]'}>
        <h1 className='w-full text-3xl font-bold m-4'>Auto forum</h1>
        {navLinks.map((item) => (
          <Link className='p-4 border-b border-gray-600' to={item.path} key={item.title}>{item.title}</Link>
        ))}
      </div>
    </div>
	);
}

export default Header