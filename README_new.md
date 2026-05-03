# 🚀 Sistema Completo de Gerenciamento de Ocorrências de Transporte

> **Enterprise-grade logistics management system** integrado com Google Sheets em tempo real

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/) 
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/) 
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/) 
[![License](https://img.shields.io/badge/License-MIT-green)](#-licença)

---

## 📌 Visão Geral

Sistema completo de **gestão logística** com 4 módulos integrados para controle de ocorrências, análise de performance, expedições e armazém. Toda a sincronização é feita em **tempo real** com seu **Google Sheets**.

### 🎯 Caso de Uso
Ideal para empresas de logística, transportadoras e distribuidoras que precisam de:
- ✅ Rastreamento centralizado de ocorrências
- ✅ Análise de performance de entregas
- ✅ Controle de expedições
- ✅ Gestão de estoque/armazém
- ✅ Integração com dados em nuvem (Google Sheets)

---

## 📦 Módulos Principais

### 1️⃣ **Ocorrências de Transporte** → `http://localhost:3000`
Gestão completa de ocorrências com dashboard inteligente.

**Funcionalidades:**
- 📋 Listagem dinâmica com filtros por status (Pendente, Em Andamento, Resolvido)
- ➕ Criar novas ocorrências via modal
- ✏️ Editar ocorrências existentes
- 🗑️ Deletar com confirmação
- 🔍 Busca avançada por Nota Fiscal (NF)
- 📊 Dashboard com estatísticas: Total, Pendentes, Em Andamento, Resolvidos
- 📄 Exportar para PDF
- 🌙 Tema escuro/claro
- 📱 Interface 100% responsiva

**Screenshot do Card:**
- Nota Fiscal | Status | Cliente | Transportadora
- Destino | Data | Tracking | Observações
- Botões: Editar | Deletar | PDF

---

### 2️⃣ **Análise Logística** → `http://localhost:3000/AnaliseTransporte`
Dashboard avançado com KPIs e análises de performance.

**Funcionalidades:**
- 📊 KPIs em Tempo Real:
  - Total de Transportes
  - Finalizadas (com ✅ destaque)
  - Em Andamento (⏱️)
  - Em Aberto (📦)
  - Tempo Médio de Entrega (dias)
  - Eficiência (%)
  - Atraso Médio (dias)
  - Maior Atraso (dias)

- 📈 Gráficos Interativos (Recharts):
  - **Entregas por Estado (UF Destino)** - Gráfico de Barras
  - **Eficiência (No Prazo vs Atrasadas)** - Gráfico de Pizza
  - **Status de Despacho** - Gráfico de Pizza
  - **Tendências por Transportadora** - Gráfico de Barras

- 🔄 Filtros Avançados:
  - 📅 Por Mês (dropdown)
  - 🗺️ Por Estado/UF
  - 🏢 Por Filial de Origem
  - 📊 Por Status

- 🎨 Tema escuro/claro

---

### 3️⃣ **Gerenciamento de Expedições** → `http://localhost:3000/expedicao`
Controle completo de notas fiscais e expedições.

**Status Workflow:**
```
NF DISPONÍVEL → AGUARDANDO → EXPEDIDO
```

**Funcionalidades:**
- 📋 Listagem de Notas Fiscais agrupadas por Cliente
- 🏷️ Cards de Status:
  - NF Disponível (amarelo)
  - Aguardando (laranja)
  - Expedido (verde)

- 📝 Gerenciamento de NF:
  - Cadastrar Nova NF
  - Atualizar Status
  - Agendar Retirada
  - Confirmar Expedição

- 🗂️ Geração de Romaneios:
  - Exportar para PDF
  - Agrupado por Cliente
  - Com Resumo de Volumes

- 📊 Dashboard Mensal:
  - Gráfico de Notas Expedidas por Mês
  - Estatísticas de Performance

- ⚡ Operações em Lote:
  - Selecionar múltiplas NF
  - Expedir Selecionadas
  - Mudar Status em Massa

---

### 4️⃣ **Gerenciamento de Armazém** → `http://localhost:3000/Armazem`
Cadastro e controle de produtos em estoque.

**Funcionalidades:**
- 📦 Grid de Produtos com:
  - SKU | Descrição | Quantidade
  - Transportadora | Tracking
  - Entrada em 48h | Saída em 48h
  - Observações

- ➕ Adicionar Novos Produtos via Modal
- ✏️ Editar Detalhes do Produto
- 🗑️ Deletar do Estoque
- 🔍 Filtro por Filial
- 📊 Visualização Total de Volumes

---

## ⚙️ Stack Tecnológico

### Frontend
- **Next.js 14** - React framework com App Router
- **TypeScript 5.3** - Tipagem estática
- **React 18** - UI library
- **Tailwind CSS 3.4** - Utility-first CSS
- **Lucide React** - Icon library (600+ ícones)
- **Recharts** - Gráficos interativos
- **React PDF** - Exportação para PDF
- **next-themes** - Dark mode

### Backend
- **Next.js API Routes** - API serverless (Edge Functions)
- **Google Sheets API** - Integração com planilhas
- **Zod** - Validação de schemas

### Desenvolvimento
- **Autoprefixer** - CSS cross-browser
- **PostCSS** - Processamento CSS
- **ESLint** - Linting

---

## 🚀 Quick Start (5 minutos)

### 1. Pré-requisitos
- Node.js 18+ ([Download](https://nodejs.org/))
- npm ou **pnpm** (recomendado)
- Conta Google

### 2. Clonar & Instalar
```bash
# Clonar ou extrair o projeto
cd nextjs-google-sheets-occurrences

# Instalar dependências
pnpm install
# ou
npm install
```

### 3. Configurar Google Sheets
Veja o guia completo em [SETUP_GUIDE.md](SETUP_GUIDE.md) ou [QUICKSTART.md](QUICKSTART.md)

**Ou resumido:**
1. Criar projeto no [Google Cloud Console](https://console.cloud.google.com/)
2. Habilitar "Google Sheets API"
3. Criar Conta de Serviço e baixar JSON
4. Compartilhar planilha com email da conta

### 4. Configurar Variáveis de Ambiente
Crie `.env.local` na raiz:
```env
GOOGLE_SHEET_ID=seu_id_da_planilha_aqui
GOOGLE_CLIENT_EMAIL=seu-email@seu-projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nXXXX...\n-----END PRIVATE KEY-----\n"
```

### 5. Rodar Locally
```bash
pnpm dev
```
Acesse: **http://localhost:3000**

---

## 📂 Estrutura de Arquivos

```
nextjs-google-sheets-occurrences/
│
├── app/                                    # Next.js App Router
│   ├── api/
│   │   ├── occurrences/
│   │   │   ├── route.ts                  # GET, POST
│   │   │   └── [id]/route.ts             # PUT, DELETE
│   │   ├── expedicao/route.ts            # Expedições
│   │   ├── stock/route.ts                # Estoque
│   │   └── transporte/route.ts           # Transportes
│   │
│   ├── AnaliseTransporte/
│   │   ├── page.tsx                      # Dashboard Logístico
│   │   └── componete/                    # Componentes de gráficos
│   │
│   ├── expedicao/
│   │   ├── page.tsx                      # Página de Expedições
│   │   ├── components/                   # Componentes específicos
│   │   ├── schemas/                      # Validações (Zod)
│   │   └── utils/                        # Utilitários
│   │
│   ├── Armazem/
│   │   ├── page.tsx                      # Página de Armazém
│   │   ├── ProductCard.tsx               # Card de produto
│   │   └── ProductModal.tsx              # Modal de edição
│   │
│   ├── components/
│   │   ├── Header.tsx                    # Header principal
│   │   ├── Sidebar.tsx                   # Menu lateral
│   │   ├── Stats.tsx                     # Estatísticas
│   │   ├── OccurrenceCard.tsx            # Card de ocorrência
│   │   ├── OccurrenceModal.tsx           # Modal CRUD
│   │   ├── Dashboard.tsx                 # Dashboard
│   │   └── ...
│   │
│   ├── layout.tsx                        # Layout raiz
│   └── page.tsx                          # Home (Ocorrências)
│
├── components/
│   ├── Loading.tsx                       # Componente de loading
│   ├── ThemeProvider.tsx                 # Provedor de tema
│   └── ui/                               # Componentes UI reutilizáveis
│
├── services/
│   └── googleSheets/
│       ├── GoogleSheetsService.ts        # Serviço principal
│       ├── ExpedicaoService.ts           # Serviço de expedições
│       ├── TransporteSheetsService.ts    # Serviço de transportes
│       ├── SaldoSheetsService.ts         # Serviço de saldo
│       ├── auth.ts                       # Autenticação
│       ├── columnMap.ts                  # Mapeamento de colunas
│       └── helpers.ts                    # Funções auxiliares
│
├── lib/
│   ├── useTransporteMetrics.ts           # Hook de métricas
│   ├── formatDate.ts                     # Formatação de data
│   └── utils.ts                          # Utilitários
│
├── types/
│   ├── occurrence.ts                     # Tipo Occurrence
│   ├── transporte.ts                     # Tipo Transporte
│   ├── expedicao.ts                      # Tipo Expedição
│   ├── stock.ts                          # Tipo Produto/Stock
│   └── romaneio.ts                       # Tipo Romaneio
│
├── public/                               # Assets estáticos
│   └── capacete web.png                  # Imagem do loader
│
├── .env.example                          # Template de variáveis
├── .env.local                            # Variáveis (não commitar)
├── .gitignore                            # Arquivos ignorados
├── next.config.js                        # Configuração Next.js
├── tailwind.config.js                    # Configuração Tailwind
├── tsconfig.json                         # Configuração TypeScript
├── package.json                          # Dependências
├── components.json                       # Config de componentes
├── postcss.config.js                     # Configuração PostCSS
│
├── README.md                             # Este arquivo
├── QUICKSTART.md                         # Guia rápido (5 min)
├── SETUP_GUIDE.md                        # Guia completo
├── PROJECT_OVERVIEW.md                   # Visão técnica
├── TROUBLESHOOTING.md                    # Solução de problemas
├── FEATURES.md                           # Todas as features
├── API.md                                # Documentação de API
└── ARCHITECTURE.md                       # Arquitetura do projeto
```

---

## 🎯 Guias Rápidos

### 📗 Primeiros Passos
👉 Leia: [QUICKSTART.md](QUICKSTART.md) - Configure em 5 minutos

### 🔧 Configuração Completa
👉 Leia: [SETUP_GUIDE.md](SETUP_GUIDE.md) - Guia passo-a-passo detalhado

### ❓ Problemas?
👉 Leia: [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Solução de erros comuns

### 📚 Todas as Features
👉 Leia: [FEATURES.md](FEATURES.md) - Lista completa de funcionalidades

### 🔌 Endpoints da API
👉 Leia: [API.md](API.md) - Documentação dos endpoints

### 🏗️ Arquitetura Técnica
👉 Leia: [ARCHITECTURE.md](ARCHITECTURE.md) - Como o sistema funciona

---

## 🎨 Estrutura Google Sheets

Sua planilha deve ter as seguintes **abas** e **colunas**:

### Aba 1: "Ocorrências"
| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Nota | Volumes | Tipo | Solicitante | Data Nota | Data Ocorrência | Transportadora | Cliente | Destino | Estado | Pedido | Ocorrência | Última Ocorrência | Status Cliente | Status Transportadora | Tracking | Obs | Pendência | Status |

### Aba 2: "Expedição" (opcional)
```
Nota | Cliente | Volume | Status | Data | Filial
```

### Aba 3: "Armazém" (opcional)
```
SKU | Descrição | Quantidade | Transportadora | Tracking | Entrada48h | Saída48h
```

---

## 💻 Como Usar

### Criar Ocorrência
1. Clique **"+ Nova Ocorrência"** no header
2. Preencha o modal (Nota Fiscal é obrigatória)
3. Clique **"Criar Ocorrência"**
4. ✅ Sincronizado no Google Sheets instantaneamente

### Editar Ocorrência
1. Clique **"Editar"** no card da ocorrência
2. Modifique os campos
3. Clique **"Atualizar Ocorrência"**
4. ✅ Atualizado no Google Sheets

### Deletar Ocorrência
1. Clique **"Deletar"** no card
2. Confirme a ação
3. ✅ Removido do Google Sheets

### Acessar Dashboard Análise
1. Click **"Dashboard"** ou **"Análise Logística"** no menu
2. Use filtros para análises específicas (Mês, UF, Filial, Status)
3. Visualize gráficos e KPIs em tempo real

### Gerenciar Expedições
1. Acesse **"Expedição"** no menu
2. Veja NF agrupadas por Cliente
3. Atualize status: NF DISPONÍVEL → AGUARDANDO → EXPEDIDO
4. Exporte romaneio para PDF

---

## 🔒 Segurança & Privacidade

### ⚠️ IMPORTANTE
- **NUNCA** commite `.env.local` no Git
- `.gitignore` já está configurado ✅
- Use `.env.example` como template para novos devs
- Credenciais do Google são privadas em variáveis de ambiente

### Best Practices
- Implemente rate limiting em produção
- Use HTTPS sempre em produção
- Valide todos os inputs (Zod já está integrado)
- Implemente autenticação de usuários (se necessário)

---

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Push no GitHub
git push origin main

# Import em https://vercel.com
# Adicione as 3 variáveis de ambiente:
# - GOOGLE_SHEET_ID
# - GOOGLE_CLIENT_EMAIL
# - GOOGLE_PRIVATE_KEY

# Deploy automático!
```

### Outras Plataformas
- Netlify
- AWS Amplify
- Google Cloud Run
- DigitalOcean App Platform

Todos suportam Next.js 14 ✅

---

## 🐛 Troubleshooting

### ❌ "Falha ao buscar dados do Google Sheets"
**Solução:**
- ✅ Verifique `.env.local` está correto
- ✅ Conta de Serviço tem permissão de **Editor**
- ✅ Planilha está compartilhada com o email da conta
- ✅ Google Sheets API está ✅ Habilitada

👉 Leia: [TROUBLESHOOTING.md](TROUBLESHOOTING.md) para mais

### ❌ Erro: "Invalid grant"
- Verifique `GOOGLE_PRIVATE_KEY` está exatamente como no JSON
- Mantenha os `\n` (não substitua por quebras reais)

### ❌ Erro 403: "Permission denied"
- Verifique o compartilhamento da planilha
- Confirme o email da conta de serviço

---

## 📊 Performance

### Otimizações Implementadas
- ✅ Memoização com `useMemo`
- ✅ React lazy loading
- ✅ Image optimization com Next.js
- ✅ CSS-in-JS (Tailwind) com purge
- ✅ API caching
- ✅ TypeScript type checking

### Tamanho Bundle
- Core: ~150KB (gzipped)
- Com gráficos: ~300KB (gzipped)

---

## 🤝 Contribuir

Sinta-se livre para:
- 🐛 Reportar bugs via issues
- 💡 Sugerir features
- 🔧 Enviar pull requests
- 📝 Melhorar documentação

---

## 📞 Suporte

### 🆘 Precisa de ajuda?
1. Verifique [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Verifique [SETUP_GUIDE.md](SETUP_GUIDE.md)
3. Leia [QUICKSTART.md](QUICKSTART.md)
4. Abra uma issue no GitHub

### FAQ
**P: Posso usar sem Google Sheets?**
R: Não, a integração Google Sheets é mandatória. Mas você pode forkar e adaptar para outro banco de dados.

**P: Suporta múltiplos usuários?**
R: Sim! A planilha é compartilhada. Para administração de usuários, implemente autenticação.

**P: Funciona offline?**
R: Não. Requer conexão com internet para sincronizar com Google Sheets.

**P: Posso customizar os campos?**
R: Sim! Edite `types/` e adapte os campos conforme necessário.

---

## 📄 Licença

MIT License - Sinta-se livre para usar em projetos pessoais e comerciais.

---

## ✨ Créditos

Desenvolvido com ❤️ usando:
- **Next.js 14** - The React Framework
- **Google Sheets API** - Cloud Storage
- **Tailwind CSS** - Utility-First CSS
- **Recharts** - Composable Charting Library

---

## 🎉 Pronto para Começar?

1. ⭐ Star este repositório
2. 📖 Leia [QUICKSTART.md](QUICKSTART.md)
3. 🚀 Configure em 5 minutos
4. 💻 Comece a usar!

**Happy coding!** 🎊
