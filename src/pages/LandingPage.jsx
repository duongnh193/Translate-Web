import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const heroImageUrl =
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'

const features = [
  {
    title: 'Affordable Rates',
    description:
      'Transparent pricing that scales with your project size and language pair.',
    icon: '💰',
  },
  {
    title: 'Efficiency',
    description:
      'AI-assisted workflows keep delivery on schedule while humans coach final quality.',
    icon: '⚡',
  },
  {
    title: 'Human Quality',
    description:
      'A collective of native linguists covers every major industry and tone.',
    icon: '🤝',
  },
]

const contacts = [
  { label: 'Call Us', value: '+1 (234) 567 8900' },
  { label: 'Email', value: 'translation@email.com' },
  { label: 'Visit', value: '49 Arcadia Pl, Staten Island, NY' },
]

const footerLinks = [
  {
    title: 'Quick Links',
    links: ['About Us', 'Languages', 'Industries', 'Contacts'],
  },
  {
    title: 'Services',
    links: ['Premium Translation', 'Fast Translation', 'Interpretation', 'Proofreading'],
  },
  {
    title: 'Support',
    links: ['FAQ', 'Terms & Conditions', 'Privacy Policy', 'Help'],
  },
]

function LandingPage({ theme, onToggleTheme, onShowAuth }) {
  const { email, logout } = useAuth()
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/translate')
  }

  const handleLogin = () => {
    onShowAuth('login')
  }

  return (
    <div className="landing-page">
      <div className="hero-wrapper">
        <header className="site-header">
          <div className="brand">
          <span className="brand-mark">EGGS</span>
          <div>
            <p className="brand-title">EGGS Dev</p>
            <p className="brand-subtitle">Translation Automation</p>
          </div>
        </div>
          <nav className="nav-links">
            <a href="#home">About Us</a>
            <a href="#services">Services</a>
            <a href="#contact">Expertise</a>
            <a href="#footer">Contacts</a>
          </nav>
          <div className="header-actions">
          <button className="theme-switch" type="button" onClick={onToggleTheme}>
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
          {email ? (
            <>
              <span className="user-pill">{email}</span>
              <button className="ghost-btn" type="button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="ghost-btn" type="button" onClick={handleLogin}>
                Login
              </button>
              <button className="ghost-btn" type="button" onClick={() => onShowAuth('register')}>
                Register
              </button>
            </>
          )}
          <button className="primary-btn" type="button" onClick={handleStart}>
            {email ? 'Continue Translating' : 'Start Translating'}
          </button>
          </div>
        </header>

        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="tagline">Welcome to EGGS Dev</p>
            <h1>Translation Automation</h1>
            <p className="lead">
              Our translation services include over <span className="accent">200</span> languages
              with transparent pricing, dedicated project managers, and native linguists.
            </p>
            <div className="hero-actions">
              <button className="primary-btn" type="button" onClick={handleStart}>
                {email ? 'Go to Workspace' : 'Start Translating'}
              </button>
            <button className="ghost-btn" type="button">
                Book a Call
              </button>
            </div>
            <div className="stats-grid">
              <div>
                <p className="stat-value">200+</p>
                <p className="stat-label">Languages</p>
              </div>
              <div>
                <p className="stat-value">500+</p>
                <p className="stat-label">Certified linguists</p>
              </div>
              <div>
                <p className="stat-value">24/7</p>
                <p className="stat-label">Support</p>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <img src={heroImageUrl} alt="Translator" />
            <div className="floating-badge">
              <span role="img" aria-hidden="true">
                🌎
              </span>
              <p>200+ language pairs</p>
            </div>
            <div className="floating-card">
              <p>Rated 4.9/5 by enterprises</p>
            </div>
          </div>
        </section>
      </div>

      <main>
        <section className="magenta-band">
          <div className="band-copy">
            <h3>
              Need a Document or Text <span className="accent">to Be Translated?</span>
            </h3>
            <p>Hire our experts to get the translation done right on time.</p>
          </div>
          <button className="secondary-btn" type="button" onClick={handleStart}>
            Contact Us
          </button>
        </section>

        <section className="services-stack" id="services">
          <div className="features-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <span className="feature-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>

          <section className="contact-panel" id="contact">
            <div>
              <p className="tagline">Contacts</p>
              <h2>Want to Order Our Services?</h2>
              <p>
                Feel free to contact us in any convenient way. Our experts will study your files,
                send a quote, and keep you in the loop at every milestone.
              </p>
              <button className="ghost-btn" type="button">
                Call Me Back
              </button>
            </div>
            <div className="contact-details">
              {contacts.map((contact) => (
                <div className="contact-card" key={contact.label}>
                  <p className="label">{contact.label}</p>
                  <p className="value">{contact.value}</p>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>

      <footer className="footer" id="footer">
        <div className="footer-columns">
          <div>
            <div className="brand">
              <span className="brand-mark">EGGS</span>
              <div>
                <p className="brand-title">EGGS Dev</p>
                <p className="brand-subtitle">Translation Automation</p>
              </div>
            </div>
            <p className="footer-text">
              We are a translation and interpretation agency with more than 500 experienced
              translators and 200+ languages.
            </p>
            <div className="social-links">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                <span className="social-icon">𝕏</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <span className="social-icon">f</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <span className="social-icon">⌾</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                <span className="social-icon">▶</span>
              </a>
            </div>
          </div>
          {footerLinks.map((column) => (
            <div className="footer-column" key={column.title}>
              <h4>{column.title}</h4>
              {column.links.map((link) => (
                <a href="#" key={link}>
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
        <p className="footer-note">© {new Date().getFullYear()} EGGS Dev. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default LandingPage
