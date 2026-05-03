# 🏗️ Arquitetura do Sistema

## 📐 Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Next.js Frontend)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Home Page   │  │ Análise/     │  │  Expedição   │      │
│  │ (Ocorrências)│  │  Dashboard   │  │  & Armazém   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌────────────────────────────────────────────────────┐     │
│  │    React Components (TypeScript)                   │     │
│  │  - Hooks (useState, useEffect, useMemo)           │     │
│  │  - Context (Theme, Global State)                  │     │
│  │  - Custom Hooks (useTransporteMetrics)            │     │
│  └────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────┐     │
│  │    UI Components (Tailwind CSS)                   │     │
│  │  - Cards, Modals, Charts, Forms                   │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┬────────┘
                                                      │
                    🌐 HTTP/HTTPS Requests
                                                      │
┌─────────────────────────────────────────────────────▼────────┐
│              API Layer (Next.js API Routes)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ /api/occurrences                │  /api/expedicao│      │
│  │ /api/transporte                 │  /api/stock   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  - GET, POST, PUT, DELETE                        (Route Handlers)
│  - Request Validation (Zod)                      (Edge Runtime)
│  - Error Handling                                (TypeScript)
└─────────────────────────────────────────────────────┬────────┘
                                                      │
                    Google Sheets API
                                                      │
┌─────────────────────────────────────────────────────▼────────┐
│              Service Layer (Google Sheets)                   │
│  ┌─────────────────────────────────────────────────────┐     │
│  │ GoogleSheetsService (Main Service)                  │     │
│  │ - Auth (Service Account)                            │     │
│  │ - CRUD Operations (Read, Write, Update, Delete)     │     │
│  │ - Column Mapping & Data Parsing                      │     │
│  │ - Error Handling & Retry Logic                       │     │
│  └─────────────────────────────────────────────────────┘     │
│  ┌─────────────────────────────────────────────────────┐     │
│  │ Specialized Services                                │     │
│  │ - ExpedicaoService (Shipping Management)            │     │
│  │ - TransporteSheetsService (Transport Tracking)      │     │
│  │ - SaldoSheetsService (Balance/Stock)                │     │
│  └─────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┬────────┘
                                                      │
                   ☁️ Google Cloud Platform
                                                      │
                    🗂️ Google Sheets Files
              (Ocorrências | Expedição | Stock)
```

---

## 🔄 Fluxo de Dados (CRUD)

### 1️⃣ **CREATE** - Criar Nova Ocorrência

```
Usuário preenche Modal
  ↓
Form submit → POST /api/occurrences
  ↓
API Route valida dados (Zod)
  ↓
Chama GoogleSheetsService.createOccurrence()
  ↓
Service autentica com Google (JWT)
  ↓
Adiciona nova linha no Google Sheets
  ↓
Retorna 201 Created + dados salvos
  ↓
Frontend atualiza lista (re-render)
  ↓
Modal fecha, toast de sucesso
```

**Tempo total:** ~500ms

---

### 2️⃣ **READ** - Listar Ocorrências

```
Usuário acessa página / useEffect executa
  ↓
fetch('/api/occurrences') → GET /api/occurrences
  ↓
API Route chama GoogleSheetsService.getAllOccurrences()
  ↓
Service autentica com Google (JWT)
  ↓
Lê todas as linhas da aba "Ocorrências"
  ↓
Mapeia colunas para modelo Occurrence
  ↓
Retorna array de ocorrências
  ↓
Frontend recebe dados
  ↓
setState(data) → re-render com cards
  ↓
Loading desaparece
```

**Tempo total:** ~200-300ms (primeira carga)
**Tempo com cache:** ~50ms

---

### 3️⃣ **UPDATE** - Editar Ocorrência

```
Usuário clica Editar no card
  ↓
Modal abre com dados preenchidos
  ↓
Usuário modifica campos
  ↓
Clica "Atualizar" → PUT /api/occurrences/row_2
  ↓
API Route valida dados
  ↓
Chama GoogleSheetsService.updateOccurrence()
  ↓
Service autentica e atualiza a linha específica
  ↓
Google Sheets atualiza em tempo real
  ↓
Retorna 200 OK + dados atualizados
  ↓
Frontend atualiza o card
  ↓
Modal fecha
```

**Tempo total:** ~500ms

---

### 4️⃣ **DELETE** - Deletar Ocorrência

```
Usuário clica Deletar
  ↓
Confirmação modal: "Tem certeza?"
  ↓
Se confirmado: DELETE /api/occurrences/row_2
  ↓
API Route autentica
  ↓
Chama GoogleSheetsService.deleteOccurrence()
  ↓
Service remove a linha do Google Sheets
  ↓
Retorna 200 OK
  ↓
Frontend remove card da tela
  ↓
Estatísticas atualizam
```

**Tempo total:** ~500ms

---

## 🗂️ Estrutura de Pastas Detalhada

### `/app` - App Router (Next.js 14)

```
app/
├── 📄 layout.tsx              (Layout raiz, providers)
├── 📄 page.tsx                (Home - Ocorrências)
├── 📄 globals.css             (Estilos globais + Tailwind)
│
├── api/                       (Endpoints da API)
│   ├── occurrences/
│   │   ├── route.ts           (GET todos, POST criar)
│   │   └── [id]/
│   │       └── route.ts       (PUT atualizar, DELETE deletar)
│   ├── transporte/
│   │   ├── route.ts           (Transportes CRUD)
│   │   └── [id]/route.ts
│   ├── expedicao/
│   │   ├── route.ts           (Expedições CRUD)
│   │   └── [id]/route.ts
│   └── stock/
│       ├── route.ts           (Produtos CRUD)
│       └── [id]/route.ts
│
├── components/                (Componentes reutilizáveis)
│   ├── Header.tsx             (Menu superior)
│   ├── Sidebar.tsx            (Menu lateral)
│   ├── Stats.tsx              (KPIs/Estatísticas)
│   ├── Dashboard.tsx          (Dashboard principal)
│   ├── OccurrenceCard.tsx     (Card de ocorrência)
│   ├── OccurrenceModal.tsx    (Modal CRUD)
│   ├── MonthlyTrendChart.tsx  (Gráfico de tendência)
│   ├── MonthlyTrendChart.tsx
│   ├── occurrence-type-chart.tsx
│   ├── occurrence-type-by-transportadora-chart.tsx
│   ├── OccurrencePDFDocument.tsx
│   ├── SearchModal.tsx
│   ├── SearchResultModal.tsx
│   ├── ThemeToggle.tsx
│   └── ...
│
├── AnaliseTransporte/         (Dashboard avançado)
│   ├── page.tsx               (Página principal)
│   └── componete/             (Componentes específicos)
│       ├── ChartCard.tsx
│       ├── ComparativoMensalModal.tsx
│       ├── EstadoChart.tsx
│       ├── KpiCard.tsx
│       ├── MiniCard.tsx
│       ├── PieStatusChart.tsx
│       ├── RankingCard.tsx
│       └── StatusChart.tsx
│
├── expedicao/                 (Sistema de expedições)
│   ├── page.tsx               (Página principal)
│   ├── schemas/
│   │   └── validations.ts     (Zod schemas)
│   ├── utils/
│   │   └── agruparPorCliente.ts
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── Filtros.tsx
│   │   ├── HeaderExpedicao.tsx
│   │   ├── ListaExpedicao.tsx
│   │   ├── Modal.tsx
│   │   ├── ModalAguardar.tsx
│   │   ├── ModalCadastrarNF.tsx
│   │   ├── ModalExpedirSelecionadas.tsx
│   │   ├── RomaneioPDF.tsx
│   │   ├── StatusCard.tsx
│   │   └── cards/
│   │       ├── CardAguardando.tsx
│   │       ├── CardExpedido.tsx
│   │       └── CardNotaDisponivel.tsx
│   └── InfoBlock.tsx
│
├── Armazem/                   (Gerenciamento de armazém)
│   ├── page.tsx               (Página principal)
│   ├── HeaderCadastro.tsx
│   ├── Input.tsx
│   ├── ProductCard.tsx
│   └── ProductModal.tsx
│
└── services/                  (Serviços e lógica)
    └── googleSheets/
        ├── auth.ts            (Autenticação JWT)
        ├── GoogleSheetsService.ts    (Serviço principal)
        ├── ExpedicaoService.ts       (Expedições)
        ├── TransporteSheetsService.ts
        ├── SaldoSheetsService.ts
        ├── columnMap.ts       (Mapeamento de colunas)
        └── helpers.ts         (Funções auxiliares)
```

### `/components` - Componentes Globais

```
components/
├── 📄 Loading.tsx             (Animação customizada)
├── 📄 ThemeProvider.tsx       (Provedor de tema)
├── 📄 ConfirmDeleteModal.tsx
├── 📄 DateInput.tsx
├── 📄 Footer.tsx
├── 📄 PdfButton.tsx
├── 📄 SelectInput.tsx
├── 📄 TextAreaInput.tsx
├── 📄 TextInput.tsx
└── ui/                        (Componentes de UI)
    ├── card.tsx              (Card reutilizável)
    └── chart.tsx             (Chart container)
```

### `/lib` - Utilitários e Hooks

```
lib/
├── useTransporteMetrics.ts    (Hook customizado para métricas)
├── formatDate.ts              (Formatação de datas)
└── utils.ts                   (Funções genéricas)
```

### `/types` - Definições TypeScript

```
types/
├── occurrence.ts              (Tipo Occurrence + constantes)
├── transporte.ts              (Tipo Transporte)
├── expedicao.ts               (Tipo Expedição)
├── stock.ts                   (Tipo Produto/Stock)
└── romaneio.ts                (Tipo Romaneio)
```

### Configuração (Root)

```
├── .env.example              (Template de variáveis)
├── .env.local                (Credenciais - NÃO COMMITAR)
├── .gitignore                (Arquivos ignorados)
├── next.config.js            (Config Next.js)
├── tailwind.config.js        (Config Tailwind)
├── tsconfig.json             (Config TypeScript)
├── components.json           (Config de componentes)
├── postcss.config.js         (Config PostCSS)
├── package.json              (Dependências)
└── pnpm-lock.yaml            (Lock file)
```

---

## 🔐 Camada de Autenticação

### JWT Service Account Flow

```
┌─────────────────┐
│  GOOGLE CLOUD   │
│  (Credenciais   │
│   JSON)         │
└────────┬────────┘
         │
         ↓
┌─────────────────────────────┐
│   app/services/google       │
│   Sheets/auth.ts            │
│                             │
│  • client_email             │
│  • private_key              │
│  • Gera JWT Token           │
│  • Válido por 1 hora        │
│  • Renovado automaticamente │
└────────┬────────────────────┘
         │
         ↓
┌─────────────────────────────┐
│   Google Sheets API         │
│   googleapis library        │
│                             │
│   • Autenticado             │
│   • Pode ler/escrever       │
│   • Reconhece permissions   │
└─────────────────────────────┘
```

---

## 💾 Armazenamento de Dados

### Google Sheets Structure

**Aba: "Ocorrências"**
```
Linha 1: Cabeçalhos (A-S)
Linha 2+: Dados das ocorrências
Máximo: ~5 milhões de linhas por aba
```

**Aba: "Expedição"** (opcional)
```
Colunas: Nota, Cliente, Volume, Status, Data
```

**Aba: "Armazém"** (opcional)
```
Colunas: SKU, Descrição, Quantidade, Transportadora, etc
```

### Mapeamento de Colunas

File: `app/services/googleSheets/columnMap.ts`

```typescript
export const OCCURRENCE_COLUMN_MAP = {
  A: 'nota',
  B: 'volumes',
  C: 'tipo',
  // ... etc
}

// Reverso para escrever dados
export const OCCURRENCE_REVERSE_MAP = {
  nota: 'A',
  volumes: 'B',
  // ... etc
}
```

---

## 🎨 Camada de Apresentação (UI)

### Design System

```
├── Colors
│   ├── Primary: Blue (#2176E6)
│   ├── Success: Green (#10B981)
│   ├── Warning: Yellow (#F59E0B)
│   ├── Error: Red (#EF4444)
│   └── Dark Mode: Gray scales
│
├── Typography
│   ├── Headings: Inter/System font
│   ├── Body: System stack
│   ├── Mono: Courier for data
│   └── Sizes: 12-36px
│
├── Spacing
│   ├── Base: 4px (Tailwind default)
│   ├── Padding: p-4, p-6
│   ├── Margin: m-4, m-6
│   └── Gap: gap-4, gap-6
│
├── Components
│   ├── Card: Shadow, rounded corners
│   ├── Button: Primary, secondary
│   ├── Modal: Overlay + dialog
│   ├── Input: Bordered, focused state
│   └── Badge: Colored labels
│
└── Breakpoints
    ├── Mobile: < 640px
    ├── Tablet: 640-1024px
    └── Desktop: > 1024px
```

---

## 📊 Fluxo de Renderização

### Page Load Sequence

```
1. Browser requests / page.tsx
           ↓
2. Layout.tsx executa
   - ThemeProvider initialization
   - Font loading
   - Meta tags
           ↓
3. page.tsx (Home) monta
   - useState inicializa estado
   - useEffect dispara fetch
   - render loading state
           ↓
4. Fetch /api/occurrences
   - API Route autenstica
   - GoogleSheetsService busca dados
   - Dados retornam
           ↓
5. setData(response)
   - De-render loading
   - Render cards com dados
   - Componentes animam
           ↓
6. User interactions
   - onClick handlers
   - Form submissions
   - Modal toggles
           ↓
7. Sync com Google Sheets
   - POST/PUT/DELETE requests
   - Planilha atualiza
   - UI reflete mudanças
```

---

## 🚀 Performance Otimizações

### Frontend

```
✅ Code Splitting
   - Dynamic imports com next/dynamic
   - Route-based splitting automático

✅ Memoization
   - useMemo para gráficos/metrics
   - React.memo para cards

✅ Lazy Loading
   - useEffect com cleanup
   - Intersection Observer ready

✅ Image Optimization
   - Next.js Image component
   - Automatic srcset generation

✅ CSS
   - Tailwind purge
   - Only used classes bundled
   - CSS-in-JS com Tailwind
```

### Backend

```
✅ API Caching
   - Google Sheets cache em memória
   - ISR (Incremental Static Regeneration) ready

✅ Database
   - Native Google Sheets (no extra DB)
   - Batch operations possible
   - Row limiting (avoid huge tables)

✅ Connections
   - OAuth reuse (1 JWT per app)
   - Connection pooling ready
```

---

## 🔍 Error Handling

### Camadas de Tratamento

```
┌─────────────────────────────┐
│   Frontend Try/Catch        │
│   - Toast messages          │
│   - Fallback UI             │
│   - Log to console          │
└────────────┬────────────────┘
             │
             ↓
┌─────────────────────────────┐
│   API Route Error Handling  │
│   - 400/404/500 responses   │
│   - JSON error objects      │
│   - Request validation      │
└────────────┬────────────────┘
             │
             ↓
┌─────────────────────────────┐
│   Google Sheets Error       │
│   - Auth failures           │
│   - Network timeouts        │
│   - Data validation         │
│   - Retry logic             │
└─────────────────────────────┘
```

---

## 🔄 Update Cycle

### Sincronização Bidirecional (Teórico)

Atualmente: **Unidirecional** (App → Sheets)

Para implementar bidirecional:
```
1. Add polling em useEffect (30s interval)
2. Ou add WebSocket listener
3. Ou add Google Sheets webhooks (via Apps Script)

benefício: Detectar mudanças em tempo real
custo: Mais requisições à API
```

---

## 📈 Escalabilidade

### Limitações Atuais

```
Google Sheets Free Tier:
- 500 requisições / 100 segundos
- 2GB de armazenagem
- 100k linhas recomendadas
- Leitura/escrita ~100-200ms

Para >10k registros:
- Considere migrar para PostgreSQL
- Use Prisma ORM
- Mantenha mesma API
```

### Roadmap para Escalar

```
1. Adicionar banco de dados (PostgreSQL)
2. Manter Google Sheets como backup
3. Cache com Redis
4. Implementar autenticação completa
5. Rate limiting e quotas por usuário
6. Arquitetura microserviços
```

---

## 🔐 Segurança

### Current State
```
⚠️ Público (sem autenticação)
⚠️ Sem validação de entrada rigorosa
⚠️ Sem CORS configurado
✅ HTTPS em produção
✅ Credenciais em variáveis de ambiente
✅ .env.local no .gitignore
```

### Para Produção

```
1. Implementar autenticação (NextAuth/Auth0)
2. Role-based access control (RBAC)
3. Input validation com Zod schemas
4. Rate limiting e throttling
5. HTTPS obrigatório
6. CORS whitelist
7. Auditoria de todas as ações
8. Encryption at rest e in transit
9. Regular security audits
```

---

## 📱 Responsividade

### Grid System (Tailwind)

```
Mobile (< 640px):    grid-cols-1
Tablet (640-1024px): grid-cols-2
Desktop (> 1024px):  grid-cols-3 lg:grid-cols-4
```

### Media Queries Customizadas

```javascript
// Tailwind
sm:  @media (min-width: 640px)
md:  @media (min-width: 768px)
lg:  @media (min-width: 1024px)
xl:  @media (min-width: 1280px)
2xl: @media (min-width: 1536px)
```

---

## 🧪 Testing (Ready for Implementation)

### Recommended Stack
```
- Jest: Unit testing
- React Testing Library: Component testing
- Playwright: E2E testing
- MSW: API mocking
```

### Coverage Areas
```
- API routes (happy path, error cases)
- Google Sheets integration (auth, CRUD)
- Components (renders, interactions)
- Utils (formatting, validation)
```

---

## 📚 Fluxo de Desenvolvimento

### Branch Strategy
```
main (production)
 ↓
develop
 ↓
feature/nome-da-feature
```

### Commit Convention
```
feat: Adicionar nova feature
fix: Corrigir bug
docs: Documentação
test: Testes
refactor: Refatoração
chore: Tarefas (deps update, etc)
```

---

## 🎯 Próximas Melhorias Arquiteturais

```
1. Monorepo (Turborepo)
2. GraphQL (Apollo)
3. Real-time sync (Socket.io)
4. Message queue (Bull, RabbitMQ)
5. Microkernel pattern
6. Event sourcing
7. CQRS pattern
```

---

Última atualização: **Maio 2026** ✨
