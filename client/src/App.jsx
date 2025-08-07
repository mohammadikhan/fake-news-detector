import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Card from "./components/ui/Card"
import AnalysisForm from './components/AnalysisForm'
import Login from './components/Login'
import AuthLayout from './components/ui/AuthLayout'
import Register from './components/Register'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Login/>
      <Register/>
      <Header/>
      <AnalysisForm/>
    </>
  )
}

export default App
