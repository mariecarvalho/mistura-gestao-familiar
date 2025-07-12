
import { Button } from '@/components/ui/button';
import { ChefHat, Users, Calendar, Heart } from 'lucide-react';
// import { Heart } from 'lucide-react'; // Mantendo comentado conforme solicitado

interface WelcomeProps {
  onGetStarted: () => void;
}

export function Welcome({ onGetStarted }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <ChefHat className="h-16 w-16 text-warm-orange" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-4">
            Mistura Acolhe
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Sistema completo de gestão para projetos sociais. 
            Gerencie famílias, organize ações solidárias e coordene voluntários 
            de forma eficiente e organizada.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-white hover:bg-white/15 transition-all">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Gestão de Famílias</h3>
            <p className="text-white/80">
              Cadastre e acompanhe famílias assistidas com informações completas e organizadas
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-white hover:bg-white/15 transition-all">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Ações Solidárias</h3>
            <p className="text-white/80">
              Planeje e execute ações de distribuição de alimentos e outras atividades
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-white hover:bg-white/15 transition-all">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Voluntários</h3>
            <p className="text-white/80">
              Organize sua equipe de voluntários e acompanhe a participação em ações
            </p>
          </div>
        </div>

        <Button 
          onClick={onGetStarted}
          size="lg"
          className="bg-white text-warm-orange hover:bg-white/90 font-semibold px-12 py-4 text-xl shadow-lg hover:shadow-xl transition-all"
        >
          Acessar Mistura App
        </Button>

        <div className="mt-8 text-white/70 text-sm">
          <p>Transformando vidas através da organização e solidariedade</p>
        </div>
      </div>
    </div>
  );
}
