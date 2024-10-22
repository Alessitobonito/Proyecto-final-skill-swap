import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import SkillList from './pages/SkillList';
import SkillForm from './pages/SkillForm';
import ProtectedRoute from './components/ProtectedRoute';
import PublicPage from './pages/WelcomePage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/app" element={<ProtectedRoute />}>
          <Route path="" element={<HomePage />} />
          <Route path="skills" element={<SkillList />} />
          <Route path="skills/new" element={<SkillForm />} />
          <Route path="skills/edit/:id" element={<SkillForm />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
