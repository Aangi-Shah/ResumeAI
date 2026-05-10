import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Auth = ({ mode = 'login' }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, formData);
      login(data);
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-400">
          {mode === 'login' ? 'Login to ResumeAI' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="input-field"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              required
              className="input-field"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-4 py-3 text-lg font-semibold"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <Link to={mode === 'login' ? '/register' : '/login'} className="text-blue-400 hover:underline">
            {mode === 'login' ? 'Register' : 'Login'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Auth;
