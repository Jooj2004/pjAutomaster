import { useContext } from 'react';
import {AuthContext} from "../../context/AuthContext";
import '../../css/dashboard.css'

export default function Dashboard() {
    const {user} = useContext(AuthContext);
    const perfil = user?.perfil //Para gerenciar entre cliente e funcionario

    return(
        <div>
            <h1>Página do Dashboard</h1>
            { perfil === 'funcionario' &&
                <div>
                    ...
                </div>
            }

            { perfil === 'cliente' &&
                <div>
                    ...
                </div>
            }
        </div>
    )
}