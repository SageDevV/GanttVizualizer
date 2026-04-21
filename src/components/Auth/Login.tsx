import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import './Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Context will update automatically, Navigate to dashboard
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError('Falha ao fazer login. Verifique seu email e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-logo">
          <div className="auth-card-logo-icon">gv</div>
        </div>
        <h2 className="auth-card-title">Bem-vindo de volta</h2>
        <p className="auth-card-subtitle">Entre para gerenciar seus projetos</p>
        
        {error && <div className="auth-alert">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="auth-input-group">
            <label htmlFor="email">E-mail</label>
            <input 
              id="email"
              type="email" 
              className="auth-input" 
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="auth-input-group">
            <label htmlFor="password">Senha</label>
            <input 
              id="password"
              type="password" 
              className="auth-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="auth-footer">
          Não tem uma conta? <Link to="/register" className="auth-link">Cadastre-se</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
