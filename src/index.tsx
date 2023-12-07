import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './components/App';
import Header from './components/Header';
import CreateArticle from './components/CreateArticle';
import { Container, Divider } from '@mui/material';

export default function Site() {
  return (
    <Container>
      <Header/>
      <Divider/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App/>}/>
          <Route path='article/:articleId?' element={<CreateArticle/>}/>
        </Routes>
      </BrowserRouter>
    </Container>
  )
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Site/>
  </React.StrictMode>
);
