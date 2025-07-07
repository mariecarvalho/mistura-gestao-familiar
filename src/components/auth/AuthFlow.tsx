
import { useState } from 'react';
import { Welcome } from '@/pages/Welcome';
import { Login } from '@/pages/Login';

export function AuthFlow() {
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin) {
    return <Login />;
  }

  return <Welcome onGetStarted={() => setShowLogin(true)} />;
}
