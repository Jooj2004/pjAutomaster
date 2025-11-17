import "../../css/Agenda.css"
import { useContext } from "react";
import {AuthContext} from "../../context/AuthContext"
import {ListarAgendamentosCliente} from "../../components/agenda/listar-agendamento-cliente"
import { GestaoAgendaFuncionario } from "../../components/agenda/GestaoAgendaFuncionario";

export default function Agenda () {
    const {user} = useContext(AuthContext);

    const perfil = user?.perfil //Para gerenciar entre cliente e funcionario


    return(
        <main>
            <div>
            { perfil === 'funcionario' &&
                <div>
                    <GestaoAgendaFuncionario />
                </div>
            }

            { perfil === 'cliente' &&
                <div>
                    <h1>Agendamento de Serviço</h1>
                    <ListarAgendamentosCliente />
                </div>
            }
            </div>
        </main>
    )
}