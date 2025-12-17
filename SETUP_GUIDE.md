# Guia Rápido de Configuração - Google Sheets API

## Checklist de Configuração

- [ ] Criar projeto no Google Cloud
- [ ] Habilitar Google Sheets API
- [ ] Criar conta de serviço
- [ ] Baixar arquivo JSON de credenciais
- [ ] Compartilhar planilha com a conta de serviço
- [ ] Configurar variáveis de ambiente
- [ ] Testar a aplicação

## 1. Google Cloud Console

**URL**: https://console.cloud.google.com/

### Criar Projeto
1. Clique em "Selecionar projeto" (canto superior esquerdo)
2. Clique em "Novo projeto"
3. Nome: "ocorrencias-transporte" (ou qualquer nome)
4. Clique em "Criar"

### Habilitar API
1. Menu > APIs e Serviços > Biblioteca
2. Pesquise: "Google Sheets API"
3. Clique na API
4. Clique em "Ativar"

### Criar Conta de Serviço
1. Menu > APIs e Serviços > Credenciais
2. Clique em "+ Criar credenciais"
3. Selecione "Conta de serviço"
4. Preencha:
   - **Nome**: sheets-service
   - **ID**: sheets-service (será preenchido automaticamente)
   - **Descrição**: Acesso ao Google Sheets
5. Clique em "Criar e continuar"
6. Pule as etapas 2 e 3 (clique em "Continuar" e depois "Concluir")

### Baixar Credenciais
1. Clique na conta de serviço recém-criada
2. Vá na aba "Chaves"
3. Clique em "Adicionar chave" > "Criar nova chave"
4. Selecione "JSON"
5. Clique em "Criar"
6. O arquivo será baixado automaticamente

**⚠️ IMPORTANTE**: Guarde este arquivo em local seguro! Ele contém credenciais sensíveis.

## 2. Configurar Google Sheets

### Criar/Abrir Planilha
1. Acesse: https://sheets.google.com
2. Crie uma nova planilha ou abra uma existente
3. Renomeie a primeira aba para: **Ocorrências**

### Adicionar Cabeçalhos (Linha 1)
Copie e cole os seguintes cabeçalhos na primeira linha:

```
Nota | Volumes | Tipo | Solicitante | Data Nota | Data Ocorrência | Transportadora | Cliente | Destino | Estado | Pedido | Ocorrência | Última Ocorrência | Status Cliente | Status Transportadora | Tracking | Obs | Pendência | Status
```

### Copiar ID da Planilha
Na URL da planilha, o ID está entre `/d/` e `/edit`:
```
https://docs.google.com/spreadsheets/d/1ABC-xyz_ESTE_É_O_ID_123/edit
```

### Compartilhar com Conta de Serviço
1. Clique em "Compartilhar" (canto superior direito)
2. Cole o email da conta de serviço
   - Encontre no arquivo JSON baixado: campo `client_email`
   - Exemplo: `sheets-service@projeto-123456.iam.gserviceaccount.com`
3. Selecione permissão: **Editor**
4. Desmarque "Notificar pessoas"
5. Clique em "Compartilhar"

## 3. Configurar Aplicação

### Arquivo .env.local

Crie o arquivo `.env.local` na raiz do projeto:

```env
GOOGLE_SHEET_ID=cole_aqui_o_id_da_planilha
GOOGLE_CLIENT_EMAIL=cole_aqui_o_client_email_do_json
GOOGLE_PRIVATE_KEY="cole_aqui_a_chave_privada_do_json"
```

### Como preencher cada campo:

#### GOOGLE_SHEET_ID
Copie da URL da planilha (entre `/d/` e `/edit`)

#### GOOGLE_CLIENT_EMAIL
Abra o arquivo JSON baixado e copie o valor de `client_email`:
```json
{
  "client_email": "sheets-service@projeto-123.iam.gserviceaccount.com"
}
```

#### GOOGLE_PRIVATE_KEY
Abra o arquivo JSON e copie o valor completo de `private_key`:
```json
{
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
}
```

**⚠️ IMPORTANTE**: 
- Mantenha as aspas duplas ao redor da chave
- Mantenha os `\n` (quebras de linha) como estão
- Copie tudo, incluindo `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`

### Exemplo completo de .env.local:

```env
GOOGLE_SHEET_ID=1ABC-xyz_exemplo_id_123
GOOGLE_CLIENT_EMAIL=sheets-service@projeto-12345.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...(muitos caracteres)...xyz\n-----END PRIVATE KEY-----\n"
```

## 4. Testar Aplicação

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

### Verificações:
- [ ] A página carrega sem erros
- [ ] Você consegue ver a lista vazia ou com dados existentes
- [ ] Ao clicar em "Nova Ocorrência", o modal abre
- [ ] Ao criar uma ocorrência, ela aparece no Google Sheets
- [ ] Ao editar uma ocorrência, as mudanças refletem no Google Sheets
- [ ] Ao deletar uma ocorrência, ela é removida do Google Sheets

## Problemas Comuns

### ❌ Erro: "Falha ao buscar dados"
**Solução**:
- Verifique se a planilha está compartilhada com o email da conta de serviço
- Confirme que o GOOGLE_SHEET_ID está correto
- Verifique se a API do Google Sheets está habilitada

### ❌ Erro: "Invalid grant"
**Solução**:
- A GOOGLE_PRIVATE_KEY pode estar incorreta
- Certifique-se de copiar a chave completa do JSON
- Mantenha os `\n` na chave (não substitua por quebras de linha reais)
- Use aspas duplas ao redor da chave

### ❌ Erro: "Range not found"
**Solução**:
- Verifique se a aba se chama exatamente "Ocorrências"
- Confirme que os cabeçalhos estão na linha 1

### ❌ Erro 403: "Permission denied"
**Solução**:
- A conta de serviço precisa ter permissão de **Editor** na planilha
- Verifique o email da conta de serviço no compartilhamento

## Dicas de Segurança

✅ **NUNCA** commite o arquivo `.env.local`
✅ **NUNCA** compartilhe o arquivo JSON de credenciais
✅ Use variáveis de ambiente em produção
✅ Mantenha o `.gitignore` configurado corretamente

## Links Úteis

- Google Cloud Console: https://console.cloud.google.com/
- Google Sheets API Docs: https://developers.google.com/sheets/api
- Next.js Docs: https://nextjs.org/docs

---

✨ Pronto! Sua aplicação está configurada e funcionando.
