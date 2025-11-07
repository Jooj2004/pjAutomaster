"use client";

import { useState } from "react";
import axios from "axios";
import "../../css/EditarExcluirOS.css";

export default function EditarOS({ os, onClose, onUpdated }) {
  const [form, setForm] = useState({
    diagnostico: os?.diagnostico || "",
    tempo: os?.tempo || "",
    custo: os?.custo || "",
    status: os?.status || "",
    agendamento_id: os?.agendamento_id || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.put(`http://localhost:3001/update/${os.id}`, form);
      onUpdated(); // atualiza lista
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar OS:", err);
      setError("Erro ao atualizar OS. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editar-os-container">
      <h2>Editar Ordem de Serviço #{os.id}</h2>

      <form onSubmit={handleSubmit} className="editar-os-form">
        <label>
          Diagnóstico:
          <textarea
            name="diagnostico"
            value={form.diagnostico}
            onChange={handleChange}
            rows="3"
          />
        </label>

        <label>
          Tempo (horas):
          <input
            type="number"
            name="tempo"
            value={form.tempo}
            onChange={handleChange}
          />
        </label>

        <label>
          Custo (R$):
          <input
            type="number"
            step="0.01"
            name="custo"
            value={form.custo}
            onChange={handleChange}
          />
        </label>

        <label>
          Status:
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="Pendente">Pendente</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Concluída">Concluída</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </label>

        <label>
          Agendamento (opcional):
          <input
            type="number"
            name="agendamento_id"
            value={form.agendamento_id}
            onChange={handleChange}
          />
        </label>

        {error && <p className="error">{error}</p>}

        <div className="editar-os-actions">
          <button type="submit" className="btn-salvar" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
