# Sistema de Ocorrências de Transporte - Visão Geral do Projeto

## 📊 Resumo

Este é um sistema completo de gerenciamento de ocorrências de transporte desenvolvido com Next.js 14 e TypeScript, integrado com Google Sheets para armazenamento e sincronização de dados em tempo real.

## 🎯 Objetivo

Criar uma aplicação web moderna que permita:
- Visualizar ocorrências de transporte de forma organizada
- Criar, editar e deletar ocorrências
- Sincronizar automaticamente com Google Sheets
- Ter uma interface intuitiva e responsiva

## 🏗️ Arquitetura

### Frontend (Next.js 14 + React)
```
Cliente → Next.js App Router → API Routes → Google Sheets API
```

### Fluxo de Dados

1. **Leitura (GET)**:
   - Usuário acessa a página
   - Componente React faz fetch para `/api/occurrences`
   - API Route chama Google Sheets Service
   - Dados retornam e são exibidos em cards

2. **Criação (POST)**:
   - Usuário preenche modal
   - Submit dispara POST para `/api/occurrences`
   - Dados são adicionados ao Google Sheets
   - Lista é atualizada automaticamente

3. **Edição (PUT)**:
   - Usuário clica em Editar
   - Modal abre com dados preenchidos
   - Submit dispara PUT para `/api/occurrences/[id]`
   - Linha específica é atualizada no Google Sheets

4. **Exclusão (DELETE)**:
   - Usuário confirma exclusão
   - DELETE é enviado para `/api/occurrences/[id]`
   - Linha é removida do Google Sheets

## 🔧 Tecnologias Utilizadas

### Core
- **Next.js 14**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **React 18**: Biblioteca UI

### Estilização
- **Tailwind CSS**: Framework CSS utility-first
- **Lucide React**: Ícones modernos

### Integração
- **Google Sheets API (googleapis)**: Comunicação com planilhas
- **Google Auth**: Autenticação com conta de serviço

### Desenvolvimento
- **PostCSS**: Processamento CSS
- **Autoprefixer**: Compatibilidade CSS cross-browser

## 📁 Estrutura de Arquivos Detalhada

```
nextjs-google-sheets-occurrences/
│
├── app/                                # App Router (Next.js 14)
│   ├── api/                           # API Routes
│   │   └── occurrences/
│   │       ├── route.ts               # GET (listar) e POST (criar)
│   │       └── [id]/
│   │           └── route.ts           # PUT (atualizar) e DELETE (deletar)
│   │
│   ├── globals.css                    # Estilos globais + Tailwind
│   ├── layout.tsx                     # Layout raiz da aplicação
│   └── page.tsx                       # Página principal (Home)
│
├── components/                        # Componentes React
│   ├── OccurrenceCard.tsx            # Card individual de ocorrência
│   ├── OccurrenceModal.tsx           # Modal de criar/editar
│   └── Stats.tsx                      # Estatísticas (dashboard)
│
├── lib/                               # Utilitários
│   └── googleSheets.ts               # Serviço do Google Sheets API
│
├── types/                             # Definições TypeScript
│   └── occurrence.ts                  # Tipo Occurrence + constantes
│
├── .env.example                       # Template de variáveis de ambiente
├── .env.local                         # Suas credenciais (criar manualmente)
├── .gitignore                         # Arquivos ignorados pelo Git
├── next.config.js                     # Configuração do Next.js
├── package.json                       # Dependências e scripts
├── postcss.config.js                  # Configuração do PostCSS
├── tailwind.config.js                 # Configuração do Tailwind
├── tsconfig.json                      # Configuração do TypeScript
├── README.md                          # Documentação principal
└── SETUP_GUIDE.md                    # Guia de configuração passo a passo
```

## 🔐 Segurança

### Variáveis de Ambiente
Todas as credenciais sensíveis são armazenadas em `.env.local`:
- `GOOGLE_SHEET_ID`: ID público da planilha
- `GOOGLE_CLIENT_EMAIL`: Email da conta de serviço
- `GOOGLE_PRIVATE_KEY`: Chave privada (nunca expor!)

### API Routes (Server-Side)
- As chamadas ao Google Sheets são feitas **apenas no servidor**
- O cliente nunca tem acesso às credenciais
- Proteção contra CORS e exposição de dados sensíveis

### Conta de Serviço
- Acesso limitado apenas à planilha específica
- Permissões granulares (apenas Editor)
- Chave pode ser revogada a qualquer momento

## 🎨 Interface do Usuário

### Componentes Principais

#### 1. **Header**
- Logo e título
- Botão "Nova Ocorrência"
- Botão "Atualizar" (refresh)

#### 2. **Stats (Dashboard)**
- Total de ocorrências
- Pendentes (amarelo)
- Em Andamento (azul)
- Resolvidos (verde)

#### 3. **Grid de Cards**
- Layout responsivo (1-2-3 colunas)
- Cada card mostra:
  - Nota Fiscal
  - Status (badge colorido)
  - Cliente
  - Transportadora
  - Destino
  - Data da Ocorrência
  - Tracking
  - Pendência
  - Descrição
  - Botões Editar/Deletar

#### 4. **Modal de Criar/Editar**
- Formulário completo com todos os campos
- Campos agrupados por categoria:
  - Informações Principais
  - Datas
  - Partes Envolvidas
  - Localização
  - Status e Rastreamento
  - Descrições
- Validação de campos obrigatórios

### Design System

**Cores Principais**:
- Azul (`blue-600`): Ações primárias
- Verde (`emerald-600`): Sucesso/Resolvido
- Amarelo (`amber-600`): Atenção/Pendente
- Vermelho (`red-600`): Erro/Cancelado

**Espaçamento**:
- Padding: `p-4`, `p-6`
- Gap: `gap-3`, `gap-4`, `gap-6`
- Margin: `mb-4`, `mt-6`

**Tipografia**:
- Títulos: `text-2xl`, `text-3xl`, `font-bold`
- Subtítulos: `text-lg`, `font-semibold`
- Corpo: `text-sm`, `text-base`

## 🔄 Fluxo de Desenvolvimento

### 1. Configuração Inicial
```bash
npm install
cp .env.example .env.local
# Editar .env.local com suas credenciais
```

### 2. Desenvolvimento
```bash
npm run dev
# Acesse http://localhost:3000
```

### 3. Build para Produção
```bash
npm run build
npm start
```

### 4. Deploy
- Vercel (recomendado)
- Netlify
- AWS
- Google Cloud

## 📊 Estrutura do Google Sheets

### Colunas (A-S)

| Coluna | Campo | Tipo | Obrigatório |
|--------|-------|------|-------------|
| A | Nota | string | Sim |
| B | Volumes | string/number | Não |
| C | Tipo | string | Não |
| D | Solicitante | string | Não |
| E | Data Nota | date | Não |
| F | Data Ocorrência | date | Não |
| G | Transportadora | string | Não |
| H | Cliente | string | Não |
| I | Destino | string | Não |
| J | Estado | string (UF) | Não |
| K | Pedido | string | Não |
| L | Ocorrência | text | Não |
| M | Última Ocorrência | date | Não |
| N | Status Cliente | string | Não |
| O | Status Transportadora | string | Não |
| P | Tracking | string | Não |
| Q | Obs | text | Não |
| R | Pendência | text | Não |
| S | Status | enum | Sim |

### Status Válidos
- `Pendente`
- `Em Andamento`
- `Resolvido`
- `Cancelado`

## 🚀 Possíveis Melhorias Futuras

### Funcionalidades
- [ ] Filtros avançados (por status, cliente, data)
- [ ] Busca em tempo real
- [ ] Exportação para PDF/Excel
- [ ] Histórico de alterações
- [ ] Notificações por email
- [ ] Dashboard com gráficos
- [ ] Anexar arquivos (fotos, documentos)
- [ ] Comentários por ocorrência
- [ ] Sistema de usuários/permissões

### Técnicas
- [ ] Implementar cache (React Query)
- [ ] Adicionar testes (Jest, Testing Library)
- [ ] Implementar loading states
- [ ] Adicionar toast notifications
- [ ] Implementar modo offline
- [ ] Adicionar paginação
- [ ] Otimização de performance
- [ ] SEO e meta tags

### UX/UI
- [ ] Tema escuro
- [ ] Animações de transição
- [ ] Skeleton loaders
- [ ] Drag and drop para reordenar
- [ ] Modo de visualização compacta/expandida
- [ ] Impressão otimizada

## 🐛 Debug e Logs

### Logs no Console
```typescript
console.log('Dados recebidos:', data);
console.error('Erro ao buscar:', error);
```

### Verificar Requisições
- Abra DevTools (F12)
- Vá na aba Network
- Filtre por "Fetch/XHR"
- Analise as requisições para `/api/occurrences`

### Verificar Google Sheets
- Abra a planilha manualmente
- Verifique se os dados estão sendo salvos/atualizados
- Confirme as permissões da conta de serviço

## 📞 Suporte

### Problemas Comuns

**Erro 400**: Dados inválidos enviados
- Verifique o formato dos dados
- Confirme campos obrigatórios

**Erro 403**: Sem permissão
- Verifique compartilhamento da planilha
- Confirme credenciais da conta de serviço

**Erro 500**: Erro no servidor
- Verifique logs do servidor
- Confirme variáveis de ambiente

## 📚 Recursos de Aprendizado

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Sheets API Guide](https://developers.google.com/sheets/api)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---
ocorrencias@ocorrencias-transporte.iam.gserviceaccount.com
✨ **Projeto pronto para uso!** Siga o SETUP_GUIDE.md para começar.
