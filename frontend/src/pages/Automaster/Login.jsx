import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoHeader from '../../img/Logotipo.jpg';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/auth/login', formData);
      const { token, user } = response.data;

      // Salva no contexto
      login(user, token);

      // Redireciona baseado no perfil
      navigate('/dashboard')

    } catch (err) {
      if (err.response) setError(err.response.data.message || 'Erro ao fazer login');
      else setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={logoHeader} alt="Logo AutoMaster" className="login-logo" />
          <h1>Bem-vindo de volta!</h1>
          <p>Faça login para acessar sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Digite seu e-mail"
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              placeholder="Digite sua senha"
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-footer">
          <p>Não tem uma conta? <Link to="/registro" className="link-registro">Registre-se</Link></p>
          <Link to="/" className="link-voltar">← Voltar para Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
