import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Btn, Input } from '../../components/ui';
import toast from 'react-hot-toast';

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname || null;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const upd = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const message = params.get('message');
    if (error) {
      if (error === 'google_auth_failed') {
        toast.error(`Google Login Failed: ${message || 'Authentication error'}`);
      } else if (error === 'user_not_found') {
        toast.error('Google account could not be mapped to a user.');
      } else {
        toast.error('An error occurred during Google Login.');
      }
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Fill in all fields');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.displayName}!`);
      navigate(from || `/${user.role}/dashboard`, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', minHeight: '100dvh',
      background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(12px,4vw,24px)',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg,var(--p),var(--acc))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, margin: '0 auto 14px',
            boxShadow: 'var(--shadow-p)',
          }}>⚡</div>
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(20px,5vw,26px)', fontWeight: 800 }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--t2)', fontSize: 13, marginTop: 4 }}>
            Sign in to your Creatokite account
          </p>
        </div>

        <div style={{
          background: 'var(--s1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r2)',
          padding: 'clamp(18px,5vw,28px)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={upd('email')}
              placeholder="you@example.com"
              required
              autoComplete="email"
              autoCapitalize="none"
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={upd('password')}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <Btn variant="primary" className="w-full btn-lg" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </Btn>
            </form>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '18px 0',
            color: 'var(--t3)',
            fontSize: '11px',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            <span style={{ padding: '0 12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          </div>

          <button
            onClick={() => {
              const API = import.meta.env.VITE_API_URL || '/api';
              window.location.href = `${API}/auth/google`;
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '11px',
              borderRadius: 'var(--r)',
              border: '1px solid var(--border)',
              background: 'white',
              color: '#111',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '13.5px',
              fontFamily: 'var(--fb)',
              transition: 'background 0.2s',
              marginBottom: 18,
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f5f5f7'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: 8 }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--t2)' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--p2)', fontWeight: 600 }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
