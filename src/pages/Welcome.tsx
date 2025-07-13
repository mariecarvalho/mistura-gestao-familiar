import { Button } from '@/components/ui/button';
import { Heart, Users, Calendar, HandHeart, Sparkles, ArrowRight, Star } from 'lucide-react';
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-600">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-300/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-400/20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className={`max-w-6xl mx-auto text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
          {/* Hero Section */}
          <div className="mb-16">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl hover:scale-110 transition-transform duration-500 relative">
                <HandHeart className="h-16 w-16 text-orange-500 drop-shadow-lg" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="h-3 w-3 text-orange-600" />
                </div>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
                Mistura
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent block font-extrabold">
                  Acolhe
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white mb-8 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-sm">
                Transformando vidas através da <span className="font-bold text-yellow-200 bg-orange-600/20 px-2 py-1 rounded-lg">organização</span> e{' '}
                <span className="font-bold text-orange-200 bg-pink-600/20 px-2 py-1 rounded-lg">solidariedade</span>
              </p>
              
              <p className="text-lg text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
                Sistema completo de gestão para projetos sociais. Gerencie famílias, 
                organize ações solidárias e coordene voluntários de forma eficiente.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="group">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 text-gray-800 hover:bg-white transition-all duration-500 border border-white/50 hover:border-white hover:scale-105 h-full shadow-xl">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-blue-700">Gestão de Famílias</h3>
                <p className="text-gray-700 leading-relaxed">
                  Cadastre e acompanhe famílias assistidas com informações completas, 
                  histórico de atendimentos e relatórios detalhados.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 text-gray-800 hover:bg-white transition-all duration-500 border border-white/50 hover:border-white hover:scale-105 h-full shadow-xl">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Calendar className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-green-700">Ações Solidárias</h3>
                <p className="text-gray-700 leading-relaxed">
                  Planeje e execute ações de distribuição de alimentos, eventos de arrecadação 
                  e outras atividades com controle total.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 text-gray-800 hover:bg-white transition-all duration-500 border border-white/50 hover:border-white hover:scale-105 h-full shadow-xl">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-pink-700">Voluntários</h3>
                <p className="text-gray-700 leading-relaxed">
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
              className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-16 py-6 text-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl group border-2 border-white hover:scale-105"
            >
              Acessar Mistura App
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <div className="text-white text-lg font-medium drop-shadow-sm">
              <p>✨ Uma ferramenta feita com amor para transformar comunidades</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}