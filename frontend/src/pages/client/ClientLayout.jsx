import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'
import styles from './client.module.css'

export default function ClientLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/client/login')
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/client" className={styles.brand}>
          RVG Client Portal
        </Link>
        <nav className={styles.nav}>
          <NavLink to="/client" end>My enquiries</NavLink>
          <a href="/contact">New enquiry</a>
          <a href="/">View site</a>
        </nav>
        <div className={styles.userBox}>
          <span>{user?.name}</span>
          <button type="button" onClick={handleLogout}>Log out</button>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>
          Developed by{' '}
          <a href="https://iremetech.com" target="_blank" rel="noreferrer">Ireme Tech</a>
        </p>
      </footer>
    </div>
  )
}
