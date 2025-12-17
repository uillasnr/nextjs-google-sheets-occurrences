# 🚀 Início Rápido - 5 Minutos

## Pré-requisitos
- ✅ Node.js 18+ instalado
- ✅ Conta Google

## Passos Rápidos

### 1️⃣ Configurar Google Cloud (2 min)

1. Acesse: https://console.cloud.google.com/
2. Crie novo projeto
3. Ative "Google Sheets API" (Menu > APIs e Serviços > Biblioteca)
4. Crie Conta de Serviço (Menu > APIs e Serviços > Credenciais)
5. Baixe arquivo JSON de credenciais

### 2️⃣ Preparar Planilha (1 min)

1. Crie planilha no Google Sheets
2. Renomeie aba para "Ocorrências"
3. Adicione cabeçalhos (linha 1):
   ```
   Nota | Volumes | Tipo | Solicitante | Data Nota | Data Ocorrência | Transportadora | Cliente | Destino | Estado | Pedido | Ocorrência | Última Ocorrência | Status Cliente | Status Transportadora | Tracking | Obs | Pendência | Status
   ```
4. Compartilhe com email da conta de serviço (do JSON)

### 3️⃣ Configurar Projeto (2 min)

```bash
# Instalar
npm install

# Criar .env.local
GOOGLE_SHEET_ID=seu_id_aqui
GOOGLE_CLIENT_EMAIL=email_do_json
GOOGLE_PRIVATE_KEY="chave_privada_do_json"

# Rodar
npm run dev
```

### 4️⃣ Testar
- Acesse: http://localhost:3000
- Crie uma ocorrência
- Verifique no Google Sheets

## ✅ Pronto!

Leia os arquivos completos para mais detalhes:
- `README.md` - Documentação completa
- `SETUP_GUIDE.md` - Guia passo a passo detalhado
- `PROJECT_OVERVIEW.md` - Visão técnica do projeto
