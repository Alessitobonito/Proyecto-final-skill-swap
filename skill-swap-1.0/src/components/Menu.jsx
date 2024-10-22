import { Link } from 'react-router-dom';

const Menu = () => (
  <aside className="w-64 bg-gray-100 h-full p-4">
    <ul>
      <li><Link to="/app/skills" className="block py-2">Skill List</Link></li>
      <li><Link to="/app/skills/new" className="block py-2">Add Skill</Link></li>
    </ul>
  </aside>
);

export default Menu;
