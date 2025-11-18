import LynqLanding from './LynqLanding.jsx'

import { useState } from 'react'
import DataPreviewPage from './pages/DataPreviewPage.jsx'

export default function App() {
  const [view, setView] = useState('landing')
  const [fileMeta, setFileMeta] = useState(null)
  return view === 'landing'
    ? <LynqLanding onStart={() => setView('preview')} />
    : <DataPreviewPage fileMeta={fileMeta} onBack={() => setView('landing')} />
}

