import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Calendario } from "./calendario-func";

export const GestaoAgendaFuncionario = () => {
  const { user } = useContext(AuthContext);
  const [diasIndisponiveis, setDiasIndisponiveis] = useState([]);

  useEffect(() => {
    const fetchIndisponiveis = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`http://localhost:3001/agenda/indisponibilidade/${user.id}`);
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setDiasIndisponiveis(
            data.map((d) => new Date(d.data))
          );
        }
      } catch (error) {
        console.error("Erro ao carregar indisponibilidades:", error);
      }
    };
    fetchIndisponiveis();
  }, [user]);

  const toggleDia = (diasSelecionados) => {
    const formatados = diasSelecionados.map((d) => new Date(d));
    setDiasIndisponiveis(formatados);
  };

  const salvar = async () => {
    try {
      if (!user?.id) return alert("Usuário não autenticado");

      const payload = {
        funcionario_id: user.id,
        datas_indisponiveis: diasIndisponiveis.map(
          (d) => d.toISOString().split("T")[0]
        ),
      };

      const res = await fetch("http://localhost:3001/agenda/indisponibilidade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) alert("Indisponibilidades salvas com sucesso!");
      else alert("Erro ao salvar indisponibilidades.");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro no servidor.");
    }
  };

  return (
    <div className="agenda-container">
      <h1>Gestão da Agenda</h1>
      <p>Selecione os dias em que você <b>não poderá trabalhar</b>.</p>

      <Calendario
        selectedDate={null}
        setSelectedDate={toggleDia}
        diasIndisponiveis={diasIndisponiveis}
      />

      <button className="btn-enviar" onClick={salvar}>
        Salvar Indisponibilidades
      </button>
    </div>
  );
};