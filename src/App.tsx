import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './sites/Home'
import Register from './sites/Register'
import Login from './sites/Login'
import {useState } from 'react'
import UpdateProfile from './sites/UpdateProfile'
import ArticleSite from './sites/Article'
import MyLikedArticles from './sites/MyLikedArticles'
import CreateArticle from './sites/CreateArticle'
import Admin from './sites/Admin'
import EditArticle from './sites/EditArticle'

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
        <Route path='/' element={<Home user={user} setUser={setUser}/>}/>
        <Route path='/login' element={<Login user={user} setUser={setUser}/>}/>
        <Route path='/register' element={<Register user={user} setUser={setUser}/>}/>
        <Route path='/updateProfile' element={<UpdateProfile user={user} setUser={setUser}/>}/>
        <Route path='/blog/:articleId' element={<ArticleSite user={user} setUser={setUser}/>}/>
        <Route path='/myLikedArticles' element={<MyLikedArticles user={user} setUser={setUser}/>}/>
        <Route path='/createArticle' element={<CreateArticle user={user} setUser={setUser}/>}/>
        <Route path='/editArticle/:articleId' element={<EditArticle user={user} setUser={setUser}/>}/>
        <Route path='/admin' element={<Admin user={user} setUser={setUser}/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App