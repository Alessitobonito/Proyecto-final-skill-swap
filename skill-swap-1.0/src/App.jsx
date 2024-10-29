/* TODO: 
Agregar un perfil de usuario.
Añadir la capacidad de mandar mensajes a otros usuarios y todo el display para verlos.

Implementa una página donde los usuarios puedan ver y editar su información personal.
Implementar búsqueda y filtrado en el listado de habilidades.

Permite a los usuarios buscar habilidades específicas o filtrar por categorías.
Incluir un sistema de comentarios o valoraciones.

Permite a los usuarios dejar comentarios o valoraciones sobre las habilidades que han aprendido o enseñado.
Despliegue en Firebase.

Una vez que hayas terminado, asegúrate de que la aplicación esté lista para ser desplegada en Firebase. Configura el hosting de Firebase y asegúrate de que todo funcione correctamente en producción.
Documentación del proyecto.

Crea un archivo README.md que explique cómo instalar, ejecutar y usar tu aplicación. Incluye capturas de pantalla y ejemplos de uso.
Página de detalles de habilidad
Perfil de usuario
Configuraciones de la cuenta
Sistema de búsqueda y filtrado
Sistema de calificaciones y reseñas
Integración de redes sociales
Notificaciones
Sistema de mensajería
Funcionalidad de emparejamiento
Analíticas y métricas
Página de administración
*/
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

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/app" element={<ProtectedRoute />}>
          <Route path="" element={<HomePage />} />
          <Route path="skills" element={<SkillList />} />
          <Route path="skills/new" element={<SkillForm />} />
          <Route path="skills/edit/:id" element={<SkillForm />} />
          <Route path="skills/:id" element={<SkillDetails />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;