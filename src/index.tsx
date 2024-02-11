import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css'

export default function Site() {
  return (
    <App/>
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
