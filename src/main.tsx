import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './hooks/useAuth.tsx'
import { EventsProvider } from './hooks/events-context.tsx'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <EventsProvider>
      <App />
    </EventsProvider>
  </AuthProvider>
)
