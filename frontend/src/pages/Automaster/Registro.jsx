import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoHeader from '../../img/Logotipo.jpg';
import axios from 'axios';

const Registro = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    endereco: '',
    cpf: '',
    perfil: 'cliente', // valor padrão
    funcao: ''     
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validação local: senhas iguais
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/auth/registro', formData);
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/login'); // redireciona para login
      }, 2000);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Erro ao criar conta');
      } else {
        setError('Erro de conexão. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-header">
          <img src={logoHeader} alt="Logo AutoMaster" className="registro-logo" />
          <h1>Criar Conta</h1>
          <p>Preencha os dados para se registrar</p>
        </div>

        <form onSubmit={handleSubmit} className="registro-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} placeholder="Digite seu nome completo" required />
          </div>

          <div className="form-group">
            <label htmlFor="cpf">CPF</label>
            <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="00000000000" maxLength="11" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Digite seu e-mail" required />
          </div>

          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(00) 00000-0000" required />
          </div>

          <div className="form-group">
            <label htmlFor="endereco">Endereço</label>
            <input type="text" id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} placeholder="Rua Tal N°111 Bairro Tal" required />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input type="password" id="senha" name="senha" value={formData.senha} onChange={handleChange} placeholder="Digite sua senha" minLength="6" required />
          </div>

          <div className="form-group">
            <label htmlFor="confirmarSenha">Confirmar Senha</label>
            <input type="password" id="confirmarSenha" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} placeholder="Confirme sua senha" minLength="6" required />
          </div>

          <div className="form-group">
            <label htmlFor="perfil">Perfil</label>
            <select id="perfil" name="perfil" value={formData.perfil} onChange={handleChange} required>
              <option value="cliente">Cliente</option>
              <option value="funcionario">Funcionário</option>
            </select>
          </div>

          {/* Campo extra aparece só se for funcionário */}
          {formData.perfil === 'funcionario' && (
            <div className="form-group">
              <label htmlFor="funcao">Função (opcional)</label>
              <input
                type="text"
                id="funcao"
                name="funcao"
                value={formData.funcao}
                onChange={handleChange}
                placeholder="Ex: Mecânico, Atendente, etc."
              />
            </div>
          )}

          <button type="submit" className="registro-button" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <div className="registro-footer">
          <p>Já tem uma conta? <Link to="/login" className="link-login">Faça login</Link></p>
          <Link to="/" className="link-voltar">← Voltar para Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Registro;
