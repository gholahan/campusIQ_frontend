import { AuthInitializer } from '@/features/auth/hooks/useAuth';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import ScrollToTop from '@/shared/components/ScrollToTop';

export default function App() {
  
  return (
  <AuthInitializer> 
    <BrowserRouter>
      <ScrollToTop/>
      <AppRoutes />
    </BrowserRouter>
  </AuthInitializer>
  );
}
