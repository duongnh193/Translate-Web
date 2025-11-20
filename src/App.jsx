import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import TranslateDashboard from './pages/TranslateDashboard.jsx'
import AuthModal from './components/AuthModal.jsx'

function App() {
  const [theme, setTheme] = useState('light')
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const openAuthModal = (mode = 'login') => setAuthModal({ open: true, mode })
  const closeAuthModal = () => setAuthModal((prev) => ({ ...prev, open: false }))
  const switchMode = () =>
    setAuthModal((prev) => ({ open: true, mode: prev.mode === 'login' ? 'register' : 'login' }))

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              theme={theme}
              onToggleTheme={toggleTheme}
              onShowAuth={openAuthModal}
            />
          }
        />
        <Route
          path="/translate"
          element={
            <TranslateDashboard
              theme={theme}
              onToggleTheme={toggleTheme}
              onShowAuth={openAuthModal}
            />
          }
        />
      </Routes>
      <AuthModal
        isOpen={authModal.open}
        mode={authModal.mode}
        onClose={closeAuthModal}
        onSwitchMode={switchMode}
      />
    </BrowserRouter>
  )
}

export default App
