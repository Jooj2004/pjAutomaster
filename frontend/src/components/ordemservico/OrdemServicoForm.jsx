import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import '../../css/OrdemServicoForm.css';

const API_BASE_URL = 'http://localhost:3001';

const AddPecaModal = ({ isOpen, onClose, onAddPeca }) => {
    const [peca, setPeca] = useState('');
    const [quantidade, setQuantidade] = useState(1);
    const [custoUnitario, setCustoUnitario] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (peca && quantidade > 0 && custoUnitario >= 0) {
            const novaPeca = {
                nome: peca,
                quantidade: parseInt(quantidade),
                precoUnitario: parseFloat(custoUnitario),
                custoTotal: parseFloat(quantidade) * parseFloat(custoUnitario),
            };
            onAddPeca(novaPeca);
            setPeca('');
            setQuantidade(1);
            setCustoUnitario(0);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Adicionar Peça/Serviço</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="peca">Peça/Serviço:</label>
                        <input id="peca" type="text" value={peca} onChange={(e) => setPeca(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantidade">Quantidade:</label>
                        <input id="quantidade" type="number" min="1" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="custoUnitario">Custo Unitário (R$):</label>
                        <input id="custoUnitario" type="number" step="0.01" min="0" value={custoUnitario} onChange={(e) => setCustoUnitario(e.target.value)} required />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                        <button type="submit" className="btn-primary">Adicionar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const OrdemServicoForm = () => {
    const { user } = useContext(AuthContext);
    const [clientes, setClientes] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [agendamentos, setAgendamentos] = useState([]);
    const [selectedClienteId, setSelectedClienteId] = useState('');
    const [selectedVeiculoId, setSelectedVeiculoId] = useState('');
    const [selectedAgendamentoId, setSelectedAgendamentoId] = useState('');
    const [diagnostico, setDiagnostico] = useState('');
    const [pecas, setPecas] = useState([]);
    const [status, setStatus] = useState('pendente');
    const [tempo, setTempo] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const statusOptions = [
        { value: 'pendente', label: 'Pendente' },
        { value: 'em_andamento', label: 'Em Andamento' },
        { value: 'concluido', label: 'Concluído' },
        { value: 'cancelado', label: 'Cancelado' },
    ];

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/clientes`);
                setClientes(response.data);
            } catch {
                setError('Erro ao carregar clientes.');
            } finally {
                setLoading(false);
            }
        };
        fetchClientes();
    }, []);

    useEffect(() => {
        if (!selectedClienteId) return;
        const fetchVeiculos = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/veiculos/cliente/${selectedClienteId}`);
                setVeiculos(response.data);
            } catch {
                setError('Erro ao carregar veículos.');
            } finally {
                setLoading(false);
            }
        };
        fetchVeiculos();
    }, [selectedClienteId]);

    useEffect(() => {
        if (!selectedVeiculoId) {
            setAgendamentos([]);
            return;
        }

        const fetchAgendamentosPorVeiculo = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/agenda/veiculo/${selectedVeiculoId}`);
                setAgendamentos(response.data || []);
            } catch {
                setAgendamentos([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAgendamentosPorVeiculo();
    }, [selectedVeiculoId]);

    const handleAddPeca = useCallback((novaPeca) => {
        setPecas(prev => [...prev, novaPeca]);
    }, []);

    const handleRemovePeca = (index) => {
        setPecas(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!selectedClienteId || !selectedVeiculoId || !diagnostico) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }

        const totalGeral = pecas.reduce((acc, peca) => acc + peca.custoTotal, 0);

        const ordemDeServico = {
            diagnostico,
            tempo: parseFloat(tempo),
            custo: totalGeral,
            status,
            agendamento_id: selectedAgendamentoId || null,
            funcionario_id: user?.id || null,
        };

        try {
            const osResponse = await axios.post(`${API_BASE_URL}/os/create`, ordemDeServico);
            const osId = osResponse.data?.os?.id;

            if (osId && pecas.length > 0) {
                for (const peca of pecas) {
                    await axios.post(`${API_BASE_URL}/pecas`, {
                        nome: peca.nome,
                        quantidade: peca.quantidade,
                        precoUnitario: peca.precoUnitario,
                        ordemServico_id: osId,
                    });
                }
            }

            alert('Ordem de Serviço e peças criadas com sucesso!');
            console.log('OS criada:', osResponse.data);
        } catch (err) {
            console.error(err);
            alert('Erro ao criar a Ordem de Serviço ou as peças.');
        }
    };

    const totalGeral = pecas.reduce((acc, peca) => acc + peca.custoTotal, 0);

    return (
        <div className="ordem-servico-container">
            <div className="main-content">
                {loading && <p>Carregando...</p>}
                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSave}>
                    <section className="form-section">
                        <div className="form-group">
                            <label>Cliente</label>
                            <select value={selectedClienteId} onChange={(e) => setSelectedClienteId(e.target.value)} required>
                                <option value="">Selecione</option>
                                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Veículo</label>
                            <select value={selectedVeiculoId} onChange={(e) => setSelectedVeiculoId(e.target.value)} required>
                                <option value="">Selecione</option>
                                {veiculos.map(v => (
                                    <option key={v.id} value={v.id}>{v.placa} - {v.modelo}</option>
                                ))}
                            </select>
                        </div>
                    </section>

                    <section className="form-section">
                        <div className="form-group">
                            <label>Vincular Agendamento</label>
                            {agendamentos.length === 0 ? (
                                <p className="no-data">Nenhum agendamento disponível para este veículo.</p>
                            ) : (
                                <select value={selectedAgendamentoId} onChange={(e) => setSelectedAgendamentoId(e.target.value)}>
                                    <option value="">Nenhum</option>
                                    {agendamentos.map(a => (
                                        <option key={a.id} value={a.id}>
                                            {new Date(a.dataHora).toLocaleString()} - {a.servico} ({a.status})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </section>

                    <section className="form-section">
                        <div className="form-group">
                            <label>Diagnóstico</label>
                            <textarea rows="4" value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} required></textarea>
                        </div>
                    </section>

                    <section className="form-section pecas-custos-section">
                        <h2>Peças e Custos</h2>
                        <table className="pecas-table">
                            <thead>
                                <tr>
                                    <th>Peça/Serviço</th>
                                    <th>Qtd</th>
                                    <th>Unitário</th>
                                    <th>Total</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pecas.length === 0 ? (
                                    <tr><td colSpan="5" className="no-data">Nenhuma peça adicionada.</td></tr>
                                ) : (
                                    pecas.map((p, i) => (
                                        <tr key={i}>
                                            <td>{p.nome}</td>
                                            <td>{p.quantidade}</td>
                                            <td>R$ {p.precoUnitario.toFixed(2)}</td>
                                            <td>R$ {p.custoTotal.toFixed(2)}</td>
                                            <td><button type="button" onClick={() => handleRemovePeca(i)}>Remover</button></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" className="total-label">Total:</td>
                                    <td colSpan="2" className="total-value">R$ {totalGeral.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                        <div className="pecas-actions">
                            <button type="button" onClick={() => setIsModalOpen(true)} className="btn-primary">Adicionar</button>
                        </div>
                    </section>

                    <section className="form-section">
                        <div className="form-group">
                            <label>Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                    </section>

                    <section className="form-section">
                        <div className="form-group">
                            <label>Tempo</label>
                            <input type='text' placeholder='Em horas' value={tempo} onChange={(e) => setTempo(e.target.value)} required></input>
                        </div>
                    </section>

                    <div className="form-actions">
                        <button type="submit" className="btn-save">Salvar OS</button>
                    </div>
                </form>

                <AddPecaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddPeca={handleAddPeca} />
            </div>
        </div>
    );
};

export default OrdemServicoForm;