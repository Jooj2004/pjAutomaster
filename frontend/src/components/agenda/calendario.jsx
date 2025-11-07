import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css';
import { ptBR } from 'date-fns/locale';

export const Calendario = ({selectedDate, setSelectedDate}) => {
    const today = new Date()

    return(
        <div>
            <DayPicker
                className="cal-desk"
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                numberOfMonths={2}
                disabled={{ before: today }}
                locale={ptBR}
            />

            <DayPicker
                className="cal-mobile"
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                numberOfMonths={1}
                disabled={{ before: today }}
                locale={ptBR}
            />
        </div>
    )
}