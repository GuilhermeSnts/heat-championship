# 🏎️ Campeonato de Heat

Aplicação web para gerenciar um campeonato familiar do jogo de tabuleiro **Heat: Pedal to the Metal**.

## 🚀 Tecnologias

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Firebase** (Authentication + Firestore)

## 📋 Funcionalidades

### Área Pública
- Classificação completa estilo Brasileirão
- Pódio com os 3 primeiros colocados
- Estatísticas gerais do campeonato
- Histórico de partidas (expansível)
- Página individual de cada jogador com desempenho detalhado

### Área Administrativa (protegida por login)
- Dashboard com visão geral
- Gerenciamento de jogadores (criar, editar, ativar/desativar)
- Registro e edição de partidas
- Cálculo automático de pontuação
- Sistema de ordenação de chegada interativo

### Sistema de Pontuação
- 1º lugar: 25 pts
- 2º lugar: 18 pts
- 3º lugar: 15 pts
- 4º lugar: 12 pts
- 5º lugar: 10 pts
- 6º lugar: 8 pts

### Regra de Elegibilidade
Jogadores precisam participar de pelo menos **2/3 das partidas** (arredondado para cima) para serem considerados **OFICIAIS**. Abaixo disso, aparecem como **PROVISÓRIOS**.

## 🔧 Configuração

### 1. Criar projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Ative o **Firestore Database** (modo produção ou teste)
4. Ative o **Authentication** com o provedor **Email/Senha**

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com as credenciais do seu projeto Firebase:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:...
```

### 3. Configurar Firestore Security Rules

Copie o conteúdo do arquivo `firestore.rules` para a aba **Rules** no console do Firestore e publique.

### 4. Criar o primeiro administrador

1. No console do Firebase, vá em **Authentication** e adicione um usuário com email/senha
2. Copie o **UID** do usuário criado
3. No console do Firestore, crie um documento na coleção `users` com:

```
ID do documento: <UID do usuário>
Campos:
  id: "<UID do usuário>"
  name: "Admin"
  email: "admin@exemplo.com"
  role: "admin"
  createdAt: <timestamp>
```

### 5. Rodar localmente

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

## 🚀 Deploy

### Vercel (recomendado)

1. Conecte o repositório no [Vercel](https://vercel.com)
2. Configure as mesmas variáveis de ambiente em Settings → Environment Variables
3. Deploy automático!

### Outros

A aplicação pode ser hospedada em qualquer plataforma que suporte Next.js.

## 📁 Estrutura do Projeto

```
src/
  app/
    page.tsx                  # Página pública (classificação)
    layout.tsx                # Layout raiz
    login/
      page.tsx                # Login administrativo
    jogador/
      [id]/
        page.tsx              # Detalhes do jogador
    admin/
      page.tsx                # Dashboard administrativo
      jogadores/
        page.tsx              # Gerenciar jogadores
      partidas/
        page.tsx              # Gerenciar partidas
  components/
    AuthProvider.tsx          # Contexto de autenticação
    AdminGuard.tsx            # Guarda de rota admin
    Navbar.tsx                # Barra de navegação
    StandingsTable.tsx        # Tabela de classificação
    Podium.tsx                # Pódio visual
    RaceCard.tsx              # Card de partida
    RaceForm.tsx              # Formulário de partida
    PlayerForm.tsx            # Formulário de jogador
  lib/
    firebase.ts               # Configuração Firebase
    firestore.ts              # Operações Firestore
    standings.ts              # Cálculo da classificação
    types.ts                  # Tipos TypeScript
```

## 🔒 Segurança

- Firebase Authentication para login administrativo
- Firestore Security Rules para controle de acesso
- Variáveis de ambiente para credenciais
- Verificação de admin via documento Firestore

## 📝 Licença

Projeto de uso familiar. Sinta-se livre para adaptar.
