import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../lib/api.js'

const languages = [
  { label: 'Afrikaans', value: 'af' },
  { label: 'Albanian', value: 'sq' },
  { label: 'Amharic', value: 'am' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Armenian', value: 'hy' },
  { label: 'Azerbaijani', value: 'az' },
  { label: 'Basque', value: 'eu' },
  { label: 'Belarusian', value: 'be' },
  { label: 'Bengali', value: 'bn' },
  { label: 'Bosnian', value: 'bs' },
  { label: 'Bulgarian', value: 'bg' },
  { label: 'Catalan', value: 'ca' },
  { label: 'Cebuano', value: 'ceb' },
  { label: 'Chinese (Simplified)', value: 'zh-CN' },
  { label: 'Chinese (Traditional)', value: 'zh-TW' },
  { label: 'Croatian', value: 'hr' },
  { label: 'Czech', value: 'cs' },
  { label: 'Danish', value: 'da' },
  { label: 'Dutch', value: 'nl' },
  { label: 'English', value: 'en' },
  { label: 'Esperanto', value: 'eo' },
  { label: 'Estonian', value: 'et' },
  { label: 'Filipino', value: 'fil' },
  { label: 'Finnish', value: 'fi' },
  { label: 'French', value: 'fr' },
  { label: 'Galician', value: 'gl' },
  { label: 'Georgian', value: 'ka' },
  { label: 'German', value: 'de' },
  { label: 'Greek', value: 'el' },
  { label: 'Gujarati', value: 'gu' },
  { label: 'Haitian Creole', value: 'ht' },
  { label: 'Hebrew', value: 'he' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Hungarian', value: 'hu' },
  { label: 'Icelandic', value: 'is' },
  { label: 'Indonesian', value: 'id' },
  { label: 'Irish', value: 'ga' },
  { label: 'Italian', value: 'it' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Javanese', value: 'jv' },
  { label: 'Kannada', value: 'kn' },
  { label: 'Kazakh', value: 'kk' },
  { label: 'Khmer', value: 'km' },
  { label: 'Korean', value: 'ko' },
  { label: 'Kurdish', value: 'ku' },
  { label: 'Lao', value: 'lo' },
  { label: 'Latvian', value: 'lv' },
  { label: 'Lithuanian', value: 'lt' },
  { label: 'Macedonian', value: 'mk' },
  { label: 'Malay', value: 'ms' },
  { label: 'Malayalam', value: 'ml' },
  { label: 'Maltese', value: 'mt' },
  { label: 'Māori', value: 'mi' },
  { label: 'Marathi', value: 'mr' },
  { label: 'Mongolian', value: 'mn' },
  { label: 'Nepali', value: 'ne' },
  { label: 'Norwegian', value: 'no' },
  { label: 'Persian', value: 'fa' },
  { label: 'Polish', value: 'pl' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Punjabi', value: 'pa' },
  { label: 'Romanian', value: 'ro' },
  { label: 'Russian', value: 'ru' },
  { label: 'Serbian', value: 'sr' },
  { label: 'Sinhala', value: 'si' },
  { label: 'Slovak', value: 'sk' },
  { label: 'Slovenian', value: 'sl' },
  { label: 'Spanish', value: 'es' },
  { label: 'Swahili', value: 'sw' },
  { label: 'Swedish', value: 'sv' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Telugu', value: 'te' },
  { label: 'Thai', value: 'th' },
  { label: 'Turkish', value: 'tr' },
  { label: 'Ukrainian', value: 'uk' },
  { label: 'Urdu', value: 'ur' },
  { label: 'Uzbek', value: 'uz' },
  { label: 'Vietnamese', value: 'vi' },
  { label: 'Welsh', value: 'cy' },
  { label: 'Xhosa', value: 'xh' },
  { label: 'Yiddish', value: 'yi' },
  { label: 'Yoruba', value: 'yo' },
  { label: 'Zulu', value: 'zu' },
]

const tones = ['neutral', 'formal', 'casual']
const domains = ['general', 'marketing', 'it', 'legal', 'finance', 'medical', 'gaming', 'travel']

function TranslateDashboard({ theme, onToggleTheme, onShowAuth }) {
  const { token, email, logout } = useAuth()
  const navigate = useNavigate()
  const [inputText, setInputText] = useState('')
  const [sourceLanguage, setSourceLanguage] = useState('en')
  const [targetLanguage, setTargetLanguage] = useState('es')
  const [tone, setTone] = useState('neutral')
  const [domain, setDomain] = useState('general')
  const [presetId, setPresetId] = useState('')
  const [outputText, setOutputText] = useState('Your translation will appear here.')
  const [history, setHistory] = useState([])
  const [presets, setPresets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastMeta, setLastMeta] = useState(null)
  const [sourceSearch, setSourceSearch] = useState(getLanguageLabel('en'))
  const [targetSearch, setTargetSearch] = useState(getLanguageLabel('es'))
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false)
  const [targetDropdownOpen, setTargetDropdownOpen] = useState(false)
  const [sourceHighlight, setSourceHighlight] = useState(0)
  const [targetHighlight, setTargetHighlight] = useState(0)
  const isAuthenticated = Boolean(token)

  useEffect(() => {
    api
      .presets()
      .then(setPresets)
      .catch(() => setPresets([]))
  }, [])

  useEffect(() => {
    if (!token) {
      setHistory([])
      return
    }
    api
      .history(token)
      .then((response) => setHistory(response.items))
      .catch(() => setHistory([]))
  }, [token])

  useEffect(() => {
    setSourceSearch(getLanguageLabel(sourceLanguage))
  }, [sourceLanguage])

  useEffect(() => {
    setTargetSearch(getLanguageLabel(targetLanguage))
  }, [targetLanguage])

  const filteredSourceLanguages = useMemo(
    () => filterLanguages(sourceSearch),
    [sourceSearch],
  )

  const filteredTargetLanguages = useMemo(
    () => filterLanguages(targetSearch),
    [targetSearch],
  )

  const handleTranslate = async () => {
    const trimmed = inputText.trim()
    if (!trimmed) {
      setOutputText('Please enter text to translate.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const payload = {
        sourceText: trimmed,
        srcLang: sourceLanguage,
        tgtLang: targetLanguage,
        tone,
        domain,
        presetId: presetId ? Number(presetId) : null,
      }
      const response = await api.translate(payload, token)
      setOutputText(response.translatedText)
      setLastMeta({ model: response.model, time: response.latencyMs })
      if (token) {
        const remoteHistory = await api.history(token)
        setHistory(remoteHistory.items)
      } else {
        setHistory([])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLanguageKeyDown = (event, type, list, highlightIndex, setHighlight) => {
    if (!list.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlight((highlightIndex + 1) % list.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlight((highlightIndex - 1 + list.length) % list.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const selected = list[highlightIndex]
      if (selected) {
        handleLanguageSelect(type, selected.label)
      }
    }
  }

  const handleClear = () => {
    setInputText('')
    setOutputText('Your translation will appear here.')
    setLastMeta(null)
  }

  const resetSession = () => {
    setInputText('')
    setOutputText('Your translation will appear here.')
    setLastMeta(null)
    setHistory([])
    setError('')
    setPresetId('')
    setTone('neutral')
    setDomain('general')
    setSourceLanguage('en')
    setTargetLanguage('es')
  }

  const handleLogout = () => {
    resetSession()
    logout()
    navigate('/', { replace: true })
  }

 const handleLanguageInput = (type, value) => {
   if (type === 'source') {
     setSourceSearch(value)
     setSourceDropdownOpen(true)
      setSourceHighlight(0)
   } else {
     setTargetSearch(value)
     setTargetDropdownOpen(true)
      setTargetHighlight(0)
   }
 }

  const handleLanguageSelect = (type, value) => {
    const match = findLanguageMatch(value)
    if (match) {
      if (type === 'source') {
        setSourceLanguage(match.value)
        setSourceSearch(match.label)
        setSourceDropdownOpen(false)
      } else {
        setTargetLanguage(match.value)
        setTargetSearch(match.label)
        setTargetDropdownOpen(false)
      }
    }
  }

 const handleDropdownFocus = (type) => {
   if (type === 'source') {
     setSourceDropdownOpen(true)
     setSourceSearch('')
      setSourceHighlight(0)
   } else {
     setTargetDropdownOpen(true)
     setTargetSearch('')
      setTargetHighlight(0)
   }
 }

  const handleDropdownBlur = (type, event) => {
    if (event.currentTarget.contains(event.relatedTarget)) return
  if (type === 'source') {
    setSourceDropdownOpen(false)
    setSourceHighlight(0)
    if (!sourceSearch.trim()) {
      setSourceSearch(getLanguageLabel(sourceLanguage))
    }
  } else {
    setTargetDropdownOpen(false)
    setTargetHighlight(0)
    if (!targetSearch.trim()) {
      setTargetSearch(getLanguageLabel(targetLanguage))
    }
  }
  }

  return (
    <>
      <div className="translate-shell">
      <header className="translate-header">
        <div className="brand">
          <span className="brand-mark">ABC</span>
          <div>
            <p className="brand-title">Translation Desk</p>
            <p className="brand-subtitle">Secure Workspace</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="theme-switch" type="button" onClick={onToggleTheme}>
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
          {isAuthenticated ? (
            <>
              {email && <span className="user-pill">{email}</span>}
              <button className="ghost-btn" type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="ghost-btn" type="button" onClick={() => onShowAuth('login')}>
              Login
            </button>
          )}
        </div>
      </header>

      <div className="translate-layout">
        <section className="workspace">
          <article className="panel">
            <div className="panel-head">
              <div>
                <p className="panel-title">Source Text</p>
                <p className="panel-subtitle">Paste or write the paragraph you want translated.</p>
              </div>
            <div className="language-row">
              <div
                className="language-field"
                onFocus={() => handleDropdownFocus('source')}
                onBlur={(event) => handleDropdownBlur('source', event)}
              >
                <label htmlFor="source-language">From</label>
                <input
                  id="source-language"
                  className="language-input"
                  autoComplete="off"
                  value={sourceSearch}
                  onChange={(event) => handleLanguageInput('source', event.target.value)}
                  onKeyDown={(event) =>
                    handleLanguageKeyDown(event, 'source', filteredSourceLanguages, sourceHighlight, setSourceHighlight)
                  }
                  placeholder="Type a language"
                />
                {sourceDropdownOpen && (
                  <div className="language-options">
                    {filteredSourceLanguages.map((lang, index) => (
                      <button
                        type="button"
                        className={`language-option ${sourceHighlight === index ? 'active' : ''}`}
                        key={lang.value}
                        onMouseDown={(event) => {
                          event.preventDefault()
                          handleLanguageSelect('source', lang.label)
                        }}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div
                className="language-field"
                onFocus={() => handleDropdownFocus('target')}
                onBlur={(event) => handleDropdownBlur('target', event)}
              >
                <label htmlFor="target-language">To</label>
                <input
                  id="target-language"
                  className="language-input"
                  autoComplete="off"
                  value={targetSearch}
                  onChange={(event) => handleLanguageInput('target', event.target.value)}
                  onKeyDown={(event) =>
                    handleLanguageKeyDown(event, 'target', filteredTargetLanguages, targetHighlight, setTargetHighlight)
                  }
                  placeholder="Type a language"
                />
                {targetDropdownOpen && (
                  <div className="language-options">
                    {filteredTargetLanguages.map((lang, index) => (
                      <button
                        type="button"
                        className={`language-option ${targetHighlight === index ? 'active' : ''}`}
                        key={lang.value}
                        onMouseDown={(event) => {
                          event.preventDefault()
                          handleLanguageSelect('target', lang.label)
                        }}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            </div>
            <textarea
              className="text-area"
              placeholder="Describe the document or paste any text..."
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
            />
            <div className="inline-fields">
              <label>
                Tone
                <select className="pill-select" value={tone} onChange={(event) => setTone(event.target.value)}>
                  {tones.map((toneOption) => (
                    <option key={toneOption} value={toneOption}>
                      {toneOption}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Domain
                <select
                  className="pill-select"
                  value={domain}
                  onChange={(event) => setDomain(event.target.value)}
                >
                  {domains.map((domainOption) => (
                    <option key={domainOption} value={domainOption}>
                      {domainOption}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Preset
                <select
                  className="pill-select"
                  value={presetId}
                  onChange={(event) => setPresetId(event.target.value)}
                >
                  <option value="">Manual</option>
                  {presets.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="action-row">
              <button className="ghost-btn" type="button" onClick={handleClear}>
                Clear
              </button>
              <button className="primary-btn" type="button" onClick={handleTranslate} disabled={loading}>
                {loading ? 'Translating…' : 'Translate'}
              </button>
            </div>
            {error && <p className="error-text">{error}</p>}
          </article>

          <article className="panel">
            <div>
              <p className="panel-title">Translation Output</p>
              <p className="panel-subtitle">
                The AI preview is shown below. Human linguists finalize every delivery.
              </p>
            </div>
            <textarea className="text-area output" value={outputText} readOnly />
            {lastMeta && (
              <p className="panel-subtitle">
                Generated by {lastMeta.model} in {lastMeta.time}ms
              </p>
            )}
          </article>
        </section>

        <aside className="history-panel">
          <h3>History</h3>
          <div className="history-list">
            {isAuthenticated ? (
              history.length ? (
                history.map((entry) => (
                  <div className="history-item" key={entry.id}>
                    <p className="history-source" title={entry.sourceText}>
                      [{entry.srcLang?.toUpperCase()}] {entry.sourceText}
                    </p>
                  </div>
                ))
              ) : (
                <p className="panel-subtitle">No translations yet.</p>
              )
            ) : (
              <p className="panel-subtitle">Login to view translation history.</p>
            )}
          </div>
          {isAuthenticated ? (
            <button className="logout-btn" type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="logout-btn" type="button" onClick={() => onShowAuth('login')}>
              Login to Save History
            </button>
          )}
        </aside>
      </div>
      </div>
    </>
  )
}

function getLanguageLabel(code) {
  return languages.find((lang) => lang.value === code)?.label ?? code
}

function filterLanguages(term) {
  const normalized = term.trim().toLowerCase()
  if (!normalized) {
    return languages
  }
  return languages.filter((lang) => lang.label.toLowerCase().startsWith(normalized))
}

function findLanguageMatch(rawValue) {
  if (!rawValue) return null
  const value = rawValue.toLowerCase().trim()
  return (
    languages.find((lang) => lang.label.toLowerCase() === value) ||
    languages.find((lang) => lang.label.toLowerCase().startsWith(value)) ||
    languages.find((lang) => lang.value.toLowerCase() === value)
  )
}

export default TranslateDashboard
