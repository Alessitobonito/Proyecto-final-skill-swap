import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import SkillList from './pages/SkillList';
import SkillForm from './pages/SkillForm';
import ProtectedRoute from './components/ProtectedRoute';
import WelcomePage from './pages/WelcomePage';
import Layout from './components/Layout';
import SkillDetails from './pages/SkillDetails';
import UserProfile from './pages/UserProfile';
import FindSkills from './pages/FindSkills';
import PublicUserProfile from './pages/PublicUserProfile';
import ChatList from './components/ChatList';
import ChatRoom from './components/ChatRoom';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/app" element={<ProtectedRoute />}>
          <Route index element={<HomePage />} />
          <Route path="skills" element={<SkillList />} />
          <Route path="find-skills" element={<FindSkills />} />
          <Route path="skills/new" element={<SkillForm />} />
          <Route path="skills/edit/:id" element={<SkillForm />} />
          <Route path="skills/:id" element={<SkillDetails />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="user/:userId" element={<PublicUserProfile />} />
          <Route path="chats" element={<ChatList />} />
          <Route path="chat/:recipientId/:recipientName" element={<ChatRoom />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;
/*Página de detalles de habilidad X
Perfil de usuario X
Configuraciones de la cuenta
Sistema de búsqueda y filtrado X
Sistema de calificaciones y reseñas 
Integración de redes sociales
Notificaciones
Sistema de mensajería X
Funcionalidad de emparejamiento
Analíticas y métricas
Página de administración*/