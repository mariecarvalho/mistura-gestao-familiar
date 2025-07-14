
import { Button } from '@/components/ui/button';
import { Heart, Users, Calendar, HandHeart, ArrowRight, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-orange-200/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-40 h-40 bg-orange-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
          {/* Hero Section */}
          <div className="mb-16">
            <div className="relative mb-12">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl hover:scale-110 transition-transform duration-500 relative">
                <HandHeart className="h-12 w-12 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black text-gray-800 mb-4 tracking-tight">
                Mistura
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent block font-extrabold">
                  Acolhe
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
                Transformando vidas através da <span className="font-bold text-orange-600">organização</span> e{' '}
                <span className="font-bold text-orange-600">solidariedade</span>
              </p>
              
              <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-12">
                Sistema completo de gestão para projetos sociais
              </p>
            </div>
          </div>

          {/* Simple Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-3xl mx-auto">
            <div className="group text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors duration-300">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Famílias</h3>
              <p className="text-gray-600 text-sm">Gerencie e acompanhe</p>
            </div>

            <div className="group text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors duration-300">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Ações</h3>
              <p className="text-gray-600 text-sm">Organize eventos</p>
            </div>

            <div className="group text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors duration-300">
                <Heart className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Voluntários</h3>
              <p className="text-gray-600 text-sm">Coordene equipes</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-6">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-12 py-4 text-xl shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group border-0"
            >
              Começar Agora
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <div className="text-gray-500 text-base font-medium">
              <p>✨ Feito com carinho para transformar comunidades</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
