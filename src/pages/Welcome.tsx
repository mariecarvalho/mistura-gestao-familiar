
import { Button } from '@/components/ui/button';
import { ChefHat } from 'lucide-react';
// import { Heart } from 'lucide-react'; // Mantendo comentado conforme solicitado

interface WelcomeProps {
  onGetStarted: () => void;
}

export function Welcome({ onGetStarted }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ChefHat className="h-12 w-12 text-warm-orange" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Mistura Acolhe
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Sistema completo de gestão para projetos sociais. 
            Gerencie famílias, organize ações solidárias e coordene voluntários 
            de forma eficiente e organizada.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ChefHat className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Gestão de Famílias</h3>
            <p className="text-white/80 text-sm">
              Cadastre e acompanhe famílias assistidas com informações completas e organizadas
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ChefHat className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Ações Solidárias</h3>
            <p className="text-white/80 text-sm">
              Planeje e execute ações de distribuição de alimentos e outras atividades
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ChefHat className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Voluntários</h3>
            <p className="text-white/80 text-sm">
              Organize sua equipe de voluntários e acompanhe a participação em ações
            </p>
          </div>
        </div>

        <Button 
          onClick={onGetStarted}
          size="lg"
          className="bg-white text-warm-orange hover:bg-white/90 font-semibold px-8 py-3 text-lg"
        >
          Começar Agora
        </Button>

        <div className="mt-8 text-white/70 text-sm">
          <p>Transformando vidas através da organização e solidariedade</p>
        </div>
      </div>
    </div>
  );
}
