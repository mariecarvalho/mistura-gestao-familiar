
import { useState } from 'react';
import { Welcome } from '@/pages/Welcome';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { ForgotPassword } from '@/pages/ForgotPassword';

type AuthStep = 'welcome' | 'login' | 'register' | 'forgot-password';

export function AuthFlow() {
  const [step, setStep] = useState<AuthStep>('welcome');

  const handleGetStarted = () => setStep('login');
  const handleShowRegister = () => setStep('register');
  const handleShowForgotPassword = () => setStep('forgot-password');
  const handleBackToLogin = () => setStep('login');

  switch (step) {
    case 'welcome':
      return <Welcome onGetStarted={handleGetStarted} />;
    case 'login':
      return (
        <Login 
          onShowRegister={handleShowRegister}
          onShowForgotPassword={handleShowForgotPassword}
        />
      );
    case 'register':
      return <Register onBackToLogin={handleBackToLogin} />;
    case 'forgot-password':
      return <ForgotPassword onBackToLogin={handleBackToLogin} />;
    default:
      return <Welcome onGetStarted={handleGetStarted} />;
  }
}
