import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Home from './pages/home.jsx' // Your home component
import Game from './pages/game.jsx' // The page you want to redirect to
import "reflect-metadata"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  )
}

export default App