import { useState } from 'react'
import './App.css'

interface AnalysisResult {
  title: string
  links: Array<{
    text: string
    href: string
  }>
  buttons: Array<{
    text: string
  }>
  forms: Array<{
    inputs: number
  }>
}

function App() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!url) return
    
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setResults(data)
      }
    } catch (error) {
      setError('Failed to analyze website')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Website Analyzer</h1>
      
      <div className="input-group">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL (e.g., https://example.com)"
          className="url-input"
        />
        <button 
          onClick={handleAnalyze} 
          disabled={loading || !url}
          className="analyze-button"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {results && (
        <div className="results-container">
          <h2>Analysis Results for: {results.title}</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Links</h3>
              <p className="stat-number">{results.links.length}</p>
            </div>
            <div className="stat-card">
              <h3>Buttons</h3>
              <p className="stat-number">{results.buttons.length}</p>
            </div>
            <div className="stat-card">
              <h3>Forms</h3>
              <p className="stat-number">{results.forms.length}</p>
            </div>
          </div>

          {results.links.length > 0 && (
            <div className="links-section">
              <h3>Top Links Found:</h3>
              <ul>
                {results.links.slice(0, 5).map((link, index) => (
                  <li key={index}>
                    {link.text || 'Unnamed Link'} → {link.href}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App