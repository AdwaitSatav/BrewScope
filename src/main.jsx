import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { CollectionProvider } from './context/CollectionContext.jsx'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <CollectionProvider>
          <App />
        </CollectionProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
