import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './sites/Home'
import Register from './sites/Register'
import Login from './sites/Login'
import {useState } from 'react'
import Profile from './sites/Profile'

interface _User {
  email: string,
  username: string,
  _id: string,
  token: string
}

export type User = _User | undefined  

function App() {
  const localStorageUser = localStorage.getItem('user')
  const [user, setUser] = useState<User>(localStorageUser ? JSON.parse(localStorageUser) : undefined)

  return (
    <BrowserRouter>
      <Header setUser={setUser} user={user}/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register user={user} setUser={setUser}/>}/>
        <Route path='/login' element={<Login user={user} setUser={setUser}/>}/>
        <Route path='/profile' element={<Profile user={user} setUser={setUser}/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App