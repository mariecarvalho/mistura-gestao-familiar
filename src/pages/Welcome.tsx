import { Button } from '@/components/ui/button';
import { ChefHat, Users, Calendar, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface WelcomeProps {
  onGetStarted: () => void;
}

export function Welcome({ onGetStarted }: WelcomeProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary-foreground">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className={`max-w-6xl mx-auto text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
          {/* Hero Section */}
          <div className="mb-16">
            <div className="relative mb-8">
              <div className="w-40 h-40 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/20 hover:scale-105 transition-transform duration-500">
                <ChefHat className="h-20 w-20 text-white drop-shadow-lg" />
                <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-300 animate-pulse" />
              </div>
              
              <h1 className="text-7xl md:text-8xl font-black text-white mb-6 tracking-tight">
                Mistura
                <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent block">
                  Acolhe
                </span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed font-light">
                Transformando vidas através da <span className="font-semibold text-yellow-200">organização</span> e{' '}
                <span className="font-semibold text-orange-200">solidariedade</span>
              </p>
              
              <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
                Sistema completo de gestão para projetos sociais. Gerencie famílias, 
                organize ações solidárias e coordene voluntários de forma eficiente.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="group">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-white hover:bg-white/15 transition-all duration-500 border border-white/20 hover:border-white/30 hover:scale-105 h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-blue-200" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-blue-100">Gestão de Famílias</h3>
                <p className="text-white/80 leading-relaxed">
                  Cadastre e acompanhe famílias assistidas com informações completas, 
                  histórico de atendimentos e relatórios detalhados.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-white hover:bg-white/15 transition-all duration-500 border border-white/20 hover:border-white/30 hover:scale-105 h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-10 w-10 text-green-200" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-green-100">Ações Solidárias</h3>
                <p className="text-white/80 leading-relaxed">
                  Planeje e execute ações de distribuição de alimentos, eventos de arrecadação 
                  e outras atividades com controle total.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-white hover:bg-white/15 transition-all duration-500 border border-white/20 hover:border-white/30 hover:scale-105 h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-400/20 to-pink-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-10 w-10 text-pink-200" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-pink-100">Voluntários</h3>
                <p className="text-white/80 leading-relaxed">
                  Organize sua equipe de voluntários, gerencie habilidades 
                  e acompanhe a participação em cada ação social.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-8">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-white text-primary hover:bg-white/95 font-bold px-16 py-6 text-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl group border border-white/20 hover:scale-105"
            >
              Acessar Mistura App
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <div className="text-white/60 text-lg font-medium">
              <p>✨ Uma ferramenta feita com amor para transformar comunidades</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}