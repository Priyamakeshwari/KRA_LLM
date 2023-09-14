import { Routes , BrowserRouter, Route } from 'react-router-dom'
import Login from './components/auth/login'
import SignUp from './components/auth/SignUp'
import Chat from './components/chat/Chat'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path='/chat' element={<Chat/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
