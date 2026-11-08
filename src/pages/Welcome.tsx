
import { Button } from '@/components/ui/button';
import { Heart, Users, Calendar, ArrowRight } from 'lucide-react';
import { MisturaLogo } from '@/components/ui/MisturaLogo';

interface WelcomeProps {
  onGetStarted: () => void;
}

const features = [
  { icon: Users, title: 'Famílias', description: 'Gerencie e acompanhe' },
  { icon: Calendar, title: 'Ações', description: 'Organize eventos' },
  { icon: Heart, title: 'Voluntários', description: 'Coordene equipes' },
];

export function Welcome({ onGetStarted }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Topo laranja com onda */}
      <section className="bg-hero relative text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-20 sm:pb-28">
          <MisturaLogo className="h-20 sm:h-28 w-auto mb-6 sm:mb-8" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Conectando pessoas,<br />ações e solidariedade.
          </h1>
          <p className="text-base sm:text-lg md:text-xl mt-3 leading-snug font-medium text-white/90">
            Gestão integrada para projetos sociais.
          </p>
          <span className="block mt-4 sm:mt-5 h-1 w-28 sm:w-40 rounded-full bg-white/80" />
        </div>
        <svg
          className="absolute bottom-0 left-0 w-full h-14 fill-background"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 70C240 118 480 24 720 54C960 84 1200 112 1440 40V120H0Z" />
        </svg>
      </section>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 space-y-6 sm:space-y-8">
        {/* Missão */}
        <div className="flex items-center gap-3.5 sm:gap-4 rounded-2xl border bg-secondary/60 p-4 sm:p-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-secondary flex items-center justify-center">
            <Heart className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold">Nossa missão</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Transformando vidas através da organização e tecnologia
            </p>
          </div>
        </div>

        {/* Funcionalidades */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl border bg-card p-4 sm:p-5 text-center shadow-xs">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-2.5 sm:mb-3">
                <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <h3 className="font-bold text-sm sm:text-base">{title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="w-full sm:w-auto rounded-2xl px-8 sm:px-10 h-12 sm:h-14 text-base sm:text-lg font-semibold shadow-md group"
          >
            Começar Agora
            <ArrowRight className="ml-1.5 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </main>
    </div>
  );
}
