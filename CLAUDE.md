# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Environment Setup

Set `GEMINI_API_KEY` in `.env.local` for AI-powered financial tips feature.

## Architecture

**ContaComigo** is a gamified financial management SaaS built with Next.js 16 App Router and React 19. Portuguese language interface.

### Core Structure

- `app/` - Next.js App Router pages and API routes
  - `page.tsx` - Main dashboard with tab-based navigation (Home, Missions, Progress, Community, Profile)
  - `login/page.tsx` - Static authentication page
  - `setup/page.tsx` - First-time user profile setup (avatar + username selection)
  - `api/gemini/route.ts` - Server-side Gemini AI endpoint for financial tips
- `components/` - React client components
  - `Dashboard.tsx` - Home view with stats, AI tips, missions
  - `Sidebar.tsx` - Navigation with user avatar and level progress
  - `MissionsView.tsx` - Daily and path missions
  - `ProgressView.tsx` - Charts and analytics (Recharts)
  - `CommunityView.tsx` - Social feed with achievements
  - `ProfileView.tsx` - User profile, badges, settings
  - `Providers.tsx` - Context providers wrapper (client component)
- `lib/` - Shared utilities, types, and context
  - `auth-context.tsx` - Authentication state with localStorage persistence
  - `types.ts` - TypeScript enums (AppTab) and interfaces (User, Mission, Badge, CommunityPost)
  - `constants.ts` - Color scheme (COLORS), navigation items, mock data (MOCK_USER, MOCK_MISSIONS, MOCK_COMMUNITY)

## Authentication System

**Static credentials (hardcoded for demo):**
```
Email: usuario@contacomigo.com
Password: 123456
```

**Auth Flow:**
1. User visits `/` → redirected to `/login` if not authenticated
2. After login → redirected to `/setup` if profile not configured
3. Setup page: user chooses avatar (10 options) and @username
4. After setup → redirected to main dashboard `/`

**LocalStorage keys:**
- `contacomigo_auth` - Boolean string for auth state
- `contacomigo_profile` - JSON with UserProfile (username, displayName, avatarId, isProfileSetup)

**Auth Context (`lib/auth-context.tsx`):**
- `useAuth()` hook provides: `isAuthenticated`, `isLoading`, `userProfile`, `login()`, `logout()`, `setupProfile()`
- `AVATARS` array with 10 avatar options
- `getAvatarUrl(avatarId)` - Returns DiceBear API URL for avatar

## Avatar System

10 avatars available using DiceBear API (`api.dicebear.com/7.x/`):
1. Explorador (felix) - adventurer style
2. Guerreira (luna) - adventurer style
3. Sábio (oliver) - adventurer style
4. Mística (zara) - adventurer style
5. Herói (max) - adventurer style
6. Fada (pixie) - adventurer style
7. Ninja (shadow) - adventurer style
8. Mago (merlin) - adventurer style
9. Princesa (aurora) - adventurer style
10. Robô (cyber) - bottts style

## Gamification System

- **XP/Levels**: Users earn XP completing missions, tracking expenses
- **Streak**: Consecutive days of activity
- **Badges**: Achievements with locked/unlocked states
- **Missions**: Daily tasks and learning path modules
- **League**: Ranking system (e.g., "BRONZE II")

## Key Patterns

**State Management**: React Context for auth, useState with prop drilling for app state. All interactive components are client components (`'use client'`).

**Styling**: Tailwind CSS v4 with custom color scheme:
- Primary: `#1F7A8C` (teal)
- Secondary: `#4CAF50` (green)
- Accent: `#F4C430` (gold)
- Danger: `#E63946` (red)
- Background Light: `#F7F9FC`
- Background Dark: `#0F172A`
- Text Primary: `#0B1320`
- Text Secondary: `#6B7280`

**Responsive Design**: Mobile-first with Tailwind breakpoints. Grid changes:
- Avatar selection: 2 cols mobile, 5 cols desktop
- Use `sm:` prefix for desktop styles

**Path Alias**: `@/*` maps to root directory.

## Component Props Pattern

Components receive data and callbacks from parent:
```tsx
// Example: Sidebar receives avatar and username from auth context
<Sidebar
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  user={user}
  avatarUrl={getAvatarUrl(userProfile.avatarId)}
  username={userProfile.username}
/>
```

## Adding New Features

**New page**: Create folder in `app/` with `page.tsx` (client component with `'use client'`)

**New component**: Add to `components/`, import in page, pass props from parent

**New auth-protected route**: Check `isAuthenticated` and `userProfile?.isProfileSetup` in useEffect, redirect accordingly

**Modifying user data**: Update `User` interface in `lib/types.ts` and `MOCK_USER` in `lib/constants.ts`

---

## Session Notes

> **IMPORTANTE**: Sempre atualize esta seção com decisões, implementações e contexto relevante das conversas com o usuário.

### 2024 - Implementações Iniciais

**Autenticação e Setup de Perfil:**
- Criado sistema de autenticação estática (sem backend)
- Credenciais hardcoded: `usuario@contacomigo.com` / `123456`
- Fluxo de primeiro acesso: Login → Escolha de Avatar → Escolha de @username → Dashboard
- 10 avatares disponíveis usando DiceBear API
- Dados salvos no localStorage

### 2026-02-03 - Melhorias de Design e Responsividade

**Sidebar e Navegação Mobile:**
- Implementado sidebar deslizante funcional com transição suave (`translate-x`).
- Adicionado overlay (backdrop blur) com `bg-black/60` para foco na navegação mobile.
- Corrigido problema da sidebar "escura" garantindo opacidade branca e z-index adequado (`z-[60]`).
- Sidebar agora fecha automaticamente ao selecionar uma aba ou clicar fora.

**Correções de Layout:**
- Adicionado `overflow-x-hidden` no `html` e `body` e contêineres principais para eliminar o "arraste lateral" indesejado.
- Implementado `h-screen overflow-hidden` na estrutura principal para evitar barras de rolagem duplas.
- Ativado suavização de fontes (`antialiased`) e scroll suave.

### 2026-02-03 - Revitalização Completa do Onboarding (Login e Setup)

**Sincronização de Cores e Estética:**
- Otimizada a paleta de cores para usar o "Azul Premium" (`#1F7A8C`) em todo o fluxo inicial.
- Substituído o fundo escuro do login por uma estética limpa em `#F7F9FC` com elementos decorativos dinâmicos (blur gradients).
- Implementados cards com cantos ultra-arredondados (`rounded-[48px]`) e sombras ultra-suaves para um visual moderno e "Apple-like".

**Melhorias na Experiência do Usuário (UX):**
- **Login:** Redesenhado com foco em clareza, tipografia robusta e feedbacks visuais (animações de entrada, estados de foco premium).
- **Setup:** Grid de seleção de avatar totalmente reformulado, com cards interativos, sombras de profundidade e navegação por passos mais fluida.
- **Responsividade:** Ajustados paddings e tamanhos de cards para garantir uma experiência perfeita em qualquer tamanho de tela, mantendo a consistência visual.

**Detalhes Técnicos:**
- Adicionadas animações de entrada `animate-in fade-in slide-in-from-bottom` para um "feeling" de app nativo.
- Uso consistente de gradientes da marca (`from-[#1F7A8C] to-[#134D59]`) em botões principais.
- Refinados os campos de input com ícones dinâmicos e bordas de foco sutis.
**Responsividade Mobile:**
- Página de login otimizada para mobile
- Página de setup com grid responsivo (2 colunas mobile, 5 desktop)
- Tamanhos de fonte, padding e elementos ajustados com prefixos `sm:`
- Feedback visual em botões com `active:scale-[0.98]`
