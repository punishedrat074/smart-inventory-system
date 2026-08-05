import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

interface RegisterPageProps {
  onSuccess?: () => void;
  onNavigateToLogin?: () => void;
}

/**
 * RegisterPage.tsx — Registration page view component
 *
 * Wraps RegisterForm inside AuthLayout.
 * Accepts optional navigation callbacks for router/demo integration.
 */
export const RegisterPage = ({
  onSuccess,
  onNavigateToLogin,
}: RegisterPageProps) => {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Fill in your details below to set up your inventory management account."
    >
      <RegisterForm
        onSuccess={onSuccess}
        onNavigateToLogin={onNavigateToLogin}
      />
    </AuthLayout>
  );
};
