import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { forgotPassword, resetPassword } from '@api/cms'
import { useAuth } from '@context/AuthContext'
import { useContent } from '@context/ContentContext'
import styles from './admin.module.css'

function PasswordInput({ id, value, onChange, show, onToggle, required = true, minLength }) {
  return (
    <div className={styles.passwordField}>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
      />
      <button
        type="button"
        className={styles.passwordToggle}
        onClick={onToggle}
        aria-label={show ? 'Hide password' : 'Show password'}
        title={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
      </button>
    </div>
  )
}

function LoginBrandPanel({ company }) {
  const name = company?.name || 'Shrine of Our Lady of Kibeho'
  const logo = company?.logo || '/images/logo/logo-transparent.png'

  return (
    <aside className={styles.loginBrand}>
      <div className={styles.loginBrandInner}>
        <img src={logo} alt="" className={styles.loginLogo} />
        <p className={styles.loginEyebrow}>Content management</p>
        <h1 className={styles.loginBrandTitle}>{name}</h1>
        <p className={styles.loginBrandText}>
          Sign in to update pages, news, pilgrimages, and pastoral content for the official shrine
          website.
        </p>
        <ul className={styles.loginBrandList}>
          <li>Our Lady of Kibeho &amp; the Shrine</li>
          <li>Pilgrimage &amp; spirituality</li>
          <li>News, media &amp; support</li>
        </ul>
        <Link to="/" className={styles.loginPublicLink}>
          ← View public website
        </Link>
      </div>
    </aside>
  )
}

export default function LoginPage() {
  const { login, registerAdmin, user, loading } = useAuth()
  const { company } = useContent()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const resetToken = params.get('token')
  const resetEmail = params.get('email') || ''

  const [mode, setMode] = useState(resetToken ? 'reset' : 'login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState(resetEmail || '')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  if (!loading && user) return <Navigate to="/admin" replace />

  const firstError = (err) =>
    err.errors?.email?.[0] ||
    err.errors?.password?.[0] ||
    err.errors?.name?.[0] ||
    err.message ||
    'Request failed'

  const handleLogin = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      setError(firstError(err) || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setMessage('')
    try {
      await registerAdmin({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      navigate('/admin')
    } catch (err) {
      setError(firstError(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setMessage('')
    try {
      const result = await forgotPassword(email)
      setMessage(result.message || 'Reset link sent if the email exists.')
    } catch (err) {
      setError(firstError(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setMessage('')
    try {
      const result = await resetPassword({
        token: resetToken,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      setMessage(result.message || 'Password reset. You can sign in now.')
      setMode('login')
    } catch (err) {
      setError(firstError(err))
    } finally {
      setSubmitting(false)
    }
  }

  const go = (next) => {
    setMode(next)
    setError('')
    setMessage('')
  }

  const titles = {
    login: 'Welcome back',
    register: 'Create admin account',
    forgot: 'Reset password',
    reset: 'Choose a new password',
  }

  const subtitles = {
    login: 'Sign in to manage the official shrine website.',
    register: 'Register a dashboard account for shrine content management.',
    forgot: 'We will email a link to reset your password.',
    reset: 'Enter and confirm your new password.',
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginShell}>
        <LoginBrandPanel company={company} />

        <div className={styles.loginCard}>
          <div className={styles.loginCardMobileBrand}>
            <img
              src={company?.logo || '/images/logo/logo-transparent.png'}
              alt=""
              className={styles.loginLogoSm}
            />
            <p>{company?.name || 'Shrine of Our Lady of Kibeho'}</p>
          </div>

          {mode === 'login' && (
            <form onSubmit={handleLogin}>
              <h2>{titles.login}</h2>
              <p>{subtitles.login}</p>
              <div className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="password">Password</label>
                  <PasswordInput
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    show={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                  />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                {message && <p className={styles.muted}>{message}</p>}
                <button className={styles.btn} type="submit" disabled={submitting}>
                  {submitting ? 'Signing in…' : 'Sign in'}
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => go('register')}
                >
                  Create admin account
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => go('forgot')}
                >
                  Forgot password?
                </button>
              </div>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister}>
              <h2>{titles.register}</h2>
              <p>{subtitles.register}</p>
              <div className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="reg-name">Name</label>
                  <input
                    id="reg-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="reg-email">Email</label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="reg-password">Password</label>
                  <PasswordInput
                    id="reg-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    show={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                    minLength={8}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="reg-password-confirm">Confirm password</label>
                  <PasswordInput
                    id="reg-password-confirm"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    show={showPasswordConfirm}
                    onToggle={() => setShowPasswordConfirm((v) => !v)}
                    minLength={8}
                  />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button className={styles.btn} type="submit" disabled={submitting}>
                  {submitting ? 'Creating…' : 'Create admin account'}
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => go('login')}
                >
                  Back to login
                </button>
              </div>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgot}>
              <h2>{titles.forgot}</h2>
              <p>{subtitles.forgot}</p>
              <div className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="forgot-email">Email</label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                {message && <p className={styles.muted}>{message}</p>}
                <button className={styles.btn} type="submit" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send reset link'}
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => go('login')}
                >
                  Back to login
                </button>
              </div>
            </form>
          )}

          {mode === 'reset' && (
            <form onSubmit={handleReset}>
              <h2>{titles.reset}</h2>
              <p>{subtitles.reset}</p>
              <div className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="reset-email">Email</label>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="reset-password">New password</label>
                  <PasswordInput
                    id="reset-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    show={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                    minLength={8}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="reset-password-confirm">Confirm password</label>
                  <PasswordInput
                    id="reset-password-confirm"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    show={showPasswordConfirm}
                    onToggle={() => setShowPasswordConfirm((v) => !v)}
                    minLength={8}
                  />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                {message && <p className={styles.muted}>{message}</p>}
                <button className={styles.btn} type="submit" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Reset password'}
                </button>
                <Link to="/admin/login" className={`${styles.btn} ${styles.btnSecondary}`}>
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
