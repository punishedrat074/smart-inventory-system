import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

interface LoginPageProps {
  onSuccess?: () => void;
  onNavigateToRegister?: () => void;
}

/**
 * LoginPage.tsx — Login page view component
 *
 * Wraps LoginForm inside AuthLayout.
 * Accepts optional navigation callbacks for router/demo integration.
 */
export const LoginPage = ({
  onSuccess,
  onNavigateToRegister,
}: LoginPageProps) => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your email and password to access your inventory workspace."
    >
      <LoginForm
        onSuccess={onSuccess}
        onNavigateToRegister={onNavigateToRegister}
      />
    </AuthLayout>
  );
};
