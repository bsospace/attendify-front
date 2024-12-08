import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { AppRoutes } from '@/routes';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/providers/theme-provider';

function App() {
  return (
    <div className='w-full h-full'>
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
    </div>
  );
}

export default App;