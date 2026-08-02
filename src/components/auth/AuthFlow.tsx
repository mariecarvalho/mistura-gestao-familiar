
import { useState } from 'react';
import { Welcome } from '@/pages/Welcome';
import { Login } from '@/pages/Login';
import { ForgotPassword } from '@/pages/ForgotPassword';

type AuthStep = 'welcome' | 'login' | 'forgot-password';

export function AuthFlow() {
  const [step, setStep] = useState<AuthStep>('welcome');

  const handleGetStarted = () => setStep('login');
  const handleShowForgotPassword = () => setStep('forgot-password');
  const handleBackToLogin = () => setStep('login');

  switch (step) {
    case 'welcome':
      return <Welcome onGetStarted={handleGetStarted} />;
    case 'login':
      return <Login onShowForgotPassword={handleShowForgotPassword} />;
    case 'forgot-password':
      return <ForgotPassword onBackToLogin={handleBackToLogin} />;
    default:
      return <Welcome onGetStarted={handleGetStarted} />;
  }
}
