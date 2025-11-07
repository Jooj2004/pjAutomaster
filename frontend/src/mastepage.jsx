import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import { Outlet } from "react-router-dom";

// Onde os estilos serão aplicados globalmente
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css'; 

const MasterPage = () => {
  return (
    <div>
      <Header />
      <div className="separator-line"></div>
      <main className="main-content">
        <Outlet />
      </main>
      <div className="separator-line"></div>
      <Footer />
    </div>
  );
};

export default MasterPage;
