import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export const FormFuncionario = ({ disable, setDisable }) => {
    const { user } = useContext(AuthContext);
    const userId = user?.id;

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("********");
    const [telefone, setTelefone] = useState("");
    const [funcao, setFuncao] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) return;

            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3001/user/${userId}`);
                const data = await response.json();

                if (!response.ok) {
                    console.error("Erro ao buscar dados do funcionário:", data.error);
                    return;
                }

                setNome(data.nome);
                setEmail(data.email);
                setSenha(""); // nunca preencher a senha real
                setTelefone(data.telefone);
                setFuncao(data.funcao || "");
            } catch (err) {
                console.error("Erro de rede:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            nome,
            email,
            senha,
            telefone,
            perfil: 'funcionario',
            funcao
        };

        try {
            const response = await fetch(`http://localhost:3001/editar/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Erro ao atualizar perfil:", data.error);
                alert(`Erro: ${data.error}`);
                return;
            }

            alert(data.message);
            setDisable(true);
        } catch (err) {
            console.error(err);
            alert("Erro de rede ou servidor");
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Carregando dados do funcionário...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} onReset={() => setDisable(true)}>
            <label htmlFor="nome">
                Nome
                <input 
                    type="text" 
                    name="nome" 
                    id="nome" 
                    disabled={disable}
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                />
            </label>

            <label htmlFor="email">
                E-mail
                <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    disabled={disable}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </label>

            <label htmlFor="senha">
                Senha
                <input 
                    type="password" 
                    name="senha" 
                    id="senha" 
                    disabled={disable}
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                />
            </label>

            <label htmlFor="telefone">
                Telefone
                <input 
                    type="tel" 
                    name="telefone" 
                    id="telefone" 
                    disabled={disable}
                    value={telefone}
                    onChange={e => setTelefone(e.target.value)}
                />
            </label>

            <label htmlFor="funcao">
                Função/Cargo
                <input 
                    type="text" 
                    name="funcao" 
                    id="funcao" 
                    disabled={disable}
                    value={funcao}
                    onChange={e => setFuncao(e.target.value)}
                />
            </label>

            <div>
                Campo para a AGENDA
            </div>

            {!disable &&
                <div className="area-button">
                    <button className="btn-cancel" type="reset">Cancelar</button>
                    <button className="btn-safe" type="submit">Salvar</button>
                </div>
            }
        </form>
    );
};
