# ✨ Todas as Funcionalidades do Sistema

## 📋 Índice
1. [Módulo Ocorrências](#1-módulo-ocorrências)
2. [Módulo Análise Logística](#2-módulo-análise-logística)
3. [Módulo Expedição](#3-módulo-expedição)
4. [Módulo Armazém](#4-módulo-armazém)
5. [Funcionalidades Gerais](#5-funcionalidades-gerais)
6. [Componentes Reutilizáveis](#6-componentes-reutilizáveis)

---

## 1. Módulo Ocorrências

### 🎯 Localização
**Rota:** `/` (Home)
**Arquivo:** `app/page.tsx`

### 📊 Funcionalidades Principais

#### 1.1 Listagem de Ocorrências
```
✅ Exibe grid responsivo de cards
✅ Filtro por status (Todos, Pendente, Em Andamento, Resolvido)
✅ Agrupamento automático por Cliente
✅ Ordenação customizável
✅ Pagination ou lazy loading
```

**Card Individual Mostra:**
- 🏷️ Nota Fiscal
- 📊 Status (badge colorido)
- 👥 Cliente
- 🚚 Transportadora
- 🗺️ Destino (Cidade/UF)
- 📅 Data da Ocorrência
- 📦 Volumes
- 🔔 Tipo de Ocorrência
- 🚛 Tracking
- 📝 Observações
- 🔴 Pendência (sim/não)

#### 1.2 Criar Ocorrência
```javascript
Fluxo:
1. Clique "Nova Ocorrência" → Abre Modal
2. Preencha Campos:
   - Nota Fiscal (obrigatório)
   - Volumes
   - Tipo de Ocorrência
   - Solicitante
   - Data Nota
   - Data Ocorrência
   - Transportadora
   - Cliente
   - Destino (Cidade)
   - Estado (UF)
   - Pedido
   - Descrição Ocorrência
   - Última Ocorrência
   - Status Cliente
   - Status Transportadora
   - Tracking
   - Observações
   - Pendência (checkbox)
   - Status (Pendente/Em Andamento/Resolvido)

3. Clique "Criar Ocorrência"
4. ✅ Sincronizado com Google Sheets
```

#### 1.3 Editar Ocorrência
```
✅ Clique "Editar" no card
✅ Modal abre com dados preenchidos
✅ Modifique campos desejados
✅ Clique "Atualizar Ocorrência"
✅ Linha atualizada no Google Sheets
```

#### 1.4 Deletar Ocorrência
```
✅ Clique "Deletar" no card
✅ Confirmação: "Tem certeza?"
✅ Se confirmado:
   - Linha removida do Google Sheets
   - Card desaparece da lista
   - Estatísticas atualizadas
```

#### 1.5 Dashboard de Estatísticas
```
✅ Total de Ocorrências
✅ Pendentes (amarelo 🟡)
✅ Em Andamento (azul 🔵)
✅ Resolvidas (verde 🟢)
✅ Cards clicáveis - filtram a lista
```

#### 1.6 Busca Avançada
```
✅ Buscar por Nota Fiscal (NF)
✅ Resultado em modal destacado
✅ Detalhes completos
✅ Opção de editar/deletar a partir do resultado
```

#### 1.7 Exportar para PDF
```
✅ Cada card tem botão "PDF"
✅ Document contém:
   - Logo da empresa
   - Header com informações da ocorrência
   - Tabela com todos os dados
   - Footer com data/hora
✅ Download automático
```

#### 1.8 Tema Escuro/Claro
```
✅ Toggle no header
✅ Cores adaptadas para cada tema:
   - Light: Fundo branco, texto escuro
   - Dark: Fundo cinza escuro, texto claro
✅ Persistência em localStorage
✅ Tema aplicado em toda aplicação
```

#### 1.9 Interface Responsiva
```
✅ Mobile: 1 coluna
✅ Tablet: 2 colunas
✅ Desktop: 3 colunas
✅ Cards redimensionam automaticamente
✅ Menus adaptados para touch
✅ Imagens otimizadas
```

---

## 2. Módulo Análise Logística

### 🎯 Localização
**Rota:** `/AnaliseTransporte`
**Arquivo:** `app/AnaliseTransporte/page.tsx`

### 📊 Funcionalidades Principais

#### 2.1 KPIs em Tempo Real
Exibe 8 cards com métricas principais:

```
1. Total de Transportes
   - Número total de registros no período
   
2. Finalizadas ✅
   - Quantidade de transportes finalizados
   - Com ícone de destaque
   
3. Em Andamento ⏱️
   - Transportes em processamento
   
4. Em Aberto 📦
   - Abertos e não iniciados
   
5. Tempo Médio (dias)
   - Média de dias para entrega
   
6. Eficiência (%)
   - Percentual de entregas no prazo
   - Gráfico de pizza
   
7. Atraso Médio (dias)
   - Dias médios de atraso
   
8. Maior Atraso (dias)
   - Maior atraso registrado
```

#### 2.2 Gráficos Interativos (Recharts)

**2.2.1 Entregas por Estado (UF Destino)**
```
Tipo: Gráfico de Barras
- Eixo X: Estados (UF)
- Eixo Y: Quantidade de entregas
- Filtro: Automático por seleção de estado
- Tooltip: Hover mostra detalhes
- Ordenação: Maior para menor
```

**2.2.2 Eficiência (No Prazo vs Atrasadas)**
```
Tipo: Gráfico de Pizza
- Core: Porcentagem no prazo
- Outer: Porcentagem atrasadas
- Cores: Verde e Vermelho
- Legenda: Dinâmica
- Tooltip: Percentuais
```

**2.2.3 Status de Despacho**
```
Tipo: Gráfico de Pizza
- Fatias por cada status
- Cores: Customizadas por status
- Legenda: Com contagens
- Tooltip: Nomes e valores
```

**2.2.4 Tendências por Transportadora**
```
Tipo: Gráfico de Barras
- Eixo X: Transportadoras
- Eixo Y: Quantidade/Valor
- Stacked: Possibilidade de comparar
- Legenda: Por tipo/status
```

#### 2.3 Filtros Avançados

**2.3.1 Filtro por Mês**
```
- Dropdown com 12 meses
- Padrão: Janeiro
- Atualiza todos os KPIs e gráficos
```

**2.3.2 Filtro por Estado (UF)**
```
- Dropdown dinâmico (preenche com estados únicos)
- Opção "Todos Estados"
- Filtra transportes por UF destino
```

**2.3.3 Filtro por Filial**
```
- Dropdown com filiais únicas
- Opção "Todas Filiais"
- Filtra por filial de origem
```

**2.3.4 Filtro por Status**
```
- Dropdown com status únicos
- Opção "Todos Status"
- Filtra por status do transporte
```

#### 2.4 Adicional: Loading com Animação
```
✅ Componente Loading customizado
✅ Exibe enquanto dados estão sendo carregados
✅ Animação de capacete + bolinhas
✅ Texto "Carregando Dados de Transporte"
```

---

## 3. Módulo Expedição

### 🎯 Localização
**Rota:** `/expedicao`
**Arquivo:** `app/expedicao/page.tsx`

### 📊 Funcionalidades Principais

#### 3.1 Lista de Notas Fiscais
```
✅ Agrupamento por Cliente
✅ Cards expandíveis por grupo
✅ Mostra resumo: cliente, total de notas, volumes
✅ Cada NF com Status, Data, Volume
```

#### 3.2 Status Workflow
```
Estados possíveis:
1. NF DISPONÍVEL (amarelo 🟡)
   - Nota disponível no sistema
   - Aguardando processamento
   
2. AGUARDANDO (laranja 🟠)
   - Agendada para retirada
   - Aguardando transportador
   
3. EXPEDIDO (verde 🟢)
   - Nota já foi expedida
   - Rastreável
```

#### 3.3 Cards de Status
```
4 cards no topo mostram:
- Disponível: Quantidade de NF disponíveis
- Aguardando: Quantidade aguardando
- Expedido: Quantidade expedida
- Total: Total de NF
```

#### 3.4 Gerenciar Notas Fiscais

**Criar Nova NF:**
```
✅ Modal: Cadastrar Nova NF
✅ Campos:
   - Nota Fiscal (número)
   - Cliente
   - Volume
   - Data
   - Filial
✅ Salva em Google Sheets
```

**Atualizar Status:**
```
✅ Clique em NF
✅ Opções: NF DISPONÍVEL → AGUARDANDO → EXPEDIDO
✅ Atualiza em tempo real
```

**Agendar Retirada:**
```
✅ Modal: Agendar Retirada
✅ Campos:
   - Data de Retirada
   - Hora
   - Transportador
✅ Notificação ao sistema
```

#### 3.5 Romaneios

**Gerar Romaneio para Impressão:**
```
✅ Selecionar múltiplas NF por cliente
✅ Clique "Gerar Romaneio"
✅ PDF contém:
   - Header com dados do cliente
   - Tabela com NF, volumes, valores
   - Resumo total
   - Data/hora
   - Espaço para assinatura
```

**Exportar Romaneio:**
```
✅ Botão "Exportar PDF"
✅ Download automático
✅ Nome do arquivo: romaneio_cliente_data.pdf
```

#### 3.6 Dashboard de Expedições
```
✅ Gráfico de Barras: Notas expedidas por mês
✅ Dados carregados do período selecionado
✅ Legenda com nome dos meses
✅ Eixo Y: Quantidade de notas
✅ Tooltip: Mostra valores ao passar mouse
```

#### 3.7 Operações em Lote

**Selecionar Múltiplas NF:**
```
✅ Checkboxes em cada NF
✅ "Selecionar Tudo" checkbox
✅ Contador mostrando selecionadas
```

**Expedir Selecionadas:**
```
✅ Botão "Expedir Selecionadas"
✅ Modal de confirmação
✅ Atualiza status de todas para EXPEDIDO
✅ Gera romaneio consolidado
```

**Mudar Status em Massa:**
```
✅ Selecione múltiplas
✅ Dropdown: Novo Status
✅ Clique "Aplicar"
✅ Atualiza todas selecionadas
```

#### 3.8 Filtros e Busca
```
✅ Filtro por Cliente
✅ Filtro por Status
✅ Filtro por Data
✅ Busca por NF
✅ Limpar filtros
```

#### 3.9 Mostrador de Aguardando
```
✅ Modal: Notas Aguardando Retirada
✅ Lista as que já foram agendadas
✅ Mostra data/hora da retirada
✅ Permite cancelar agendamento
```

---

## 4. Módulo Armazém

### 🎯 Localização
**Rota:** `/Armazem`
**Arquivo:** `app/Armazem/page.tsx`

### 📊 Funcionalidades Principais

#### 4.1 Grid de Produtos
```
✅ Exibe lista de produtos em cards
✅ Grid responsivo
✅ Cada card mostra:
   - SKU
   - Descrição
   - Quantidade
   - Transportadora
   - Tracking
   - Entrada em 48h
   - Saída em 48h
   - Observações
```

#### 4.2 Filtro por Filial
```
✅ Dropdown com filiais:
   - SP
   - PE
   - ES
   - Fábrica
   - Tocantins_SP
✅ Filtra produtos por filial
✅ Padrão: SP
```

#### 4.3 Adicionar Produto

**Modal Cadastro:**
```
✅ Clique "+ Novo Produto"
✅ Preencha:
   - Nota Fiscal
   - Ocorrência
   - Transportadora
   - SKU
   - Descrição
   - Quantidade
   - Tipo de Ocorrência
   - Data Entrada 48h
   - Data Saída 48h
   - Tracking
   - Observações

✅ Clique "Adicionar Produto"
✅ Salva em Google Sheets
```

#### 4.4 Editar Produto
```
✅ Clique "Editar" no card
✅ Modal abre com dados preenchidos
✅ Modifique campos
✅ Clique "Atualizar"
✅ Atualiza em Google Sheets
```

#### 4.5 Deletar Produto
```
✅ Clique "Deletar" no card
✅ Confirmação
✅ Remove de Google Sheets
```

#### 4.6 Rastreamento

**Visualizar Tracking:**
```
✅ Campo de Tracking em cada card
✅ Clicável: Abre link da transportadora
✅ Integração com principais transportadoras
```

**Histórico de Entrada/Saída:**
```
✅ Datas de entrada e saída em 48h
✅ Auditar processo de warehouse
✅ Identificar gargalos
```

#### 4.7 Estatísticas

**Dashboard Armazém:**
```
✅ Total de Produtos no Armazém
✅ Total de Volumes
✅ Tipos de Ocorrências
✅ Transportadoras Mais Comuns
✅ Tempo Médio em Warehouse
```

---

## 5. Funcionalidades Gerais

### 🎨 UI/UX

#### 5.1 Header Persistente
```
✅ Logo com ícone
✅ Título "Ocorrências de Transporte"
✅ Subtítulo "Sistema de Gestão"
✅ Botão "Nova Ocorrência"
✅ Botão "Atualizar" (Refresh)
✅ Dark mode toggle
✅ Menu de navegação
```

#### 5.2 Sidebar/Menu Lateral
```
✅ Links de navegação:
   - Home (Ocorrências)
   - Análise Logística
   - Expedição
   - Armazém
   - Dashboard

✅ Busca por NF
✅ Seletor de Filial
✅ Theme toggle
✅ Responsivo: Hamburger em mobile
```

#### 5.3 Footer
```
✅ Informações da empresa
✅ Links úteis
✅ Copyright
✅ Versão do sistema
```

### 🌓 Tema Escuro/Claro

```
✅ Toggle button no header
✅ Cores adaptadas:
   - Light Mode: Fundo branco/cinza claro
   - Dark Mode: Fundo cinza escuro/preto
✅ Todos os componentes suportam
✅ Persistência em localStorage
✅ Transição suave de cores
```

### 📱 Responsividade

```
✅ Mobile (< 640px):
   - 1 coluna de cards
   - Menu hamburger
   - Botões agrupados
   
✅ Tablet (640px - 1024px):
   - 2 colunas
   - Menu expandido
   
✅ Desktop (> 1024px):
   - 3+ colunas
   - Layout completo
   - Sidebar expandida
```

### ♿ Acessibilidade

```
✅ Semântica HTML correta
✅ Labels associadas a inputs
✅ ARIA tags onde necessário
✅ Alt text em imagens
✅ Contraste adequado de cores
✅ Navegação por teclado
```

### ⚡ Performance

```
✅ Memoização de componentes
✅ Lazy loading de imagens
✅ Code splitting automático
✅ Caching de dados
✅ Otimização de bundle
✅ TypeScript para segurança
```

### 🔄 Sincronização com Google Sheets

```
✅ CREATE: Nova linha adicionada
✅ READ: Dados lidos em tempo real
✅ UPDATE: Linha modificada
✅ DELETE: Linha removida
✅ Sincronização bidirecional
✅ Sem delay perceptível
```

---

## 6. Componentes Reutilizáveis

### 📦 Componentes Estruturais

| Componente | Localização | Descrição |
|-----------|-------------|-----------|
| `Header` | `app/components/Header.tsx` | Header principal com navegação |
| `Sidebar` | `app/components/Sidebar.tsx` | Menu lateral responsivo |
| `Footer` | `components/Footer.tsx` | Rodapé da aplicação |
| `Loading` | `components/Loading.tsx` | Animação de loading |
| `ThemeProvider` | `components/ThemeProvider.tsx` | Provedor de tema |

### 📊 Componentes de Dados

| Componente | Localização | Descrição |
|-----------|-------------|-----------|
| `OccurrenceCard` | `app/components/OccurrenceCard.tsx` | Card de ocorrência |
| `OccurrenceModal` | `app/components/OccurrenceModal.tsx` | Modal CRUD |
| `Stats` | `app/components/Stats.tsx` | Estatísticas dashboard |
| `Dashboard` | `app/components/dashboard.tsx` | Dashboard geral |
| `ProductCard` | `app/Armazem/ProductCard.tsx` | Card de produto |
| `ProductModal` | `app/Armazem/ProductModal.tsx` | Modal de produto |

### 📈 Componentes de Gráficos

| Componente | Localização | Tipo | Descrição |
|-----------|-------------|------|-----------|
| `Monthly-Trend-Chart` | `app/components/` | Linha | Tendência mensal |
| `occurrence-type-chart` | `app/components/` | Pizza | Tipos de ocorrência |
| `occurrence-type-by-transportadora` | `app/components/` | Barras | Ocorrências por transportadora |
| `StatusChart` | `app/AnaliseTransporte/componete/` | Pizza | Status de despacho |
| `EstadoChart` | `app/AnaliseTransporte/componete/` | Barras | Entregas por estado |

### 🎨 Componentes de UI

| Componente | Localização | Descrição |
|-----------|-------------|-----------|
| `Card` | `components/ui/card.tsx` | Card genérico |
| `ChartContainer` | `components/ui/chart.tsx` | Container para gráficos |
| `TextInput` | `components/TextInput.tsx` | Input de texto |
| `TextAreaInput` | `components/TextAreaInput.tsx` | TextArea |
| `SelectInput` | `components/SelectInput.tsx` | Select/Dropdown |
| `DateInput` | `components/DateInput.tsx` | Input de data |

---

## 📝 Tipos de Dados

### Occurrence
```typescript
{
  id: string
  nota: string
  volumes: number
  tipo: string
  solicitante: string
  dataNota: string
  dataOcorrencia: string
  transportadora: string
  cliente: string
  destino: string
  estado: string
  pedido: string
  ocorrencia: string
  ultimaOcorrencia: string
  statusCliente: string
  statusTransportadora: string
  tracking: string
  obs: string
  pendencia: boolean
  status: 'Pendente' | 'Em Andamento' | 'Resolvido' | 'Cancelado'
}
```

### Transporte
```typescript
{
  notaFiscal: string
  numConhecimento: string
  numPedido: string
  remetente: string
  destinatario: string
  dataEmissao: string
  previsaoEntrega: string
  status: string
  ultimaOcorrencia: string
  dataOcorrencia: string
  modal: string
  filialOrigem: string
  cidadeOrigem: string
  ufOrigem: string
  filialDestino: string
  cidadeDestino: string
  ufDestino: string
  valorFrete: string
  peso: string
  volume: string
  valorMercadoria: string
  mes: string
}
```

### Expedição
```typescript
{
  id: string
  nota: number
  cliente: string
  dataNota: string
  volumes: number
  status: 'NF DISPONIVEIS' | 'AGUARDANDO' | 'EXPEDIDO'
  dataExpedicao: string
}
```

### Produto (Armazém)
```typescript
{
  id: string
  filial: string
  nota: string
  ocorrencia: string
  transportadora: string
  sku: string
  descricao: string
  quantidade: string
  tipoOcorrencia: string
  dataEntrada48: string
  dataSaida48: string
  tracking: string
  obs: string
}
```

---

## 🎯 Matriz de Features por Módulo

|  | Oce. | Análise | Exped. | Armaz. |
|---|------|--------|--------|--------|
| **CRUD Completo** | ✅ | ❌ | ✅ | ✅ |
| **Dashboard** | ✅ | ✅ | ✅ | ⚠️ |
| **Gráficos** | ❌ | ✅ | ✅ | ❌ |
| **Filtros Avançados** | ✅ | ✅ | ✅ | ⚠️ |
| **Busca** | ✅ | ❌ | ⚠️ | ⚠️ |
| **Exportar PDF** | ✅ | ❌ | ✅ | ❌ |
| **Dark Mode** | ✅ | ✅ | ✅ | ✅ |
| **Responsivo** | ✅ | ✅ | ✅ | ✅ |

---

## 🚀 Próximas Features (Roadmap)

```
[ ] Sistema de Usuários e Permissões
[ ] Autenticação (Auth0, NextAuth)
[ ] Notificações em Tempo Real (Socket.io)
[ ] Integração com WhatsApp
[ ] Historico de Alterações (Audit Trail)
[ ] Relatórios Agendados por Email
[ ] API Pública (REST/GraphQL)
[ ] Mobile App (React Native)
[ ] Integração com TMS (Transportation Management System)
[ ] Inteligência Artificial para Previsão de Atrasos
```

---

Última atualização: **Maio 2026** ✨
