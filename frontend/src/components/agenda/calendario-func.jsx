import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ptBR } from "date-fns/locale";
import "../../css/calendario-func.css"

export const Calendario = ({ selectedDate, setSelectedDate, diasIndisponiveis = [] }) => {
  const today = new Date();

  return (
    <div>
      {/* Versão desktop */}
      <DayPicker
        className="cal-desk"
        mode="multiple"                 
        selected={diasIndisponiveis}    
        onSelect={setSelectedDate}     
        numberOfMonths={2}
        disabled={{ before: today }}
        locale={ptBR}
      />

      {/* Versão mobile */}
      <DayPicker
        className="cal-mobile"
        mode="multiple"
        selected={diasIndisponiveis}
        onSelect={setSelectedDate}
        numberOfMonths={1}
        disabled={{ before: today }}
        locale={ptBR}
      />
    </div>
  );
};