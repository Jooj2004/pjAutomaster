import { NavLink } from "react-router-dom";
import { MdDashboard, MdEvent, MdAssignment, MdPerson, MdHistory, MdPeople } from "react-icons/md";
import "../../css/Sidebar.css";
import { useContext } from "react";
import {AuthContext} from "../../context/AuthContext"

export default function Sidebar() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // ou um spinner de carregamento

  const perfil = user?.perfil;

  return (
    <div className="sidebar">
      <ul>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
            <MdDashboard /> Painel de Controle
          </NavLink>
        </li>
        <li>
          <NavLink to="/agenda" className={({ isActive }) => isActive ? "active" : ""}>
            <MdEvent /> Agenda
          </NavLink>
        </li>
        <li>
          <NavLink to="/ordens" className={({ isActive }) => isActive ? "active" : ""}>
            <MdAssignment /> Ordens de Serviço
          </NavLink>
        </li>
        {perfil === 'cliente' && (
          <li>
            <NavLink to="/perfil" className={({ isActive }) => isActive ? "active" : ""}>
              <MdPerson /> Meu Perfil
            </NavLink>
          </li>
        )}
        {perfil === 'funcionario' && (
          <li>
            <NavLink to="/perfil" className={({ isActive }) => isActive ? "active" : ""}>
              <MdPeople /> Clientes
            </NavLink>
          </li>
        )}
        <li>
          <NavLink to="/history" className={({ isActive }) => isActive ? "active" : ""}>
            <MdHistory /> Histórico de Serviços
          </NavLink>
        </li>
      </ul>
    </div>
  );
}