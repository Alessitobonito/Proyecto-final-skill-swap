import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Menu from '../components/Menu';

const PrivateLayout = () => (
  <div className="flex h-screen">
    <Menu />
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  </div>
);

export default PrivateLayout;
