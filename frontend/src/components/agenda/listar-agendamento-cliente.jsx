"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FormAgenda } from "./form-agenda";
import "../../css/Agenda.css";

export const ListarAgendamentosCliente = () => {
  const { user } = useContext(AuthContext);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalCriar, setShowModalCriar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalExcluir, setShowModalExcluir] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [formData, setFormData] = useState({ servico: "", data: "", horario: "" });

  // 🔄 Buscar agendamentos do cliente logado
  useEffect(() => {
    const fetchAgendamentos = async () => {
      if (!user) return;
      try {
        const resUser = await fetch(`http://localhost:3001/user/${user.id}`);
        const usuario = await resUser.json();

        if (usuario.perfil === "cliente" && usuario.clienteId) {
          const res = await fetch(`http://localhost:3001/agenda/cliente/${usuario.clienteId}`);
          const data = await res.json();
          if (res.ok) setAgendamentos(data);
        }
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgendamentos();
  }, [user]);

  // 🧭 Modais
  const abrirModalCriar = () => setShowModalCriar(true);
  const fecharModalCriar = () => setShowModalCriar(false);

  const abrirModalEditar = (a) => {
    const dataHora = new Date(a.dataHora);
    setSelectedAgendamento(a);
    setFormData({
      servico: a.servico,
      data: dataHora.toISOString().slice(0, 10),
      horario: dataHora.toTimeString().slice(0, 5),
    });
    setShowModalEditar(true);
  };
  const fecharModalEditar = () => {
    setSelectedAgendamento(null);
    setShowModalEditar(false);
  };

  const abrirModalExcluir = (a) => {
    setSelectedAgendamento(a);
    setShowModalExcluir(true);
  };
  const fecharModalExcluir = () => {
    setSelectedAgendamento(null);
    setShowModalExcluir(false);
  };

  // ✏️ Editar
  const handleEditar = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/agenda/update/${selectedAgendamento.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updated = await res.json();
        alert("Agendamento atualizado com sucesso!");
        setAgendamentos((prev) =>
          prev.map((a) => (a.id === selectedAgendamento.id ? { ...a, ...updated.agendamento } : a))
        );
        fecharModalEditar();
      } else {
        alert("Erro ao atualizar agendamento.");
      }
    } catch (error) {
      console.error("Erro ao editar agendamento:", error);
    }
  };

  // 🗑️ Excluir
  const handleExcluir = async () => {
    try {
      const res = await fetch(`http://localhost:3001/agenda/delete/${selectedAgendamento.id}`, {
        method: "DELETE",
      });


      if (res.ok) {
        alert("Agendamento excluído com sucesso!");
        setAgendamentos((prev) => prev.filter((a) => a.id !== selectedAgendamento.id));
        fecharModalExcluir();
      } else {
        alert("Erro ao excluir agendamento.");
      }
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="agenda-container">
      <div className="agenda-header">
        <button className="btn-novo" onClick={abrirModalCriar}>
          Novo Agendamento
        </button>
      </div>

      {agendamentos.length === 0 ? (
        <p className="empty-text">Você ainda não possui agendamentos.</p>
      ) : (
        <div className="agenda-grid">
          {agendamentos.map((a) => (
            <div key={a.id} className="agenda-card">
              <div className="agenda-card-header">
                <h2>Agendamento #{a.id}</h2>
                <span className={`status ${a.status?.toLowerCase()}`}>{a.status}</span>
              </div>
              <div className="agenda-card-body">
                <p><strong>Serviço:</strong> {a.servico}</p>
                <p><strong>Data:</strong> {new Date(a.dataHora).toLocaleDateString("pt-BR")}</p>
                <p><strong>Hora:</strong> {new Date(a.dataHora).toLocaleTimeString("pt-BR", {hour: "2-digit", minute: "2-digit"})}</p>
                <p><strong>Veículo:</strong> {`${a.modelo || "—"} (${a.placa || "—"})`}</p>
              </div>
              <div className="agenda-actions">
                <button className="btn-editar" onClick={() => abrirModalEditar(a)}>Editar</button>
                <button className="btn-excluir" onClick={() => abrirModalExcluir(a)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE CRIAR */}
      {showModalCriar && (
        <div className="modal-full">
          <div className="modal-content-full">
            <button className="btn-close" onClick={fecharModalCriar}>×</button>
            <h2>Novo Agendamento</h2>
            <FormAgenda />
          </div>
        </div>
      )}

      {/* MODAL DE EDITAR */}
      {showModalEditar && selectedAgendamento && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="btn-close" onClick={fecharModalEditar}>×</button>
            <h2>Editar Agendamento #{selectedAgendamento.id}</h2>
            <form onSubmit={handleEditar}>
              <label>Serviço</label>
              <input
                type="text"
                value={formData.servico}
                onChange={(e) => setFormData({ ...formData, servico: e.target.value })}
                required
              />

              <label>Data</label>
              <input
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />

              <label>Hora</label>
              <input
                type="time"
                value={formData.horario}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                required
              />

              <div className="modal-actions">
                <button type="submit" className="btn-enviar">Salvar</button>
                <button type="button" className="btn-excluir" onClick={fecharModalEditar}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE EXCLUIR */}
      {showModalExcluir && selectedAgendamento && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="btn-close" onClick={fecharModalExcluir}>×</button>
            <h2>Excluir Agendamento #{selectedAgendamento.id}</h2>
            <p>Tem certeza que deseja excluir este agendamento?</p>
            <div className="modal-actions">
              <button className="btn-excluir" onClick={handleExcluir}>Confirmar</button>
              <button className="btn-enviar" onClick={fecharModalExcluir}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarAgendamentosCliente;