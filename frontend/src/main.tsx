import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { StrictMode } from 'react'

import './index.css'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
