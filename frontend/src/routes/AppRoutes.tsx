import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from '../features/auth/pages/RegisterPage';
import OTPVerificationPage from '../features/auth/pages/OTPVerificationPage';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" replace />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OTPVerificationPage />} />
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );
}