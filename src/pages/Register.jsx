import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../data/AuthContext';
import { useToast } from '../components/ui/ToastProvider';

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'user'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = register(form);
    
    if (result.success) {
      show('Registration successful', 'success');
      navigate('/login');
    } else {
      show(result.message, 'error');
    }
    
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">
              B
            </div>
            <h1 className="text-2xl font-bold">Sign Up</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Create a new account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">First Name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={handleChange('firstName')}
                className="input"
                placeholder="Enter your first name"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Last Name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={handleChange('lastName')}
                className="input"
                placeholder="Enter your last name"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                className="input"
                placeholder="example@email.com"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">User Type</label>
              <select
                value={form.userType}
                onChange={handleChange('userType')}
                className="input"
              >
                <option value="user">Regular User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

