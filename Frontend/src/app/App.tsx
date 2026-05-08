import { useAuthStore } from '@/features/auth/authStore';
import { AuthInitializer } from '@/features/auth/hooks/useAuth';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';

export default function App() {
  // Initialize the auth store
  useAuthStore.getState().initialize();

  return (
    <AuthInitializer>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthInitializer>
  );
}
