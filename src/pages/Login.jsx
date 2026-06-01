import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../lib';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks';
import styles from './Login.module.css';

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;
const LS_ATTEMPTS_KEY = 'login_attempts';
const LS_LOCKOUT_KEY = 'login_locked_until';

function readAttempts() {
  const raw = localStorage.getItem(LS_ATTEMPTS_KEY);
  return raw ? parseInt(raw, 10) : 0;
}

function readLockedUntil() {
  const raw = localStorage.getItem(LS_LOCKOUT_KEY);
  return raw ? parseInt(raw, 10) : 0;
}

function setAttemptsStorage(n) {
  localStorage.setItem(LS_ATTEMPTS_KEY, String(n));
}

function setLockoutStorage(ts) {
  localStorage.setItem(LS_LOCKOUT_KEY, String(ts));
}

function clearRateLimit() {
  localStorage.removeItem(LS_ATTEMPTS_KEY);
  localStorage.removeItem(LS_LOCKOUT_KEY);
}

export default function Login() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [showResetInput, setShowResetInput] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState(null);

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const lockedUntil = readLockedUntil();
    if (Date.now() < lockedUntil) {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 60000);
      setError(`Too many failed attempts. Please try again in ${remaining} minute(s).`);
      return;
    }

    // If lockout expired, clear it so the counter resets
    if (lockedUntil && Date.now() >= lockedUntil) {
      clearRateLimit();
    }

    setLoading(true);

    try {
      await signIn(email, password);
      clearRateLimit();
      navigate('/admin');
    } catch (err) {
      const attempts = readAttempts() + 1;
      setAttemptsStorage(attempts);
      if (attempts >= MAX_ATTEMPTS) {
        const lockoutTime = Date.now() + LOCKOUT_DURATION_MS;
        setLockoutStorage(lockoutTime);
        setError(`Too many failed attempts. Account locked for 15 minutes.`);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSendResetEmail() {
    if (!resetEmail) return;
    setLoading(true);
    setResetMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
    if (error) {
      setResetMessage(error.message);
    } else {
      setResetMessage("Password reset email sent. Please check your inbox.");
      setResetEmail('');
    }
    setLoading(false);
  }

  if (authLoading) return null;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.logoMark}>Portfolio CMS</span>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>Admin access only</p>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              maxLength={256}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              maxLength={128}
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        {!showResetInput ? (
          <button type="button" onClick={() => setShowResetInput(true)} className={styles.backBtn} style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
            Forgot password?
          </button>
        ) : (
          <div className={styles.resetContainer}>
            <div className={styles.field}>
              <label className={styles.label}>Reset Password</label>
              <input
                className={styles.input}
                type="email"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                placeholder="Enter email to reset"
                required
                maxLength={256}
              />
            </div>
            {resetMessage && (
              <div className={styles.error} style={resetMessage.includes('sent') ? { backgroundColor: '#13231b', color: '#8fd195', borderColor: '#1a3325' } : {}}>
                {resetMessage}
              </div>
            )}
            <button type="button" onClick={handleSendResetEmail} className={styles.submitBtn} disabled={loading || !resetEmail}>
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
            <button type="button" onClick={() => { setShowResetInput(false); setResetMessage(null); setResetEmail(''); }} className={styles.backBtn}>
              Cancel
            </button>
          </div>
        )}
        <button 
          type="button" 
          className={styles.backBtn}
          onClick={() => navigate('/')}
        >
          ← Back to Homepage
        </button>
      </div>
    </div>
  );
}
