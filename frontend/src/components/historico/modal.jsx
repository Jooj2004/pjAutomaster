export const ModalHistorico = ({data, user, onClose}) => (
    <div className="modal-historico-overlay">
        <div className="modal-historico">
            <h2>Detalhes do Serviço</h2>
            <p><strong>Data:</strong> {data.data}</p>

            {user === 'funcionario' &&
                <p><strong>Cliente:</strong> {data.cliente}</p>
            }

            <p><strong>Veículo:</strong> {data.veiculo.marca} {data.veiculo.modelo} ({data.veiculo.placa})</p>
            <p><strong>Tipo de serviço:</strong> {data.servico}</p>
            <p><strong>Diagnóstico:</strong> {data.diagnostico}</p>
            <p><strong>Peças utilizadas:</strong> {data.pecas.join(", ")}</p>
            <p><strong>Custo total:</strong> {data.custo}</p>
            <p><strong>Status:</strong> {data.status}</p>
            LINK PARA A AGENDA
            <button className="btn-voltar" onClick={onClose}>Voltar</button>
        </div>
    </div>
)