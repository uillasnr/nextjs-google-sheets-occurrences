# Sistema de Gerenciamento de Ocorrências com Google Sheets

Sistema completo em Next.js para gerenciar ocorrências de transporte com integração ao Google Sheets. Todas as operações CRUD (Criar, Ler, Atualizar, Deletar) são sincronizadas em tempo real com sua planilha.

## 🚀 Funcionalidades

- ✅ **Listagem dinâmica** de ocorrências do Google Sheets
- ✅ **Criar** novas ocorrências diretamente no Google Sheets
- ✅ **Editar** ocorrências existentes
- ✅ **Deletar** ocorrências
- ✅ **Estatísticas em tempo real** (Total, Pendentes, Em Andamento, Resolvidos)
- ✅ **Interface moderna** com Tailwind CSS
- ✅ **Sincronização automática** com Google Sheets

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Google Cloud Platform
- Uma planilha do Google Sheets

## 🔧 Configuração do Google Sheets

### Passo 1: Criar um Projeto no Google Cloud

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Anote o **ID do projeto**

### Passo 2: Habilitar a API do Google Sheets

1. No menu lateral, vá em **APIs e Serviços** > **Biblioteca**
2. Procure por "Google Sheets API"
3. Clique em **Ativar**

### Passo 3: Criar uma Conta de Serviço

1. Vá em **APIs e Serviços** > **Credenciais**
2. Clique em **Criar credenciais** > **Conta de serviço**
3. Preencha:
   - Nome da conta de serviço: `sheets-api-service`
   - Descrição: `Conta para acessar Google Sheets`
4. Clique em **Criar e continuar**
5. Pule as etapas de permissões (clique em **Continuar** e depois **Concluir**)

### Passo 4: Gerar Chave JSON

1. Na lista de contas de serviço, clique na conta recém-criada
2. Vá na aba **Chaves**
3. Clique em **Adicionar chave** > **Criar nova chave**
4. Escolha o formato **JSON**
5. A chave será baixada automaticamente - **GUARDE ESTE ARQUIVO COM SEGURANÇA**

### Passo 5: Configurar a Planilha

1. Abra sua planilha no Google Sheets (ou crie uma nova)
2. Na URL da planilha, copie o ID:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_É_O_ID]/edit
   ```
3. Clique em **Compartilhar**
4. Adicione o email da conta de serviço (encontrado no arquivo JSON baixado, campo `client_email`)
5. Dê permissão de **Editor**

### Passo 6: Estrutura da Planilha

Sua planilha deve ter uma aba chamada **"Ocorrências"** com as seguintes colunas (Linha 1 - cabeçalhos):

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Nota | Volumes | Tipo | Solicitante | Data Nota | Data Ocorrência | Transportadora | Cliente | Destino | Estado | Pedido | Ocorrência | Última Ocorrência | Status Cliente | Status Transportadora | Tracking | Obs | Pendência | Status |

## 🛠️ Instalação

### 1. Clone ou extraia o projeto

```bash
cd nextjs-google-sheets-occurrences
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
GOOGLE_SHEET_ID=seu_spreadsheet_id_aqui
GOOGLE_CLIENT_EMAIL=sua-conta-servico@seu-projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSuaChavePrivadaAqui\n-----END PRIVATE KEY-----\n"
```

**Como preencher:**

- `GOOGLE_SHEET_ID`: Copie da URL da sua planilha
- `GOOGLE_CLIENT_EMAIL`: Campo `client_email` do arquivo JSON
- `GOOGLE_PRIVATE_KEY`: Campo `private_key` do arquivo JSON
  - ⚠️ **IMPORTANTE**: Mantenha as quebras de linha como `\n`
  - Copie exatamente como está no JSON, incluindo aspas

### 4. Execute o projeto

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 📦 Estrutura do Projeto

```
nextjs-google-sheets-occurrences/
├── app/
│   ├── api/
│   │   └── occurrences/
│   │       ├── route.ts          # GET e POST
│   │       └── [id]/
│   │           └── route.ts      # PUT e DELETE
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Página principal
├── components/
│   ├── OccurrenceCard.tsx        # Card de exibição
│   ├── OccurrenceModal.tsx       # Modal de criar/editar
│   └── Stats.tsx                 # Estatísticas
├── lib/
│   └── googleSheets.ts           # Serviço do Google Sheets
├── types/
│   └── occurrence.ts             # Tipos TypeScript
├── .env.example
├── .env.local                    # Suas credenciais (criar)
├── package.json
└── README.md
```

## 🎯 Como Usar

### Criar Nova Ocorrência

1. Clique no botão **"Nova Ocorrência"**
2. Preencha os campos obrigatórios (Nota Fiscal é obrigatória)
3. Clique em **"Criar Ocorrência"**
4. A ocorrência será adicionada ao Google Sheets instantaneamente

### Editar Ocorrência

1. Clique no botão **"Editar"** no card da ocorrência
2. Modifique os campos desejados
3. Clique em **"Atualizar Ocorrência"**
4. As mudanças serão refletidas no Google Sheets

### Deletar Ocorrência

1. Clique no botão **"Deletar"** no card da ocorrência
2. Confirme a ação
3. A linha será removida do Google Sheets

### Atualizar Dados

- Clique no botão **"Atualizar"** para buscar os dados mais recentes do Google Sheets

## 🎨 Personalização

### Tipos de Ocorrência

Edite o arquivo `types/occurrence.ts` para adicionar/modificar tipos:

```typescript
export const TIPO_OCORRENCIA_MAP: Record<string, string> = {
  "1": "Falta de Volumes",
  "2": "Falta de Itens",
  // Adicione mais tipos aqui
};
```

### Status

Os status disponíveis são:
- **Pendente** (amarelo)
- **Em Andamento** (azul)
- **Resolvido** (verde)
- **Cancelado** (vermelho)

Edite `components/OccurrenceCard.tsx` para personalizar cores e ícones.

## 🔒 Segurança

⚠️ **NUNCA** commite o arquivo `.env.local` no Git!

- As credenciais do Google estão protegidas em variáveis de ambiente
- O arquivo `.gitignore` já está configurado para ignorar `.env.local`
- Use `.env.example` como modelo para outros desenvolvedores

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para o GitHub
2. Importe o projeto no [Vercel](https://vercel.com)
3. Adicione as variáveis de ambiente:
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_CLIENT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
4. Deploy!

### Outras plataformas

O projeto funciona em qualquer plataforma que suporte Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- DigitalOcean App Platform

## 🐛 Troubleshooting

### Erro: "Falha ao buscar dados do Google Sheets"

- Verifique se as credenciais estão corretas no `.env.local`
- Confirme que a conta de serviço tem permissão de Editor na planilha
- Verifique se a API do Google Sheets está habilitada no projeto

### Erro: "Invalid grant"

- A chave privada pode estar malformatada
- Verifique se os `\n` estão corretos na `GOOGLE_PRIVATE_KEY`
- Certifique-se de que copiou toda a chave, incluindo BEGIN e END

### Erro de CORS

- Este problema não deve ocorrer, pois as requisições são server-side
- Se ocorrer, verifique se está usando as rotas corretas (`/api/occurrences`)

## 📝 Licença

Este projeto é livre para uso pessoal e comercial.

## 🤝 Contribuições

Sinta-se à vontade para abrir issues e pull requests!

## 📧 Suporte

Se tiver dúvidas, verifique:
1. As variáveis de ambiente estão corretas?
2. A planilha está compartilhada com a conta de serviço?
3. A API do Google Sheets está habilitada?
4. A estrutura da planilha está correta?

---


Desenvolvido com  usando Next.js 14, TypeScript, Tailwind CSS e Google Sheets API
