import { Routes , BrowserRouter, Route } from 'react-router-dom'
import Login from './components/auth/login'
import SignUp from './components/auth/SignUp'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
