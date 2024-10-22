import { Link } from 'react-router-dom';

const Home = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="text-center">
      <h1 className="text-4xl mb-4">Welcome to Skill Swap</h1>
      <p className="mb-4">Exchange skills with people around the world.</p>
      <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Register</Link>
      <Link to="/login" className="bg-gray-600 text-white px-4 py-2 rounded">Login</Link>
    </div>
  </div>
);

export default Home;
