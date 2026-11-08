
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail } from 'lucide-react';
import { MisturaIcon } from '@/components/ui/MisturaIcon';
import { toast } from '@/hooks/use-toast';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'code' | 'reset'>('email');
  const [resetData, setResetData] = useState({
    code: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast({
          title: "Código enviado",
          description: "Verifique seu email para o código de verificação",
        });
        setStep('code');
      } else {
        const error = await response.json();
        toast({
          title: "Erro",
          description: error.message || "Erro ao enviar código",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar código. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          code: resetData.code 
        }),
      });

      if (response.ok) {
        setStep('reset');
      } else {
        const error = await response.json();
        toast({
          title: "Erro",
          description: error.message || "Código inválido",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao verificar código. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (resetData.newPassword !== resetData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (resetData.newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          code: resetData.code, 
          newPassword: resetData.newPassword 
        }),
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Senha alterada com sucesso! Faça login com a nova senha.",
        });
        onBackToLogin();
      } else {
        const error = await response.json();
        toast({
          title: "Erro",
          description: error.message || "Erro ao alterar senha",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar senha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-warm-orange rounded-full flex items-center justify-center mx-auto mb-4">
            {step === 'email' ? <Mail className="h-8 w-8 text-white" /> : <MisturaIcon className="h-10 w-10 text-white" />}
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === 'email' && 'Recuperar Senha'}
            {step === 'code' && 'Verificar Código'}
            {step === 'reset' && 'Nova Senha'}
          </CardTitle>
          <CardDescription>
            {step === 'email' && 'Digite seu email para receber o código de verificação'}
            {step === 'code' && 'Digite o código enviado para seu email'}
            {step === 'reset' && 'Digite sua nova senha'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar Código'}
              </Button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código de Verificação</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={resetData.code}
                  onChange={(e) => setResetData({...resetData, code: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verificando...' : 'Verificar Código'}
              </Button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={resetData.newPassword}
                  onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={resetData.confirmPassword}
                  onChange={(e) => setResetData({...resetData, confirmPassword: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Button variant="ghost" onClick={onBackToLogin} className="text-sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para o login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
