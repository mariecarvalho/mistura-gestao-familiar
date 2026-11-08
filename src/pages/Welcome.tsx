
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
        <div className="max-w-3xl mx-auto px-6 pt-10 pb-28">
          <MisturaLogo className="h-28 w-auto mb-8" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Conectando pessoas,<br />ações e solidariedade.
          </h1>
          <p className="text-lg md:text-xl mt-3 leading-snug font-medium text-white/90">
            Gestão integrada para projetos sociais.
          </p>
          <span className="block mt-5 h-1 w-40 rounded-full bg-white/80" />
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

      <main className="max-w-3xl mx-auto px-6 pb-16 space-y-8">
        {/* Missão */}
        <div className="flex items-center gap-4 rounded-2xl border bg-secondary/60 p-5">
          <div className="w-14 h-14 shrink-0 rounded-full bg-secondary flex items-center justify-center">
            <Heart className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Nossa missão</h2>
            <p className="text-muted-foreground">
              Transformando vidas através da organização e tecnologia
            </p>
          </div>
        </div>

        {/* Funcionalidades */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl border bg-card p-5 text-center shadow-sm">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="rounded-2xl px-10 h-14 text-lg font-semibold shadow-lg group"
          >
            Começar Agora
            <ArrowRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </main>
    </div>
  );
}
