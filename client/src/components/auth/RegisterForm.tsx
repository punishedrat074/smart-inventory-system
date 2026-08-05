import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';

// ─── Validation Schema ────────────────────────────────────────────────────────
const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be at most 128 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
  onNavigateToLogin?: () => void;
}

/**
 * RegisterForm.tsx — User registration form component
 *
 * Provides client-side validation for new account creation (First/Last name, email,
 * password & confirm password validation) integrated with authStore (Task 25).
 */
export const RegisterForm = ({
  onSuccess,
  onNavigateToLogin,
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterSchemaType) => {
    try {
      const user = await registerUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });
      toast.success(`Account created! Welcome, ${user.firstName}.`);

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const apiError = err as { message?: string };
      const errorMessage = apiError.message || 'Registration failed';

      setError('root', { message: errorMessage });
      toast.error(errorMessage);
    }
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

      {/* First & Last Name Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="reg-first-name">First Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="reg-first-name"
              placeholder="Jane"
              autoComplete="given-name"
              className="pl-9"
              disabled={isPending}
              {...register('firstName')}
            />
          </div>
          {errors.firstName && (
            <p
              role="alert"
              className="text-xs text-destructive mt-1 font-medium"
            >
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reg-last-name">Last Name</Label>
          <Input
            id="reg-last-name"
            placeholder="Doe"
            autoComplete="family-name"
            disabled={isPending}
            {...register('lastName')}
          />
          {errors.lastName && (
            <p
              role="alert"
              className="text-xs text-destructive mt-1 font-medium"
            >
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Email Input */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="reg-email"
            type="email"
            placeholder="jane.doe@company.com"
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
        <Label htmlFor="reg-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min 8 characters"
            autoComplete="new-password"
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

      {/* Confirm Password Input */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-confirm-password">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="reg-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Re-enter password"
            autoComplete="new-password"
            className="pl-9 pr-9"
            disabled={isPending}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            aria-label={
              showConfirmPassword
                ? 'Hide confirm password'
                : 'Show confirm password'
            }
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p role="alert" className="text-xs text-destructive mt-1 font-medium">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      {/* Toggle to Login page */}
      <div className="text-center pt-2 text-sm text-muted-foreground">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => {
            if (onNavigateToLogin) {
              onNavigateToLogin();
            } else {
              navigate('/login');
            }
          }}
          className="text-primary hover:underline font-medium"
        >
          Sign in
        </button>
      </div>
    </form>
  );
};
