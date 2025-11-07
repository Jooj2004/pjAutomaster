import { Link } from 'react-router-dom';
import logoFooter from '../img/Logo.png';

const Footer = () => {
  return (
    <footer className="automaster-footer">
      <div className="footer-container">
        <div className="footer-column">
          <img src={logoFooter} alt="Logo AutoMaster" className="logo-img" />
        </div>
        <div className="footer-column">
          <nav className="footer-nav">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/sobre">Sobre Nós</Link></li>
              <li><Link to="/login">Entrar</Link></li>
              <li><Link to="/contato">Contatos</Link></li>
            </ul>
          </nav>
        </div>
        <div className="footer-column">
          <p className="copyright-text">Copyright &copy;2025 oficinaautomaster</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;