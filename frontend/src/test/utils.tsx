import { RenderOptions, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import React, { ReactElement } from 'react'

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Export custom providers for specific test cases
export { AllTheProviders }
