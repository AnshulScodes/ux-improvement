import { useState } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')

  const handleAnalyze = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health')
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="container">
      <h1>UX Optimizer</h1>
      <div className="input-group">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL"
        />
        <button onClick={handleAnalyze}>Analyze</button>
      </div>
    </div>
  )
}

export default App