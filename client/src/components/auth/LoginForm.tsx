import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';

// ─── Validation Schema ────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onNavigateToRegister?: () => void;
}

/**
 * LoginForm.tsx — User login form component
 *
 * Provides real-time Zod validation, password visibility toggles, loading indicators,
 * post-login location redirection, and integration with the Zustand auth store (Task 25).
 */
export const LoginForm = ({
  onSuccess,
  onNavigateToRegister,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginSchemaType) => {
    try {
      const user = await login(values);
      toast.success(`Welcome back, ${user.firstName}!`);

      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to intended destination if redirected from ProtectedRoute, else /dashboard
        const fromLocation = (location.state as { from?: { pathname: string } })
          ?.from?.pathname;
        navigate(fromLocation || '/dashboard', { replace: true });
      }
    } catch (err) {
      const apiError = err as { message?: string };
      const errorMessage = apiError.message || 'Invalid email or password';

      setError('root', { message: errorMessage });
      toast.error(errorMessage);
    }
  };

  /** Helper to quick-fill credentials for demo testing */
  const handleQuickFill = (email: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', 'password123', { shouldValidate: true });
  };

  const isPending = isSubmitting || isLoading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Root Error Banner */}
      {errors.root && (
        <div
          role="alert"
          className="p-3 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20 font-medium"
        >
          {errors.root.message}
        </div>
      )}

      {/* Email Input */}
      <div className="space-y-1.5">
        <Label htmlFor="login-email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="login-email"
            type="email"
            placeholder="admin@demo.com"
            autoComplete="email"
            className="pl-9"
            disabled={isPending}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p role="alert" className="text-xs text-destructive mt-1 font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Password</Label>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            className="pl-9 pr-9"
            disabled={isPending}
            {...register('password')}
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p role="alert" className="text-xs text-destructive mt-1 font-medium">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      {/* Demo Credentials Quick-Fill Helpers */}
      <div className="pt-2">
        <p className="text-xs text-muted-foreground mb-2 text-center">
          Quick-fill demo credentials:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickFill('admin@demo.com')}
            disabled={isPending}
          >
            Admin Demo
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickFill('employee1@demo.com')}
            disabled={isPending}
          >
            Employee Demo
          </Button>
        </div>
      </div>

      {/* Toggle to Register page */}
      <div className="text-center pt-2 text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() => {
            if (onNavigateToRegister) {
              onNavigateToRegister();
            } else {
              navigate('/register');
            }
          }}
          className="text-primary hover:underline font-medium"
        >
          Create an account
        </button>
      </div>
    </form>
  );
};
