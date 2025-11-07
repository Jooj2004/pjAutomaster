import { Outlet } from 'react-router-dom';
import '../css/dashboard.css'
import Navbar from '../components/dashboard/navbar';
import Sidebar from '../components/dashboard/sidebar';

export default function DashboardLayout () {
    return (
        <div className="dashboard-container">
            <aside className='sidebarDesh'>
                <Sidebar />
            </aside>

            <main className="dashboard-content">
                <Navbar />
                <Outlet />
            </main>
        </div>
  );
}