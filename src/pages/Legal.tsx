import { ReactNode } from 'react';
import { MisturaLogo } from '@/components/ui/MisturaLogo';

function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-hero text-white">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <MisturaLogo className="h-20 w-auto mb-4" />
          <h1 className="text-3xl font-extrabold">{title}</h1>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6 leading-relaxed">
        {children}
        <p className="pt-6 text-sm text-muted-foreground">
          <a href="/" className="text-primary underline">Voltar ao início</a>
        </p>
      </main>
    </div>
  );
}

export function Privacy() {
  return (
    <LegalLayout title="Política de Privacidade">
      <p className="text-sm text-muted-foreground">Última atualização: novembro de 2026</p>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">Quem somos</h2>
        <p>
          O Projeto Mistura é uma iniciativa social. Este sistema é usado para organizar o cadastro
          de famílias atendidas, as ações realizadas, as doações e as equipes de voluntários.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">Quais dados coletamos</h2>
        <p>
          Ao entrar com a conta Google, recebemos apenas o seu nome, o seu endereço de e-mail e o
          identificador da conta. Não temos acesso à sua senha do Google, aos seus e-mails, contatos,
          arquivos ou qualquer outro dado da sua conta.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">Como usamos os dados</h2>
        <p>
          Usamos o nome e o e-mail somente para identificar você no sistema, liberar o acesso de
          voluntário e registrar a sua participação nas ações do projeto. Não vendemos nem
          compartilhamos esses dados com terceiros para fins comerciais.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">Armazenamento e segurança</h2>
        <p>
          Os dados ficam em banco de dados com acesso restrito e conexão criptografada. O acesso às
          informações é limitado à coordenação do projeto.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">Seus direitos</h2>
        <p>
          Você pode solicitar a consulta, a correção ou a exclusão dos seus dados a qualquer momento,
          entrando em contato com a coordenação do projeto pelo e-mail marianecarvalhoesteves@gmail.com.
        </p>
      </section>
    </LegalLayout>
  );
}

export function Terms() {
  return (
    <LegalLayout title="Termos de Serviço">
      <p className="text-sm text-muted-foreground">Última atualização: novembro de 2026</p>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">Uso do sistema</h2>
        <p>
          Este sistema é destinado à coordenação e aos voluntários do Projeto Mistura. O acesso serve
          exclusivamente para apoiar as atividades sociais do projeto.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">Responsabilidades</h2>
        <p>
          Quem acessa o sistema se compromete a manter a confidencialidade das informações das
          famílias atendidas e a não usá-las para outras finalidades.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">Alterações e encerramento</h2>
        <p>
          A coordenação pode alterar estes termos e suspender o acesso de qualquer usuário que não
          os respeite.
        </p>
      </section>
    </LegalLayout>
  );
}
