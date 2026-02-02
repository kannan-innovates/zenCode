import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-[#1c1c1c] bg-[var(--color-background-dark)]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-[var(--color-primary)]">
            ZenCode
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/problems" className="text-sm text-gray-400 hover:text-white transition-colors">
            Problems
          </Link>
          <Link to="/mock-interviews" className="text-sm text-gray-400 hover:text-white transition-colors">
            Mock Interviews
          </Link>
          <Link to="/mentors" className="text-sm text-gray-400 hover:text-white transition-colors">
            Mentors
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="hidden sm:block text-sm font-medium text-white hover:text-[var(--color-primary)] transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="flex items-center justify-center h-9 px-4 rounded-md bg-[var(--color-primary)] hover:bg-blue-600 text-white text-sm font-bold transition-all"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;