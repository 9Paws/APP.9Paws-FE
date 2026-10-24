import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/auth.store';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return null;
  }

  return <Redirect href={isAuthenticated ? ('/(tabs)' as any) : ('/(auth)/login' as any)} />;
}
