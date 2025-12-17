# 📊 Template da Planilha Google Sheets

## Estrutura Completa

### Nome da Aba
```
Ocorrências
```
(Nome exato, sem acentos diferentes)

### Cabeçalhos (Linha 1)

Copie e cole esta linha completa na primeira linha (A1:S1) da sua planilha:

```
Nota	Volumes	Tipo	Solicitante	Data Nota	Data Ocorrência	Transportadora	Cliente	Destino	Estado	Pedido	Ocorrência	Última Ocorrência	Status Cliente	Status Transportadora	Tracking	Obs	Pendência	Status
```

### Detalhes das Colunas

| Col | Campo | Descrição | Exemplo | Obrigatório |
|-----|-------|-----------|---------|-------------|
| A | Nota | Número da Nota Fiscal | "12345" | ✅ Sim |
| B | Volumes | Quantidade de volumes | "5" ou "5 caixas" | ❌ Não |
| C | Tipo | Tipo de ocorrência | "Falta de Volumes" | ❌ Não |
| D | Solicitante | Quem solicitou | "João Silva" | ❌ Não |
| E | Data Nota | Data de emissão da NF | "2024-01-15" | ❌ Não |
| F | Data Ocorrência | Data do problema | "2024-01-20" | ❌ Não |
| G | Transportadora | Nome da transportadora | "Transportes ABC" | ❌ Não |
| H | Cliente | Nome do cliente | "Empresa XYZ Ltda" | ❌ Não |
| I | Destino | Cidade destino | "São Paulo" | ❌ Não |
| J | Estado | UF do destino | "SP" | ❌ Não |
| K | Pedido | Número do pedido | "PED-001" | ❌ Não |
| L | Ocorrência | Descrição do problema | "Volume extraviado..." | ❌ Não |
| M | Última Ocorrência | Data da última atualização | "2024-01-22" | ❌ Não |
| N | Status Cliente | Status informado pelo cliente | "Aguardando" | ❌ Não |
| O | Status Transportadora | Status da transportadora | "Em investigação" | ❌ Não |
| P | Tracking | Código de rastreamento | "BR123456789" | ❌ Não |
| Q | Obs | Observações gerais | "Cliente urgente" | ❌ Não |
| R | Pendência | Pendências abertas | "Aguardar resposta" | ❌ Não |
| S | Status | Status geral da ocorrência | "Pendente" | ✅ Sim |

### Valores Válidos para Status (Coluna S)

- `Pendente` - Ocorrência ainda não foi tratada
- `Em Andamento` - Ocorrência sendo investigada/resolvida
- `Resolvido` - Ocorrência já foi resolvida
- `Cancelado` - Ocorrência foi cancelada

### Tipos de Ocorrência Pré-definidos (Coluna C)

1. Falta de Volumes
2. Falta de Itens
3. Troca de Volume
4. Erro de Estoque
5. Extravio
6. Volumes Avariados
7. Cliente não recebeu o pedido

## Exemplo de Dados (Linha 2)

```
12345	3	Falta de Volumes	João Silva	2024-01-10	2024-01-15	Transportes ABC	Empresa XYZ	São Paulo	SP	PED-001	Faltando 1 volume na entrega	2024-01-16	Confirmado	Investigando	BR123456789	Cliente VIP	Aguardando retorno	Pendente
```

## Formato de Datas

Use sempre o formato **YYYY-MM-DD** (ex: 2024-01-15) ou deixe o Google Sheets formatar automaticamente.

## 📝 Template Pronto para Copiar

Você pode criar uma nova planilha e usar este template:

### Planilha Exemplo
https://docs.google.com/spreadsheets/d/1EXEMPLO/edit

(Substitua pelo link da sua planilha modelo)

## ⚙️ Configurações Recomendadas

### Formatação
- **Linha 1 (Cabeçalhos)**: 
  - Fundo: Azul escuro (#1a73e8)
  - Texto: Branco
  - Negrito
  - Centralizado
  
### Validação de Dados
Para a coluna S (Status), adicione validação:
1. Selecione coluna S inteira
2. Dados > Validação de dados
3. Critério: Lista de itens
4. Valores: `Pendente, Em Andamento, Resolvido, Cancelado`

### Congelar Linhas
1. Clique na linha 1
2. Exibir > Congelar > 1 linha

### Largura das Colunas (Sugerida)
- A-K: 120px
- L, Q, R: 200px (campos de texto)
- M-P, S: 150px

## 🎨 Formatação Condicional (Opcional)

### Status (Coluna S)
- **Pendente**: Fundo amarelo claro
- **Em Andamento**: Fundo azul claro
- **Resolvido**: Fundo verde claro
- **Cancelado**: Fundo vermelho claro

### Como aplicar:
1. Selecione coluna S (sem cabeçalho)
2. Formatar > Formatação condicional
3. Adicione regras para cada status

## ✅ Checklist Final

- [ ] Nome da aba é exatamente "Ocorrências"
- [ ] Cabeçalhos estão na linha 1
- [ ] Todas as 19 colunas (A-S) têm cabeçalho
- [ ] Planilha está compartilhada com a conta de serviço
- [ ] Permissão é "Editor"
- [ ] Primeira linha está congelada (opcional)
- [ ] Validação de Status configurada (opcional)

## 🔗 Links Úteis

- [Como compartilhar planilha](https://support.google.com/docs/answer/2494822)
- [Como adicionar validação](https://support.google.com/docs/answer/186103)
- [Como congelar linhas](https://support.google.com/docs/answer/9060449)

---

💡 **Dica**: Você pode começar com apenas os cabeçalhos e ir adicionando dados através da aplicação web!
