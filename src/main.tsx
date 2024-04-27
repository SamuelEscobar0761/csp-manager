import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import AdminSidebar from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppRoutes } from './app/routes/AppRoutes.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <div className='flex'>
      <AdminSidebar/>
      <AppRoutes/>
      </div>
    </Router>
  </React.StrictMode>,
)
