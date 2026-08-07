import { useState } from 'react'
import { changePassword } from '@api/cms'
import { useAuth } from '@context/AuthContext'
import FlashMessage from './components/FlashMessage'
import styles from './admin.module.css'

export default function AccountAdminPage() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFlash({ type: 'success', message: '' })
    try {
      await changePassword(form)
      setForm({ current_password: '', password: '', password_confirmation: '' })
      setFlash({ type: 'success', message: 'Password updated successfully.' })
    } catch (err) {
      const message = err.errors?.current_password?.[0] || err.errors?.password?.[0] || err.message || 'Update failed'
      setError(message)
      setFlash({ type: 'error', message })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>My account</h1>
      </div>
      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />
      <div className={styles.card}>
        <p className={styles.muted}>Signed in as {user?.email}</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Current password</label>
            <input type="password" value={form.current_password} onChange={(e) => setForm({ ...form, current_password: e.target.value })} required />
          </div>
          <div className={styles.field}>
            <label>New password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
          </div>
          <div className={styles.field}>
            <label>Confirm new password</label>
            <input type="password" value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} required minLength={8} />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.btn} type="submit">Change password</button>
        </form>
      </div>
    </div>
  )
}
