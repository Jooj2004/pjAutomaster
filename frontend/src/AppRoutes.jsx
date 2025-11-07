import { Route, Routes } from "react-router-dom";
import App from "./App"
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import MeuPerfil from "./pages/Dashboard/MeuPerfil";
import Historico from "./pages/Dashboard/Historico";
import Agenda from "./pages/Dashboard/Agenda";
import SobreNos from "./pages/Automaster/Sobre";
import MasterPage from "./mastepage";
import Contato from "./pages/Automaster/Contato";
import Login from "./pages/Automaster/Login";
import Registro from "./pages/Automaster/Registro";
import PrivateRoute from './PrivateRoute'
import OrdemServico from "./pages/Dashboard/OrdemServico";

export default function AppRoutes() {
    return(
        <Routes>
            <Route path="/" element={<MasterPage />}>
                <Route index element={<App />} />
                <Route path="sobre" element={<SobreNos />} />
                <Route path="contato" element={<Contato/>} />
            </Route>
            <Route path="registro" element={<Registro/>} />
            <Route path="login" element={<Login/>} />

            <Route 
                element={
                    <PrivateRoute>
                        <DashboardLayout/>
                    </PrivateRoute>
                }
            >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="perfil" element={<MeuPerfil />} />
                <Route path="history" element={<Historico />} />
                <Route path="agenda" element={<Agenda />} />
                <Route path="ordens" element={<OrdemServico />} />
            </Route>
        </Routes>
    )
}