"use client";

import axios from "axios";
import "../../css/EditarExcluirOS.css";

export default function ExcluirOS({ os, onClose, onDeleted }) {
  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir esta OS?")) return;

    try {
      await axios.delete(`http://localhost:3001/delete/${os.id}`);
      onDeleted(); // atualiza lista
      onClose();
    } catch (err) {
      console.error("Erro ao excluir OS:", err);
      alert("Erro ao excluir OS. Verifique o console.");
    }
  };

  return (
    <div className="editar-os-container">
      <h2>Excluir Ordem de Serviço #{os.id}</h2>
      <p>Tem certeza que deseja excluir esta ordem de serviço?</p>
      <div className="editar-os-actions">
        <button onClick={handleDelete} className="btn-excluir">
          Excluir
        </button>
        <button onClick={onClose} className="btn-salvar">
          Cancelar
        </button>
      </div>
    </div>
  );
}
