import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../services/auth.service';
import { showSuccess } from '../../../shared/utils/toast.util';
import Navbar from '../../../shared/components/Navbar';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      sessionStorage.setItem('registrationEmail', data.email);
      showSuccess('OTP sent to your email');
      navigate('/verify-otp');
    } catch (error) {
      // Error already shown by axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative flex min-h-screen w-full flex-col pt-16">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <main className="flex-1 flex items-center justify-center py-12 px-4 relative z-10">
          <div className="w-full max-w-[540px] flex flex-col gap-6">
            <div className="text-center flex flex-col gap-2">
              <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.02em]">
                Create your account
              </h1>
              <p className="text-gray-400 text-base font-normal">
                Start your coding interview journey
              </p>
            </div>

            <div className="bg-[var(--color-card-dark)] border border-[var(--color-border-dark)] rounded-xl p-6 md:p-8 shadow-2xl">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <label className="flex flex-col gap-2">
                  <span className="text-gray-300 text-sm font-medium">Full Name</span>
                  <input
                    {...register('fullName')}
                    type="text"
                    placeholder="John Doe"
                    className={`form-input w-full rounded-lg bg-[var(--color-input-bg)] border ${
                      errors.fullName ? 'border-red-500' : 'border-[var(--color-border-dark)]'
                    } text-white placeholder-gray-500 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none transition-all h-12 px-4`}
                  />
                  {errors.fullName && (
                    <span className="text-red-500 text-sm">{errors.fullName.message}</span>
                  )}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-gray-300 text-sm font-medium">Email</span>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="john@example.com"
                    className={`form-input w-full rounded-lg bg-[var(--color-input-bg)] border ${
                      errors.email ? 'border-red-500' : 'border-[var(--color-border-dark)]'
                    } text-white placeholder-gray-500 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none transition-all h-12 px-4`}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">{errors.email.message}</span>
                  )}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-gray-300 text-sm font-medium">Password</span>
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••"
                    className={`form-input w-full rounded-lg bg-[var(--color-input-bg)] border ${
                      errors.password ? 'border-red-500' : 'border-[var(--color-border-dark)]'
                    } text-white placeholder-gray-500 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none transition-all h-12 px-4`}
                  />
                  {errors.password && (
                    <span className="text-red-500 text-sm">{errors.password.message}</span>
                  )}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-gray-300 text-sm font-medium">Confirm Password</span>
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="••••••••"
                    className={`form-input w-full rounded-lg bg-[var(--color-input-bg)] border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-[var(--color-border-dark)]'
                    } text-white placeholder-gray-500 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none transition-all h-12 px-4`}
                  />
                  {errors.confirmPassword && (
                    <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
                  )}
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center rounded-lg h-12 px-6 font-bold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--color-primary)] hover:bg-blue-600 text-white shadow-[0_0_20px_rgba(46,95,255,0.4)] hover:shadow-[0_0_30px_rgba(46,95,255,0.5)]"
                >
                  {isLoading ? 'Sending OTP...' : 'Continue'}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default RegisterPage;