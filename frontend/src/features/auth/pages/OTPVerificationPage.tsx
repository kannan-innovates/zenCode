import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { showSuccess, showError } from '../../../shared/utils/toast.util';

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('registrationEmail');
    if (!storedEmail) {
      navigate('/register');
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, '');

    if (digit.length > 1) {
      const digits = digit.slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (index + i < 6) {
          newOtp[index + i] = d;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    const newOtp = [...otp];
    pastedData.split('').forEach((digit, i) => {
      if (i < 6) {
        newOtp[i] = digit;
      }
    });
    setOtp(newOtp);
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      showError('Please enter complete OTP');
      return;
    }

    if (!email) {
      showError('Email not found. Please register again.');
      navigate('/register');
      return;
    }

    setIsLoading(true);
    try {
      await authService.verifyOTP({ email, otp: otpValue });
      showSuccess('Registration successful! Please login.');
      sessionStorage.removeItem('registrationEmail');
      navigate('/login');
    } catch (error) {
      // Error already shown by axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <main className="flex-1 flex items-center justify-center py-12 px-4 relative z-10">
        <div className="w-full max-w-[540px] flex flex-col gap-6">
          <div className="text-center flex flex-col gap-2">
            <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.02em]">
              Verify your email
            </h1>
            <p className="text-gray-400 text-base font-normal">
              Enter the 6-digit code sent to {email}
            </p>
          </div>

          <div className="bg-[var(--color-card-dark)] border border-[var(--color-border-dark)] rounded-xl p-6 md:p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex justify-between gap-2 md:gap-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-full aspect-square text-center text-2xl font-bold bg-[var(--color-background-dark)] border border-[var(--color-border-dark)] text-white rounded-md focus:border-[var(--color-primary)] focus:ring-0 focus:shadow-[0_0_10px_rgba(45,95,255,0.3)] outline-none transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center rounded-lg h-12 px-6 font-bold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--color-primary)] hover:bg-blue-600 text-white shadow-[0_0_20px_rgba(46,95,255,0.4)] hover:shadow-[0_0_30px_rgba(46,95,255,0.5)]"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OTPVerificationPage;