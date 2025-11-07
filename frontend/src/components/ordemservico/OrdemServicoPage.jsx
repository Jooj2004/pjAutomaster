"use client";

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "../../css/OrdemServico.css";
import OrdemServicoForm from "./OrdemServicoForm";
import { AuthContext } from "../../context/AuthContext";
import CaixaMensagens from "./caixa-menssagem";
import EditarOS from "./EditarOS";
import ExcluirOS from "./ExcluirOS";

export default function ListaOrdemServico() {
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [selectedOS, setSelectedOS] = useState(null);

  const { user } = useContext(AuthContext);
  const funcionario_id = user?.id;

  // Agora o fetchOrdens está dentro do useEffect
  useEffect(() => {
    if (!funcionario_id) return;

    const fetchOrdens = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/os/${funcionario_id}`);
        setOrdens(response.data);
      } catch (error) {
        console.error("Erro ao buscar ordens de serviço:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdens();
  }, [funcionario_id]);

  const handleAdd = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const handleOSCreated = (novaOS) => {
    setOrdens([...ordens, novaOS]);
    setShowForm(false);
  };

  const handleEdit = (os) => {
    setSelectedOS(os);
    setShowEditModal(true);
  };
  const handleCloseEdit = () => {
    setSelectedOS(null);
    setShowEditModal(false);
  };

  const handleDelete = (os) => {
    setSelectedOS(os);
    setShowDeleteModal(true);
  };
  const handleCloseDelete = () => {
    setSelectedOS(null);
    setShowDeleteModal(false);
  };

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
        <h1>Ordens de Serviço</h1>
        <button className="btn-add" onClick={handleAdd}>
          Adicionar OS
        </button>
      </div>

      {ordens.length === 0 ? (
        <p className="empty-text">Nenhuma ordem de serviço cadastrada.</p>
      ) : (
        <div className="os-grid">
          {ordens.map((os) => (
            <div key={os.id} className="os-card">
              <div className="os-card-header">
                <h2>OS #{os.id}</h2>
                <span className="os-status">{os.status || "Sem status"}</span>
              </div>
              <div className="os-card-body">
                <p><strong>Diagnóstico:</strong> {os.diagnostico || "—"}</p>
                <p><strong>Tempo:</strong> {os.tempo ? `${os.tempo}h` : "—"}</p>
                <p><strong>Custo:</strong> {os.custo ? `R$ ${os.custo.toFixed(2)}` : "—"}</p>
              </div>
              <div className="os-actions">
                <button className="btn-edit" onClick={() => handleEdit(os)}>Editar</button>
                <button className="btn-delete" onClick={() => handleDelete(os)}>Excluir</button>
                <button className="btn-msg" onClick={() => handleMessages(os)}>Mensagens</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de adicionar */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="btn-close" onClick={handleCloseForm}>×</button>
            <OrdemServicoForm onSuccess={handleOSCreated} />
          </div>
        </div>
      )}

      {/* Modal de edição */}
      {showEditModal && selectedOS && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="btn-close" onClick={handleCloseEdit}>×</button>
            <EditarOS os={selectedOS} onClose={handleCloseEdit} onUpdated={() => {
              // Atualiza as ordens após editar
              setLoading(true);
              axios.get(`http://localhost:3001/os/${funcionario_id}`)
                .then((res) => setOrdens(res.data))
                .catch((err) => console.error("Erro ao atualizar ordens:", err))
                .finally(() => setLoading(false));
            }} />
          </div>
        </div>
      )}

      {/* Modal de exclusão */}
      {showDeleteModal && selectedOS && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="btn-close" onClick={handleCloseDelete}>×</button>
            <ExcluirOS os={selectedOS} onClose={handleCloseDelete} onDeleted={() => {
              setLoading(true);
              axios.get(`http://localhost:3001/os/${funcionario_id}`)
                .then((res) => setOrdens(res.data))
                .catch((err) => console.error("Erro ao atualizar ordens:", err))
                .finally(() => setLoading(false));
            }} />
          </div>
        </div>
      )}

      {/* Modal de mensagens */}
      {showMsgModal && selectedOS && (
        <div className="modal-overlay">
          <div className="modal-content modal-messages">
            <button className="btn-close" onClick={handleCloseMessages}>×</button>
            <h2>Mensagens da OS #{selectedOS.id}</h2>
            <div className="mensagens-container">
              <CaixaMensagens osId={selectedOS.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
