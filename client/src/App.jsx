import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage      from './components/LandingPage'
import Login            from './components/Login'
import Register         from './components/Register'
import VerifyEmail      from './components/VerifyEmail'
import AnalysisForm     from './components/AnalysisForm'
// import Dashboard        from './components/Dashboard' // TODO: Roll out Dashboard in future update
import AnalysisHistory  from './components/AnalysisHistory'
import FeedbackHistory  from './components/FeedbackHistory'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute   from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Routes>
        <Route path="/"                element={<LandingPage />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/verify"          element={<VerifyEmail />} />
        {/* <Route path="/dashboard"        element={<Dashboard />} /> */}
        <Route path="/analyze"          element={<ProtectedRoute><AnalysisForm /></ProtectedRoute>} />
        <Route path="/history"          element={<ProtectedRoute><AnalysisHistory /></ProtectedRoute>} />
        <Route path="/feedback-history" element={<ProtectedRoute><FeedbackHistory /></ProtectedRoute>} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
