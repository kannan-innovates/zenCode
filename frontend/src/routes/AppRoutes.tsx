import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from '../features/auth/pages/RegisterPage';
import OTPVerificationPage from '../features/auth/pages/OTPVerificationPage';
import LoginPage from '../features/auth/pages/LoginPage';
import { tokenService } from '../shared/lib/token';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OTPVerificationPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/dashboard"
        element={
          <div className="min-h-screen bg-[var(--color-background-dark)] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-white text-4xl font-bold mb-4">Dashboard</h1>
              <p className="text-gray-400 mb-8">You're logged in! 🎉</p>
              <button
                onClick={() => {
                  tokenService.clear();
                  window.location.href = '/login';
                }}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;