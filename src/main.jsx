import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicSite from './site/PublicSite'
import './styles.css'

const AdminApp = lazy(() => import('./admin/AdminApp'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<Suspense fallback={<div className="state"><span className="spinner" /></div>}><AdminApp /></Suspense>} />
        <Route path="*" element={<PublicSite />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
