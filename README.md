# Portfolio Premium de Desenvolvedor Fullstack

Este é um portfolio de altíssimo nível, denso, moderno e responsivo, desenvolvido com foco em conversão comercial e atração de clientes que buscam velocidade de entrega e qualidade premium de código.

## 🚀 Tecnologias Principais

- **Framework**: Next.js 16 (App Router)
- **Estilização**: Tailwind CSS v4 + Framer Motion (animações fluidas e micro-interações)
- **Tipografia**: Bricolage Grotesque (Títulos) e Plus Jakarta Sans (Texto base)
- **Formulários e Validação**: React Hook Form + Zod (com tratamento e validação de dados no cliente e no servidor)
- **Ícones**: Lucide React

## 🎨 Design System

O visual do site foi estruturado sobre um tema escuro padrão (`dark`), combinando fundos em tons profundos de cinza/preto (`#0A0A0B` / `#0D0E10`) com detalhes vibrantes em **Lime Neon (`#BFFF00`)** atuando como cor principal de destaque (`accent`).
Não são utilizados gradientes roxos genéricos ou layouts simples de coluna única, mas sim grades complexas (bento-grids), linhas de contorno sutis e glows interativos nas bordas.

## 📁 Estrutura do Projeto

```text
client/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts         # Handler de validação e processamento de contato (Zod)
│   ├── contact/
│   │   └── page.tsx             # Formulário de contato validado
│   ├── projects/
│   │   ├── [slug]/
│   │   │   └── page.tsx         # Detalhes e estudo de caso estático de cada projeto
│   │   └── page.tsx             # Vitrine de projetos com filtros dinâmicos
│   ├── globals.css              # Estilos globais e configurações de temas/tokens Tailwind v4
│   ├── layout.tsx               # Configuração de fontes, metadados globais e estrutura básica
│   ├── page.tsx                 # Landing page principal (Hero, Métricas, Especialidades, FAQ, CTA)
│   ├── robots.ts                # Configuração dinâmica para robôs de busca (SEO)
│   └── sitemap.ts               # Sitemap dinâmico incluindo caminhos estáticos e dinâmicos (SEO)
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # Navbar flutuante com blur e status de disponibilidade
│   │   ├── MobileMenu.tsx       # Menu mobile com animações Framer Motion
│   │   └── Footer.tsx           # Rodapé premium com SLA de resposta rápida
│   └── ui/                      # Componentes de base (Card, Badge, Button, GridPattern, AnimatedSection)
├── config/
│   └── site.ts                  # Arquivo de configuração central do portfólio (única fonte de verdade)
├── lib/
│   └── projects.ts              # Base de dados tipada dos projetos reais do CV
├── public/
│   └── projects/                # Mockups e imagens estáticas dos projetos (Conexa, GR5, TUM)
└── tsconfig.json                # Configurações TypeScript estritas
```

## 🛠️ Como Executar Localmente

### 1. Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado (recomendado v20+) e o gerenciador de pacotes `pnpm` (caso não possua, instale globalmente via `npm i -g pnpm`).

### 2. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo de ambiente e altere conforme necessário:
```bash
cp .env.example .env.local
```

### 3. Instalar Dependências
```bash
pnpm install
```

### 4. Executar Servidor de Desenvolvimento
```bash
pnpm run dev
```
O projeto estará rodando localmente em [http://localhost:3000](http://localhost:3000).

---

## 🧪 Validação de Qualidade e Compilação

Para garantir que o código esteja livre de erros de tipagem, lint ou falhas de empacotamento antes de subir para produção, execute os scripts a seguir:

- **Validação de Tipagem (TypeScript)**:
  ```bash
  pnpm run typecheck
  ```
- **Validação de Boas Práticas (ESLint)**:
  ```bash
  pnpm run lint
  ```
- **Compilação de Produção (Next.js)**:
  ```bash
  pnpm run build
  ```

---

## ☁️ Guia de Deploy no Vercel

O site foi otimizado para deploy instantâneo na plataforma **Vercel** usando as rotas estáticas pré-geradas por `generateStaticParams()` para os estudos de caso de projetos:

1. Importe o repositório GitHub no painel da Vercel.
2. Nas configurações do projeto, defina o diretório raiz como `client` (ou deixe que a Vercel detecte automaticamente).
3. Adicione a variável de ambiente `NEXT_PUBLIC_SITE_URL` apontando para o seu domínio final para garantir a geração correta do sitemap em produção.
4. Clique em **Deploy**. A compilação e deploy ocorrerão automaticamente a cada novo push no repositório.
