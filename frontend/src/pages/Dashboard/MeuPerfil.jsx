import { useContext, useState } from "react";
import {AuthContext} from "../../context/AuthContext"
import "../../css/ProfilePage.css";
import { FormClient } from "../../components/perfil/form-client";
import { FormVeiculo } from "../../components/perfil/form-veiculo";
import { FormFuncionario } from "../../components/perfil/form-funcionario";
import { ClientesList } from "../../components/perfil/clientes-list";

export default function MeuPerfil() {
  const [page, setPage] = useState(1)
  const [disable, setDisable] = useState(true)

  const {user} = useContext(AuthContext);
  const perfil = user?.perfil //Para gerenciar entre cliente e funcionario

  return (
    <div>

      {perfil === 'funcionario' &&
        <main>
          <h1>Clientes</h1>
          <div>
            <div className="perfil-menu">
              <h4 className={page === 1 ? "active" : ""} onClick={()=>setPage(1)}>Clientes</h4>
              <h4 className={page === 2 ? "active" : ""} onClick={()=>setPage(2)}>Meu perfil</h4>
            </div>

            {page === 1 &&
              <div>
                <ClientesList/>
              </div>
            }

            {page === 2 &&
              <div className="perfil-main">
                <div>
                  <h3>Dados Cadastrais</h3>
                  {disable === true &&
                    <button onClick={()=> setDisable(false)}>Editar</button>
                  }
                </div>
                <div>
                  <FormFuncionario disable={disable} setDisable={setDisable}/>
                </div>
              </div>
            }
          </div>
        </main>
      }

      { perfil === 'cliente' &&
        <main>
          <h1>Meu Perfil</h1>
          <div>
            <div className="perfil-menu">
              <h4 className={page === 1 ? "active" : ""} onClick={()=>setPage(1)}>Perfil</h4>
              <h4 className={page === 2 ? "active" : ""} onClick={()=>setPage(2)}>Veículos</h4>
            </div>

            {page === 1 &&
              <div className="perfil-main">
                <div>
                  <h3>Dados Cadastrais</h3>
                  {disable === true &&
                    <button onClick={()=> setDisable(false)}>Editar</button>
                  }
                </div>
                <div>
                  <FormClient disable={disable} setDisable={setDisable}/>
                </div>
              </div>
            }

            {page === 2 &&
              <div className="perfil-main">
                <div>
                  <h3>Dados Cadastrais</h3>
                  {disable === true &&
                    <button onClick={()=> setDisable(false)}>Editar</button>
                  }
                </div>
                <div>
                  <FormVeiculo disable={disable} setDisable={setDisable}/>
                </div>
              </div>
            }

          </div>
        </main>
      }
    </div>
  );
}