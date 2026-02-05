# Projeto Profissional – Front-End
Processo Seletivo – Analista de Tecnologia da Informação  
Perfil: Engenheiro da Computação (Sênior)

## Dados do Candidato
- Nome: Arthur Siqueira da Silva Correia
- Projeto escolhido: Front-End
- Repositório: https://github.com/correiarthur/arthursiqueiradasilvacorreia055112

---

## Objetivo do Projeto
Implementar uma aplicação SPA em **React + TypeScript**, focada em alta performance, código limpo e experiência do usuário premium, conforme as especificações do edital.

A aplicação consome a API de gestão de Pets e Tutores, oferecendo um sistema completo de gerenciamento com fluxos de trabalho otimizados.

---

## Tecnologias Utilizadas
- **React 18** + **Vite**: Base da aplicação para alta performance e desenvolvimento ágil.
- **TypeScript**: Tipagem estática para maior segurança e manutenção do código.
- **Tailwind CSS**: Estilização moderna e responsiva baseada em utilitários.
- **Shadcn UI**: Biblioteca de componentes acessíveis e altamente personalizáveis.
- **RxJS**: Gerenciamento de estado reativo utilizando o padrão **Facade**.
- **React Router Dom**: Gerenciamento de rotas SPA, incluindo proteção de rotas privadas.
- **React Hook Form**: Gestão de formulários e validações.
- **Axios**: Cliente HTTP com interceptores para tratamento de autenticação (JWT) e refresh tokens.
- **Lucide React**: Conjunto de ícones premium.
- **Sonner**: Sistema de notificações (Toasts) informativo.
- **Framer Motion**: Micro-animações e transições de página.
- **Vitest** + **React Testing Library**: Infraestrutura para testes unitários e de integração para garantir a estabilidade do código.

---

## Funcionalidades Implementadas
- **Autenticação Segura**: Login completo com tokens JWT, proteção de rotas e sistema de renovação de token (Refresh Token) automático.
- **Gestão de Pets**:
    - Listagem em grade responsiva com cartões detalhados.
    - Busca em tempo real com Debounce.
    - Paginação inteligente (10 itens por página).
    - Cadastro/Edição com upload de fotos.
    - Fluxo de exclusão com modal de confirmação (Shadcn Dialog).
- **Gestão de Tutores**:
    - Listagem completa e busca por nome.
    - **Formulário Multi-etapas**: Cadastro de dados básicos seguido de gestão de vínculos.
    - **Catálogo de Vínculos**: Sistema para associar ou desassociar pets a tutores em tempo real diretamente no catálogo.
- **Experiência do Usuário (UX)**:
    - **Skeleton Loaders**: Carregamento visual agradável enquanto os dados são buscados.
    - **Feedback em tempo real**: Validações de CPF, máscaras de campos (Telefone) e notificações de sucesso/erro.
    - **Navegação Moderna**: Navbar fixa e otimizada para desktops e dispositivos móveis.
- **Arquitetura de Software**:
    - Padrão **Facade** para separação de responsabilidades.
    - Uso de **Observables** para um estado global reativo e sincronizado.
- **Qualidade de Código**:
    - **Testes Unitários**: Implementação de testes automatizados para validação de lógica de negócio e utilitários críticos.

---

## Estrutura do Projeto
```text
src/
├── components/     # Componentes de UI e blocos reutilizáveis
├── facades/        # Lógica de negócio e gestão de estado (Padrão Facade)
├── hooks/          # Hooks customizados (Ex: useObservable, useDebounce)
├── lib/            # Utilitários e configurações (Ex: Axios, Utils)
├── pages/          # Componentes de página (Views)
├── services/       # Comunicação direta com a API
└── types/          # Definições de interfaces TypeScript
```

---

## Como Executar e Testar

### Execução via Docker (Imagem Compactada)

A aplicação foi empacotada em uma imagem Docker para garantir o isolamento total das dependências e facilidade de teste.

#### 1. Carregar a Imagem
A partir do arquivo `.tar` fornecido, carregue a imagem no seu ambiente Docker local:
```bash
docker load -i amigofiel-imagem.tar
```

#### 2. Executar o Container
Após carregar, inicie o container mapeando a porta local:
```bash
docker run -d -p 8080:80 --name amigofiel-app amigofiel-frontend
```

#### 3. Acessar a Aplicação
A aplicação estará disponível através do navegador em:
`http://localhost:8080`

---

### Desenvolvimento (Opcional)

Caso deseje reconstruir a imagem ou rodar em ambiente de desenvolvimento:

#### 1. Build da Imagem
```bash
docker build -t amigofiel-frontend .
```

#### 2. Rodar localmente (Node.js)
```bash
npm install
npm run dev
```

### Execução de Testes Unitários
Para rodar os testes unitários e validar a integridade do sistema:
```bash
npm run test
```

---

*Arthur Siqueira da Silva Correia*
