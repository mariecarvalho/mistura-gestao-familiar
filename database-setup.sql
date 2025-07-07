
-- Tabela de usuários para autenticação
CREATE TABLE public.users (
    id bigserial NOT NULL,
    name varchar(255) NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    password_hash varchar(255) NOT NULL,
    role varchar(50) DEFAULT 'volunteer' CHECK (role IN ('admin', 'volunteer')),
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Tabela de sessões para controle de tokens
CREATE TABLE public.user_sessions (
    id bigserial NOT NULL,
    user_id bigint NOT NULL,
    token_hash varchar(255) NOT NULL,
    expires_at timestamp NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_sessions_pkey PRIMARY KEY (id),
    CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_user_sessions_token ON public.user_sessions(token_hash);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires ON public.user_sessions(expires_at);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para users
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir usuário admin padrão (senha: admin123)
-- IMPORTANTE: Altere esta senha após o primeiro login!
INSERT INTO public.users (name, email, password_hash, role) 
VALUES (
    'Administrador', 
    'admin@misturaacolhe.com', 
    '$2b$12$LQv3c1yqBw7LV5N7aPJqY.Rf5rN9i9GI7rK8j7L6N7.Rf5rN9i9GI7',  -- senha: admin123
    'admin'
);
