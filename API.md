# 🔌 Documentação de API

## 📍 URL Base
```
Development: http://localhost:3000/api
Production: https://seu-dominio.com/api
```

---

## 📋 Endpoints

### 1. Ocorrências

#### 1.1 GET /occurrences - Listar Todas
```http
GET /api/occurrences
```

**Response (200 OK):**
```json
[
  {
    "id": "row_2",
    "nota": "NF001",
    "volumes": 10,
    "tipo": "Falta de Items",
    "solicitante": "João Silva",
    "dataNota": "2026-05-01",
    "dataOcorrencia": "2026-05-02",
    "transportadora": "Loggi",
    "cliente": "Empresa X",
    "destino": "São Paulo",
    "estado": "SP",
    "pedido": "PED001",
    "ocorrencia": "Avaria em transporte",
    "ultimaOcorrencia": "2026-05-03",
    "statusCliente": "Notificado",
    "statusTransportadora": "Em Andamento",
    "tracking": "BR123456789",
    "obs": "Reempadronização em andamento",
    "pendencia": false,
    "status": "Em Andamento"
  },
  ...
]
```

**Errors:**
- `500` - Erro ao conectar com Google Sheets

---

#### 1.2 POST /occurrences - Criar Nova
```http
POST /api/occurrences
Content-Type: application/json

{
  "nota": "NF002",
  "volumes": 15,
  "tipo": "Atraso",
  "solicitante": "Maria Silva",
  "dataNota": "2026-05-05",
  "dataOcorrencia": "2026-05-06",
  "transportadora": "Sedex",
  "cliente": "Empresa Y",
  "destino": "Rio de Janeiro",
  "estado": "RJ",
  "pedido": "PED002",
  "ocorrencia": "Entrega atrasada",
  "ultimaOcorrencia": "2026-05-07",
  "statusCliente": "Aguardando",
  "statusTransportadora": "Em Rota",
  "tracking": "BR987654321",
  "obs": "Aguardando retorno",
  "pendencia": true,
  "status": "Pendente"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Ocorrência criada com sucesso",
  "id": "row_3",
  "data": { ...ocorrência criada }
}
```

**Errors:**
- `400` - Dados inválidos (Nota é obrigatória)
- `500` - Erro ao salvar no Google Sheets

---

#### 1.3 PUT /occurrences/[id] - Atualizar
```http
PUT /api/occurrences/[id]
Content-Type: application/json

{
  "nota": "NF002",
  "volumes": 20,
  "status": "Resolvido",
  ...outros campos
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Ocorrência atualizada com sucesso",
  "data": { ...ocorrência atualizada }
}
```

**Errors:**
- `404` - Ocorrência não encontrada
- `400` - Dados inválidos
- `500` - Erro ao atualizar no Google Sheets

---

#### 1.4 DELETE /occurrences/[id] - Deletar
```http
DELETE /api/occurrences/[id]
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Ocorrência deletada com sucesso",
  "id": "row_3"
}
```

**Errors:**
- `404` - Ocorrência não encontrada
- `500` - Erro ao deletar do Google Sheets

---

### 2. Transportes

#### 2.1 GET /transporte - Listar Todos
```http
GET /api/transporte
```

**Response (200 OK):**
```json
[
  {
    "notaFiscal": "NF-001",
    "numConhecimento": "CTR-001",
    "numPedido": "PED-001",
    "remetente": "Fábrica SP",
    "destinatario": "Loja Rio",
    "dataEmissao": "2026-05-01",
    "previsaoEntrega": "2026-05-05",
    "status": "Em Rota",
    "ultimaOcorrencia": "Saiu para entrega",
    "dataOcorrencia": "2026-05-04",
    "modal": "Caminhão",
    "filialOrigem": "SP",
    "cidadeOrigem": "São Paulo",
    "ufOrigem": "SP",
    "filialDestino": "RJ",
    "cidadeDestino": "Rio de Janeiro",
    "ufDestino": "RJ",
    "valorFrete": "500.00",
    "peso": "1000.00",
    "volume": "50",
    "valorMercadoria": "50000.00",
    "mes": "maio"
  },
  ...
]
```

---

#### 2.2 POST /transporte - Criar Novo
```http
POST /api/transporte
Content-Type: application/json

{
  "notaFiscal": "NF-002",
  "numConhecimento": "CTR-002",
  ...dados do transporte
}
```

**Response (201 Created):** Mesmo padrão de Ocorrências

---

#### 2.3 PUT /transporte/[id] - Atualizar
```http
PUT /api/transporte/[id]
Content-Type: application/json

{
  "status": "Entregue",
  "dataOcorrencia": "2026-05-05"
}
```

**Response (200 OK):** Transporte atualizado

---

#### 2.4 DELETE /transporte/[id] - Deletar
```http
DELETE /api/transporte/[id]
```

**Response (200 OK):** Confirmação de deleção

---

### 3. Expedição

#### 3.1 GET /expedicao - Listar Notas
```http
GET /api/expedicao
```

**Response (200 OK):**
```json
[
  {
    "id": "exp_1",
    "nota": 45001,
    "cliente": "Supermercado ABC",
    "volumes": 12,
    "status": "NF DISPONIVEIS",
    "dataNota": "2026-05-01",
    "dataExpedicao": ""
  },
  ...
]
```

---

#### 3.2 POST /expedicao - Criar NF
```http
POST /api/expedicao
Content-Type: application/json

{
  "nota": 45002,
  "cliente": "Supermercado XYZ",
  "volumes": 8,
  "dataNota": "2026-05-02"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Nota Fiscal criada com sucesso",
  "id": "exp_2"
}
```

---

#### 3.3 PUT /expedicao/[id] - Atualizar Status
```http
PUT /api/expedicao/[id]
Content-Type: application/json

{
  "status": "EXPEDIDO",
  "dataExpedicao": "2026-05-05"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Expedição atualizada",
  "data": { ...NF atualizada }
}
```

---

#### 3.4 DELETE /expedicao/[id] - Deletar NF
```http
DELETE /api/expedicao/[id]
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Expedição deletada"
}
```

---

### 4. Stock/Armazém

#### 4.1 GET /stock - Listar Produtos
```http
GET /api/stock
```

**Query Parameters:**
- `filial` (opcional): Filtrar por filial
- `sku` (opcional): Buscar por SKU

**Response (200 OK):**
```json
[
  {
    "id": "stk_1",
    "filial": "SP",
    "nota": "NF001",
    "ocorrencia": "OC001",
    "transportadora": "Loggi",
    "sku": "SKU-123",
    "descricao": "Produto A",
    "quantidade": "100",
    "tipoOcorrencia": "Avaria",
    "dataEntrada48": "2026-05-01",
    "dataSaida48": "2026-05-03",
    "tracking": "BR123456789",
    "obs": "Aguardando verificação"
  },
  ...
]
```

---

#### 4.2 POST /stock - Adicionar Produto
```http
POST /api/stock
Content-Type: application/json

{
  "filial": "SP",
  "nota": "NF002",
  "ocorrencia": "OC002",
  "transportadora": "Sedex",
  "sku": "SKU-124",
  "descricao": "Produto B",
  "quantidade": "50",
  "tipoOcorrencia": "Falta",
  "dataEntrada48": "2026-05-02",
  "dataSaida48": "2026-05-04",
  "tracking": "BR987654321",
  "obs": "Pendência de confirmação"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Produto adicionado com sucesso",
  "id": "stk_2"
}
```

---

#### 4.3 PUT /stock/[id] - Atualizar Produto
```http
PUT /api/stock/[id]
Content-Type: application/json

{
  "quantidade": "60",
  "dataSaida48": "2026-05-05",
  "obs": "Problema resolvido"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Produto atualizado com sucesso",
  "data": { ...produto atualizado }
}
```

---

#### 4.4 DELETE /stock/[id] - Remover Produto
```http
DELETE /api/stock/[id]
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Produto removido com sucesso"
}
```

---

## 📊 Modelos de Dados

### Occurrence
```typescript
interface Occurrence {
  id: string
  nota: string                    // Nota Fiscal
  volumes: number
  tipo: string
  solicitante: string
  dataNota: string               // yyyy-MM-dd
  dataOcorrencia: string         // yyyy-MM-dd
  transportadora: string
  cliente: string
  destino: string               // Cidade
  estado: string                // UF (SP, RJ, etc)
  pedido: string
  ocorrencia: string            // Descrição
  ultimaOcorrencia: string      // yyyy-MM-dd
  statusCliente: string
  statusTransportadora: string
  tracking: string              // Código de rastreamento
  obs: string                   // Observações
  pendencia: boolean
  status: 'Pendente' | 'Em Andamento' | 'Resolvido' | 'Cancelado'
}
```

### Transporte
```typescript
interface Transporte {
  notaFiscal: string
  numConhecimento: string
  numPedido: string
  remetente: string
  destinatario: string
  dataEmissao: string           // yyyy-MM-dd
  previsaoEntrega: string       // yyyy-MM-dd
  status: string
  ultimaOcorrencia: string
  dataOcorrencia: string        // yyyy-MM-dd
  modal: string                 // Tipo de transporte
  filialOrigem: string
  cidadeOrigem: string
  ufOrigem: string
  filialDestino: string
  cidadeDestino: string
  ufDestino: string
  valorFrete: string            // Decimal
  peso: string                  // Kg
  volume: string                // Quantidade
  valorMercadoria: string       // Decimal
  mes: string                   // janeiro, fevereiro, etc
}
```

### Expedição
```typescript
interface Expedicao {
  id: string
  nota: number
  cliente: string
  volumes: number
  status: 'NF DISPONIVEIS' | 'AGUARDANDO' | 'EXPEDIDO'
  dataNota: string              // yyyy-MM-dd
  dataExpedicao: string         // yyyy-MM-dd (vazio se não expedido)
}
```

### Stock/Produto
```typescript
interface Produto {
  id: string
  filial: string
  nota: string
  ocorrencia: string
  transportadora: string
  sku: string                   // Identificador do produto
  descricao: string
  quantidade: string            // Número de itens
  tipoOcorrencia: string
  dataEntrada48: string         // yyyy-MM-dd
  dataSaida48: string           // yyyy-MM-dd (quando saiu do armazém)
  tracking: string
  obs: string
}
```

---

## 🔄 Padrão de Resposta

### Sucesso (2xx)
```json
{
  "success": true,
  "message": "Descrição do que foi feito",
  "data": { ...dados retornados },
  "id": "identificador (se aplicável)"
}
```

### Erro (4xx, 5xx)
```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Tipo de erro",
  "details": "Detalhes adicionais (opcional)"
}
```

---

## ⚠️ Status HTTP

| Status | Descrição |
|--------|-----------|
| `200` | OK - Requisição bem-sucedida |
| `201` | Created - Recurso criado |
| `400` | Bad Request - Dados inválidos |
| `401` | Unauthorized - Não autenticado |
| `403` | Forbidden - Sem permissão |
| `404` | Not Found - Recurso não existe |
| `500` | Internal Server Error - Erro do servidor |
| `503` | Service Unavailable - Google Sheets offline |

---

## 🔐 Autenticação

Atualmente, **não há autenticação** implementada. Todos os endpoints são públicos.

### Para Produção (Recomendado)
Implemente um dos seguintes:
- ✅ NextAuth.js com Google OAuth
- ✅ Auth0
- ✅ Supabase Auth
- ✅ Firebase Authentication
- ✅ JWT Token

---

## 🚦 Rate Limiting

Não há rate limiting implementado.

### Para Produção (Recomendado)
Implemente:
```
- 100 requests por minuto por IP
- 1000 requests por hora por usuário
- Cache de 5 minutos para GETs
```

---

## 📝 Validações

### Campos Obrigatórios por Endpoint

**POST /occurrences:**
- `nota` (string, não vazio)

**POST /transporte:**
- `notaFiscal` (string, não vazio)

**POST /expedicao:**
- `nota` (number)
- `cliente` (string, não vazio)

**POST /stock:**
- `sku` (string, não vazio)
- `filial` (string, válido)

---

## 🧪 Exemplos com cURL

### Listar Ocorrências
```bash
curl -X GET http://localhost:3000/api/occurrences
```

### Criar Ocorrência
```bash
curl -X POST http://localhost:3000/api/occurrences \
  -H "Content-Type: application/json" \
  -d '{
    "nota": "NF001",
    "cliente": "Empresa X",
    "status": "Pendente",
    "volumes": 10
  }'
```

### Atualizar Ocorrência
```bash
curl -X PUT http://localhost:3000/api/occurrences/row_2 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Resolvido"
  }'
```

### Deletar Ocorrência
```bash
curl -X DELETE http://localhost:3000/api/occurrences/row_2
```

---

## 📚 Exemplos com JavaScript/Fetch

### Listar
```javascript
const response = await fetch('/api/occurrences')
const data = await response.json()
console.log(data)
```

### Criar
```javascript
const response = await fetch('/api/occurrences', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nota: 'NF001',
    cliente: 'Empresa X',
    status: 'Pendente'
  })
})
const resultado = await response.json()
console.log(resultado)
```

### Atualizar
```javascript
const response = await fetch('/api/occurrences/row_2', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'Resolvido'
  })
})
```

### Deletar
```javascript
const response = await fetch('/api/occurrences/row_2', {
  method: 'DELETE'
})
```

---

## 🐛 Troubleshooting API

### Erro 500: "Google Sheets API Error"
```
Verificar:
- GOOGLE_SHEET_ID correto
- GOOGLE_CLIENT_EMAIL com permissão
- GOOGLE_PRIVATE_KEY formatada corretamente
- API habilitada no Google Cloud
```

### Erro 500: "Authentication failed"
```
Solução:
- Regenerar JSON de credenciais
- Compartilhar planilha com novo email
- Atualizar .env.local
```

### Response vazio
```
Causa provável:
- Aba não existe (deve ser "Ocorrências", "Expedição", etc)
- Coluna não mapeada corretamente
- Dados em formato errado
```

---

## 📊 Performance

- **GET**: ~200ms (com cache: ~50ms)
- **POST**: ~500ms
- **PUT**: ~500ms
- **DELETE**: ~500ms

Tempos variam conforme tamanho da planilha e conexão.

---

Última atualização: **Maio 2026** ✨
