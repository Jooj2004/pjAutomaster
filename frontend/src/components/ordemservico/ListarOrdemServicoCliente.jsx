"use client";

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "../../css/OrdemServico.css";
import { AuthContext } from "../../context/AuthContext";
import CaixaMensagens from "./caixa-menssagem";

const ListarOrdemServicoCliente = () => {
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [selectedOS, setSelectedOS] = useState(null);

  const { user } = useContext(AuthContext);
  const cliente_id = user?.id;

  useEffect(() => {
    if (!cliente_id) return;

    const fetchOrdens = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/os/cliente/${cliente_id}`);
        setOrdens(response.data);
      } catch (error) {
        console.error("Erro ao buscar ordens de serviço do cliente:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdens();
  }, [cliente_id]);

  const handleMessages = (os) => {
    setSelectedOS(os);
    setShowMsgModal(true);
  };

  const handleCloseMessages = () => {
    setSelectedOS(null);
    setShowMsgModal(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="os-container">
      <div className="os-header">
      </div>

      {ordens.length === 0 ? (
        <p className="empty-text">Você ainda não possui ordens de serviço cadastradas.</p>
      ) : (
        <div className="os-grid">
            {ordens.map((os) => (
                <div key={os.os_id} className="os-card">
                    <div className="os-card-header">
                    <h2>OS #{os.os_id}</h2>
                    <span className="os-status">{os.status || "Sem status"}</span>
                    </div>
                    <div className="os-card-body">
                    <p><strong>Diagnóstico:</strong> {os.diagnostico || "—"}</p>
                    <p><strong>Tempo estimado:</strong> {os.tempo ? `${os.tempo}h` : "—"}</p>
                    <p><strong>Custo estimado:</strong> {os.custo ? `R$ ${os.custo.toFixed(2)}` : "—"}</p>
                    </div>
                    <div className="os-actions">
                    <button className="btn-msg" onClick={() => handleMessages(os)}>Mensagens</button>
                    </div>
                </div>
            ))}
        </div>
      )}

        {showMsgModal && selectedOS && (
            <div className="modal-overlay">
                <div className="modal-content modal-messages">
                <button className="btn-close" onClick={handleCloseMessages}>×</button>
                <h2>Mensagens da OS #{selectedOS.os_id}</h2>
                <div className="mensagens-container">
                    <CaixaMensagens osId={selectedOS.os_id} />
                </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ListarOrdemServicoCliente;