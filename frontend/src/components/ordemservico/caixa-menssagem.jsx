import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const CaixaMensagens = ({ osId }) => {
  const { user } = useContext(AuthContext); // Só precisa do user
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const mensagensFimRef = useRef(null);

  const API_BASE_URL = 'http://localhost:3001';

  // Carregar mensagens
  useEffect(() => {
    if (user) {
      carregarMensagens();
      
      const interval = setInterval(() => {
        carregarMensagens();
      }, 120000);

      return () => clearInterval(interval);
    }
  }, [osId, user]);

  // Rolagem automática
  useEffect(() => {
    rolarParaBaixo();
  }, [mensagens]);

  const carregarMensagens = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/mensagens/os/${osId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    setMensagens(data);
    setErro('');
  } catch (error) {
    setErro(`Erro ao carregar mensagens: ${error.message}`);
  }
};

  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!novaMensagem.trim() || !user) return;

    try {
      setCarregando(true);
      
      const mensagemData = {
        ordemServico_id: parseInt(osId),
        conteudo: novaMensagem.trim(),
        usuario_id: user.id
      };

      const response = await fetch(`${API_BASE_URL}/mensagens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mensagemData)
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }

      setNovaMensagem('');
      await carregarMensagens(); // Recarregar após enviar
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setErro('Erro ao enviar mensagem');
    } finally {
      setCarregando(false);
    }
  };

  const verificarAcesso = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/verificar-acesso/${osId}/${user.id}/${user.perfil}`
      );
      
      if (!response.ok) return false;
      
      const { acesso } = await response.json();
      return acesso;
    } catch (error) {
      console.error('Erro ao verificar acesso:', error);
      return false;
    }
  };

  const rolarParaBaixo = () => {
    mensagensFimRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isMinhaMensagem = (mensagemUsuarioId) => {
    return user && mensagemUsuarioId === user.id;
  };

  // Verificar acesso
  useEffect(() => {
    const checkAccess = async () => {
      if (user) {
        const temAcesso = await verificarAcesso();
        if (!temAcesso) {
          setErro('Você não tem acesso a esta OS');
          setMensagens([]);
        }
      }
    };

    checkAccess();
  }, [osId, user]);

  if (!user) {
    return (
      <div className="caixa-mensagens">
        <div className="acesso-negado">
          <h3>🔒 Acesso Restrito</h3>
          <p>Faça login para acessar o chat</p>
        </div>
      </div>
    );
  }

  if (erro && erro.includes('não tem acesso')) {
    return (
      <div className="caixa-mensagens">
        <div className="acesso-negado">
          <h3>⚠️ Acesso Negado</h3>
          <p>{erro}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="caixa-mensagens">
      <div className="mensagens-header">
        <h3>Chat da OS #{osId}</h3>
        <button onClick={carregarMensagens} className="btn-atualizar">
          🔄 Atualizar
        </button>
      </div>

      {erro && <div className="mensagem-erro">{erro}</div>}

      <div className="mensagens-container">
        {mensagens.length === 0 && !erro ? (
          <div className="sem-mensagens">
            Nenhuma mensagem ainda. Seja o primeiro a enviar!
          </div>
        ) : (
          mensagens.map((msg) => (
            <div
              key={msg.id}
              className={`mensagem ${
                isMinhaMensagem(msg.usuario_id) ? 'minha-mensagem' : 'outra-mensagem'
              } ${msg.perfil === 'funcionario' ? 'mensagem-funcionario' : 'mensagem-cliente'}`}
            >
              <div className="mensagem-conteudo">
                <div className="mensagem-cabecalho">
                  <span className="mensagem-nome">
                    {isMinhaMensagem(msg.usuario_id) ? 'Você' : msg.nome}
                  </span>
                  {msg.funcao && msg.funcao !== 'Cliente' && (
                    <span className="mensagem-funcao">({msg.funcao})</span>
                  )}
                </div>
                
                <p className="mensagem-texto">{msg.conteudo}</p>
                
                <span className="mensagem-hora">
                  {formatarData(msg.dataHora)}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={mensagensFimRef} />
      </div>

      <form onSubmit={enviarMensagem} className="mensagem-form">
        <input
          type="text"
          value={novaMensagem}
          onChange={(e) => setNovaMensagem(e.target.value)}
          placeholder="Digite sua mensagem..."
          maxLength={1000}
          disabled={carregando}
        />
        <button 
          type="submit" 
          disabled={!novaMensagem.trim() || carregando}
          className="btn-enviar"
        >
          {carregando ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
};

export default CaixaMensagens;