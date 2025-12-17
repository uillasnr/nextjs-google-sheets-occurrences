# 🔧 Guia de Solução de Problemas

## Problemas Comuns e Soluções

### 1. ❌ "Falha ao buscar dados do Google Sheets"

#### Sintoma
Ao abrir a aplicação, aparece erro ou a lista fica vazia mesmo tendo dados.

#### Possíveis Causas e Soluções

**A. Planilha não compartilhada**
```
Solução:
1. Abra sua planilha
2. Clique em "Compartilhar"
3. Adicione o email da conta de serviço
4. Defina permissão como "Editor"
5. Clique em "Compartilhar"
```

**B. ID da planilha incorreto**
```
Verifique o .env.local:
GOOGLE_SHEET_ID=1ABC-xyz_ESTE_ID_AQUI

Compare com a URL da planilha:
https://docs.google.com/spreadsheets/d/1ABC-xyz_ESTE_ID_AQUI/edit
```

**C. API não habilitada**
```
1. Acesse: https://console.cloud.google.com/
2. Selecione seu projeto
3. Menu > APIs e Serviços > Biblioteca
4. Procure "Google Sheets API"
5. Clique em "Ativar"
```

**D. Nome da aba incorreto**
```
A aba DEVE se chamar exatamente: Ocorrências
(Com acento mesmo!)

Verifique na planilha e renomeie se necessário.
```

---

### 2. ❌ "Invalid grant" ou "Unauthorized"

#### Sintoma
Erro 401/403 ao tentar acessar a API.

#### Soluções

**A. Chave privada malformatada**
```
Problema: A GOOGLE_PRIVATE_KEY está incorreta

Solução:
1. Abra o arquivo JSON baixado do Google Cloud
2. Localize o campo "private_key"
3. Copie TODO o valor, incluindo:
   - -----BEGIN PRIVATE KEY-----
   - Toda a sequência de caracteres
   - -----END PRIVATE KEY-----
   - Os \n (quebras de linha)

4. No .env.local, cole EXATAMENTE como está:
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMII...\n-----END PRIVATE KEY-----\n"
   
5. MANTENHA as aspas duplas!
6. NÃO substitua \n por quebras de linha reais!
```

**B. Email da conta de serviço incorreto**
```
Verifique o .env.local:
GOOGLE_CLIENT_EMAIL=conta-servico@projeto.iam.gserviceaccount.com

Compare com o arquivo JSON:
{
  "client_email": "conta-servico@projeto.iam.gserviceaccount.com"
}
```

**C. Credenciais expiradas**
```
Se as credenciais foram revogadas:
1. Vá em Google Cloud Console
2. APIs e Serviços > Credenciais
3. Delete a conta de serviço antiga
4. Crie uma nova
5. Baixe novo JSON
6. Atualize o .env.local
7. Compartilhe a planilha com o novo email
```

---

### 3. ❌ "Range not found" ou "Unable to parse range"

#### Sintoma
Erro ao tentar ler dados da planilha.

#### Soluções

**A. Nome da aba incorreto**
```
O código busca por: 'Ocorrências!A2:T'

Verifique:
1. A aba se chama exatamente "Ocorrências"?
2. Tem acento mesmo?
3. Não tem espaços extras?

Renomeie se necessário.
```

**B. Cabeçalhos na linha errada**
```
Os cabeçalhos DEVEM estar na linha 1 (A1:S1)

Verifique:
1. Primeira linha tem os 19 cabeçalhos?
2. Não tem linhas vazias antes?
3. Começa em A1?
```

---

### 4. ❌ Dados não aparecem após criar ocorrência

#### Sintoma
Cria ocorrência, mas não aparece na lista.

#### Soluções

**A. Erro ao adicionar na planilha**
```
1. Abra o DevTools (F12)
2. Vá na aba Console
3. Procure por erros em vermelho
4. Se houver erro de API, verifique permissões
```

**B. Dados adicionados na linha errada**
```
1. Abra a planilha manualmente
2. Verifique se os dados foram adicionados
3. Se estiverem em outra aba, mova para "Ocorrências"
```

**C. Cache do navegador**
```
1. Clique no botão "Atualizar" na aplicação
2. Ou pressione Ctrl+Shift+R (hard refresh)
3. Ou limpe cache do navegador
```

---

### 5. ❌ Erro ao editar ou deletar

#### Sintoma
Botões de Editar/Deletar não funcionam.

#### Soluções

**A. ID da linha incorreto**
```
Verifique no console se há erros com o ID.

O ID é baseado no número da linha no Google Sheets.
Se você deletou linhas manualmente, os IDs podem estar desalinhados.

Solução:
1. Clique em "Atualizar" para recarregar os dados
2. Tente novamente
```

**B. Permissões insuficientes**
```
A conta de serviço precisa ser "Editor", não "Visualizador"

1. Abra a planilha
2. Clique em "Compartilhar"
3. Verifique a permissão da conta de serviço
4. Mude para "Editor" se necessário
```

---

### 6. ❌ Aplicação não inicia (npm run dev)

#### Sintoma
Erros ao executar `npm run dev`.

#### Soluções

**A. Dependências não instaladas**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**B. Porta 3000 em uso**
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou use outra porta:
npm run dev -- -p 3001
```

**C. Versão do Node.js**
```bash
node -v
# Deve ser 18 ou superior

# Se for menor:
# Instale Node.js 18+ de https://nodejs.org/
```

---

### 7. ❌ ".env.local não está sendo lido"

#### Sintoma
Variáveis de ambiente retornam `undefined`.

#### Soluções

**A. Arquivo no local errado**
```
O arquivo DEVE estar na raiz do projeto:
nextjs-google-sheets-occurrences/
├── .env.local          ← AQUI!
├── app/
├── components/
└── ...
```

**B. Nome do arquivo incorreto**
```
Nome correto: .env.local
NÃO: env.local
NÃO: .env
NÃO: .env.local.txt

No Windows, cuidado com extensões ocultas!
```

**C. Reiniciar servidor**
```bash
# Pare o servidor (Ctrl+C)
# Reinicie:
npm run dev
```

---

### 8. ❌ CORS ou "Failed to fetch"

#### Sintoma
Erro de CORS ou requisição bloqueada.

#### Solução

**Este erro NÃO deve acontecer** pois as requisições são server-side.

Se acontecer:
```javascript
// Verifique se você está chamando:
fetch('/api/occurrences')  ✅ CORRETO

// E NÃO:
fetch('http://localhost:3000/api/occurrences')  ❌ ERRADO
fetch('https://sheets.googleapis.com/...')  ❌ ERRADO
```

---

### 9. ❌ "Too many requests" ou Rate Limit

#### Sintoma
Erro 429 ou mensagem de limite de requisições.

#### Solução

A API do Google Sheets tem limites:
- **60 requisições por minuto por usuário**
- **500 requisições por 100 segundos por projeto**

```
1. Evite fazer refresh excessivo
2. Implemente cache (futura melhoria)
3. Aguarde alguns minutos antes de tentar novamente
```

---

### 10. ❌ Datas aparecem erradas

#### Sintoma
Datas mostram valores estranhos ou estão em formato incorreto.

#### Soluções

**A. Formato de data no Google Sheets**
```
Use formato YYYY-MM-DD (ex: 2024-01-15)

Ou deixe o Google Sheets formatar automaticamente:
1. Selecione as colunas de data
2. Formatar > Número > Data
```

**B. Fuso horário**
```javascript
// Se as datas estão um dia atrás/adiante:
// O código já trata isso adicionando 'T00:00:00'
// Verifique o fuso horário do seu navegador
```

---

## 🔍 Como Debugar

### 1. Console do Navegador
```javascript
// Abra DevTools (F12)
// Vá na aba Console
// Procure por:
// - Erros em vermelho
// - Warnings em amarelo
// - Logs de requisições
```

### 2. Network Tab
```
1. Abra DevTools (F12)
2. Aba Network
3. Filtre por "Fetch/XHR"
4. Clique em cada requisição
5. Veja Response/Preview
```

### 3. Logs do Servidor
```bash
# Terminal onde você rodou npm run dev
# Verifique os logs que aparecem
# Especialmente erros em vermelho
```

### 4. Verificar Google Sheets Diretamente
```
1. Abra a planilha no navegador
2. Verifique:
   - Dados estão sendo salvos?
   - Estrutura está correta?
   - Permissões estão OK?
```

---

## 📋 Checklist de Verificação Geral

Quando algo não funcionar, verifique nesta ordem:

- [ ] **1. Variáveis de ambiente (.env.local)**
  - Arquivo existe e está na raiz?
  - As 3 variáveis estão definidas?
  - Valores estão corretos (sem espaços extras)?

- [ ] **2. Google Cloud**
  - API do Google Sheets está habilitada?
  - Conta de serviço existe?
  - JSON foi baixado?

- [ ] **3. Google Sheets**
  - Planilha está compartilhada?
  - Email da conta de serviço está correto?
  - Permissão é "Editor"?
  - Aba se chama "Ocorrências"?
  - Cabeçalhos estão na linha 1?

- [ ] **4. Servidor**
  - npm install foi executado?
  - npm run dev está rodando?
  - Servidor reiniciou após mudar .env.local?

- [ ] **5. Navegador**
  - Sem erros no Console?
  - Requisições aparecem na aba Network?
  - Cache foi limpo?

---

## 🆘 Ainda com Problemas?

### Logs Completos

Execute com logs detalhados:
```bash
NODE_ENV=development npm run dev
```

### Teste de Credenciais

Crie um arquivo `test-credentials.js`:
```javascript
const { google } = require('googleapis');

async function test() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });
    console.log('✅ Sucesso!', response.data.properties.title);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

test();
```

Execute:
```bash
node test-credentials.js
```

---

## 📞 Recursos Adicionais

- [Google Sheets API Docs](https://developers.google.com/sheets/api)
- [Next.js Troubleshooting](https://nextjs.org/docs/messages)
- [googleapis NPM](https://www.npmjs.com/package/googleapis)

---

💡 **Dica**: Mantenha sempre um backup da sua planilha!
