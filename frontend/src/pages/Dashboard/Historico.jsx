import { useContext } from "react";
import {AuthContext} from "../../context/AuthContext";
import { TableCliente } from "../../components/historico/table-cliente";
import { TableFunc } from "../../components/historico/table-funcionario";
import "../../css/Historico.css";

export default function Historico () {
    const {user} = useContext(AuthContext);

    const perfil = user?.perfil //Para gerenciar entre cliente e funcionario


    return(
        <main>
            <h1>Histórico de Serviço</h1>

            <div>
            { perfil === 'funcionario' &&
                <TableFunc user={user}/>
            }

            { perfil === 'cliente' &&
                <TableCliente user={user} />
            }
            </div>

        </main>
    )
}