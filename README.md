# 🍔 Sanduíche do Chefe - Sistema de Pedidos Online

Sistema de pedidos online moderno e intuitivo para lanchonete/restaurante, desenvolvido com as melhores práticas de UX/UI do mercado.

![Status](https://img.shields.io/badge/status-production%20ready-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Sobre o Projeto

Aplicação web progressiva (PWA) que permite aos clientes:
- Navegar pelo cardápio completo de forma intuitiva
- Adicionar itens ao carrinho com customizações
- Escolher tamanhos (pizzas têm opções Grande/Família)
- Finalizar pedidos via WhatsApp
- Funcionar offline com Service Worker

## ✨ Características

### Design Premium
- 🎨 Design system consistente baseado em psicologia das cores
- 🎭 Animações suaves e micro-interações
- 📱 Responsivo (Mobile First)
- ♿ Acessibilidade WCAG AA+
- 🚀 Performance otimizada (60 FPS)

### Experiência do Usuário
- 🔍 Filtros de categoria intuitivos
- 🛒 Carrinho flutuante com feedback visual
- 📦 Modal de produto estilo iFood/Rappi
- ✅ Feedback imediato em todas as ações
- 🎯 Fluxo de compra sem fricção

### Funcionalidades
- 📋 Cardápio completo com categorias
- 🍕 Seleção de tamanhos para pizzas
- 🔢 Controle de quantidade
- 💰 Cálculo automático de totais
- 📱 Integração com WhatsApp
- 💾 Persistência no localStorage
- 🔄 Service Worker para cache

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS + Shadcn/ui
- **UI Components**: Radix UI
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod
- **State**: Context API
- **Icons**: Lucide React

## 📦 Instalação

```bash
# Clone o repositório
git clone <repository-url>

# Entre na pasta do projeto
cd sanduiche-chefe

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🚀 Deploy

O projeto está configurado para deploy automático em:
- **Vercel** (recomendado)
- **Netlify**
- **Railway**

Arquivos de configuração incluídos:
- `vercel.json`
- `netlify.toml`
- `railway.toml`

## 📱 PWA

O app funciona como Progressive Web App:
- ✅ Instalável no dispositivo
- ✅ Funciona offline
- ✅ Cache inteligente
- ✅ Atualizações automáticas

## 🎨 Design System

### Paleta de Cores
- **Primary**: Laranja (#FF6B00) - Estimula apetite
- **Secondary**: Verde (#2E7D32) - Frescor e confiança
- **Neutros**: Escala de cinza para hierarquia

### Tipografia
- **Display**: Bebas Neue (títulos)
- **Body**: Inter (textos)

### Componentes
- ProductCard - Cards de produtos
- ProductDetailModal - Modal de customização
- CartModal - Carrinho de compras
- FloatingCart - Botão flutuante
- CategoryFilter - Filtro de categorias
- EmptyState - Estados vazios
- SkeletonCard - Loading states
- Toast - Notificações

## 📊 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base (Shadcn)
│   ├── checkout/       # Componentes de checkout
│   └── ...             # Componentes principais
├── contexts/           # Context API
├── data/              # Dados do cardápio
├── hooks/             # Custom hooks
├── pages/             # Páginas
├── styles/            # Estilos globais
├── types/             # TypeScript types
└── utils/             # Funções utilitárias
```

## 🔧 Configuração

### WhatsApp
Atualize o número no arquivo `src/hooks/useCheckoutForm.ts`:
```typescript
const whatsappNumber = '5585991993833'; // Seu número
```

### Informações de Contato
Atualize em `src/components/Header.tsx` e `src/components/Footer.tsx`

### Cardápio
Edite `src/data/menuData.ts` para adicionar/remover produtos

## 📈 Performance

- ⚡ First Contentful Paint: < 1.5s
- ⚡ Time to Interactive: < 3.5s
- ⚡ Lighthouse Score: 95+
- ⚡ 60 FPS constante

## ♿ Acessibilidade

- ✅ Navegação por teclado completa
- ✅ ARIA labels em todos os elementos
- ✅ Contraste WCAG AA+
- ✅ Screen readers compatíveis
- ✅ Focus states visíveis

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Desenvolvedor

**By RonalDigital**

- Website: [ronaldigital.com](https://ronaldigital.com)
- Email: contato@ronaldigital.com

---

## 🎯 Roadmap

### Fase 2
- [ ] Sistema de favoritos
- [ ] Histórico de pedidos
- [ ] Busca de produtos
- [ ] Imagens reais dos produtos

### Fase 3
- [ ] Avaliações de produtos
- [ ] Cupons de desconto
- [ ] Programa de fidelidade
- [ ] Gamificação

### Fase 4
- [ ] Compartilhamento social
- [ ] Fotos de clientes
- [ ] Indicação de amigos
- [ ] Push notifications

---

**Desenvolvido com 💻 e ☕ por RonalDigital**
