import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { MantineProvider } from '@mantine/core';

import './index.css'
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import App from './App.tsx'
import { store } from './store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider>
    <App />
    </MantineProvider>
    </Provider>
  </StrictMode>,
)
