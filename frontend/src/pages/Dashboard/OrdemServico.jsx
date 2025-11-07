import { useContext } from 'react';
import {AuthContext} from "../../context/AuthContext";
import '../../css/OrdemServico.css'
import ListaOrdemServico from '../../components/ordemservico/OrdemServicoPage';
import ListarOrdemServicoCliente from '../../components/ordemservico/ListarOrdemServicoCliente';

export default function OrdemServico() {
    const {user} = useContext(AuthContext);
    const perfil = user?.perfil //Para gerenciar entre cliente e funcionario

    return(
        <div>
            <h1>Página da Ordem de Serviço</h1>
            { perfil === 'funcionario' &&
                <div>
                    <ListaOrdemServico/>
                </div>
            }

            { perfil === 'cliente' &&
                <div>
                    <ListarOrdemServicoCliente/>
                </div>
            }
        </div>
    )
}