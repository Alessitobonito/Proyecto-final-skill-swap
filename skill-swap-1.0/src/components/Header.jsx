import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { logout } = useAuth();
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl">Skill Swap</h1>
      <nav>
        <Link to="/app/skills" className="mr-4">Skills</Link>
        <button onClick={logout} className="mr-4">Logout</button>
      </nav>
    </header>
  );
};

export default Header;
