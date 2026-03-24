import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import './Dashboard.css'            // ⬅️ page-specific styles

const FILES = {
  raw: 'https://raw.githubusercontent.com/yadavdeepak01/Alarms_React_App/main/public/data/raw-alarms.xlsx',
  configured: 'https://raw.githubusercontent.com/yadavdeepak01/Alarms_React_App/main/public/data/configured-alarms.xlsx',
};

export default function Dashboard() {
  const navigate = useNavigate()

  const [active, setActive] = useState('raw')   // 'raw' | 'configured'
  const [rows, setRows] = useState([])
  const [cols, setCols] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load Excel based on active tab
  useEffect(() => {
    let cancelled = false

    async function loadWorkbook(url) {
      setLoading(true); setError('')
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status} while loading ${url}`)

        const ab = await res.arrayBuffer()
        const wb = XLSX.read(ab, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(ws, { defval: '', raw: true })

        if (!cancelled) {
          setRows(data)
          setCols(data.length ? Object.keys(data[0]) : [])
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || 'Failed to read Excel file')
          setRows([]); setCols([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadWorkbook(FILES[active])
    return () => { cancelled = true }
  }, [active])

  // 🔒 Logout handler
  const handleLogout = () => {
    localStorage.removeItem('auth')
    navigate('/login', { replace: true })
  }

  return (
    <div className="dash-page">
      {/* Top bar with heading on left & logout on right */}
      <div className="dash-topbar">
        <h1 className="dash-title"><u>Alarm Statistics</u></h1>

        <div className="dash-actions">
          {/* tabs */}
          <div className="dash-tabs">
            <button
              className={`tab-btn ${active === 'raw' ? 'active' : ''}`}
              onClick={() => setActive('raw')}
            >
              Raw Alarms
            </button>
            <button
              className={`tab-btn ${active === 'configured' ? 'active' : ''}`}
              onClick={() => setActive('configured')}
            >
              Configured Alarms
            </button>
          </div>

          {/* logout at the extreme right */}
          <button className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      {loading && <p className="muted">Loading…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                {cols.map((c) => <th key={c}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  {cols.map((c) => <td key={c}>{String(r[c] ?? '')}</td>)}
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && (
            <div className="muted" style={{ padding: 16 }}>
              No rows found in the first sheet.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
