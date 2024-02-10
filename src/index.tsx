import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

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
