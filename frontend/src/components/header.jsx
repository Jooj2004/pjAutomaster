import { NavLink } from 'react-router-dom';
import logoHeader from '../img/Logotipo.jpg';

const Header = () => {
  return (
    <header className="automaster-header">
      <div className="header-container">
        <div className="logo-container">
          <img src={logoHeader} alt="Logo AutoMaster" className="logo-img" />
          <span className="logo-text">AUTOMASTER</span>
        </div>
        <nav className="main-nav">
          <ul>
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => "nav-link" + (isActive ? " nav-active" : "")}
              >
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/sobre" 
                className={({ isActive }) => "nav-link" + (isActive ? " nav-active" : "")}
              >
                SOBRE NÓS
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/login" 
                className={({ isActive }) => "nav-link nav-button" + (isActive ? " nav-active" : "")}
              >
                ENTRAR
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
