import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import './Auth.css';

const Register: React.FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleRegister = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('O cadastro foi cancelado.');
      } else {
        setError('Falha ao criar conta com o Google. Tente novamente.');
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
        <p className="auth-card-subtitle">Comece a planejar seus projetos facilmente com o Google</p>
        
        {error && <div className="auth-alert">{error}</div>}
        
        <button 
          onClick={handleGoogleRegister} 
          className="auth-button" 
          disabled={loading} 
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '12px'
          }}
        >
          <svg style={{width: 24, height: 24}} viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
            />
          </svg>
          {loading ? 'Redirecionando...' : 'Cadastrar com o Google'}
        </button>
        
        <div className="auth-footer">
          Já tem uma conta? <Link to="/login" className="auth-link" style={{color: '#3b82f6'}}>Entrar</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
