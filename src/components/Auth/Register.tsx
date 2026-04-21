import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import './Auth.css';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('As senhas não coincidem.');
    }

    if (password.length < 6) {
      return setError('A senha deve ter pelo menos 6 caracteres.');
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Context will update automatically, Navigate to dashboard
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else {
        setError('Falha ao criar conta. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-logo">
          <div className="auth-card-logo-icon" style={{background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'}}>gv</div>
        </div>
        <h2 className="auth-card-title">Crie sua conta</h2>
        <p className="auth-card-subtitle">Comece a planejar seus projetos agora</p>
        
        {error && <div className="auth-alert">{error}</div>}
        
        <form onSubmit={handleRegister}>
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
          <div className="auth-input-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input 
              id="confirmPassword"
              type="password" 
              className="auth-input" 
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={loading} style={{background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'}}>
            {loading ? 'Criando...' : 'Cadastrar'}
          </button>
        </form>
        
        <div className="auth-footer">
          Já tem uma conta? <Link to="/login" className="auth-link" style={{color: '#3b82f6'}}>Entrar</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
