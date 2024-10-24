// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import SkillList from './pages/SkillList';
import SkillForm from './pages/SkillForm';
import ProtectedRoute from './components/ProtectedRoute';
import PublicPage from './pages/WelcomePage';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
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
    </Layout>
  );
}

export default App;