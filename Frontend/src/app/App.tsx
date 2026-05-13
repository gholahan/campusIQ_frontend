import { AuthInitializer } from '@/features/auth/hooks/useAuth';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';

export default function App() {
  
  return (
  <AuthInitializer> 
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthInitializer>
  );
}
