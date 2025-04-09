// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import AdminPanel from './components/AdminPanel';
import AvatarDisplay from './components/AvatarDisplay';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/vencedores" element={<AvatarDisplay />} />
        <Route path="/" element={<LoginForm />} />
        <Route path="/admin" element={<AdminPanel />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
