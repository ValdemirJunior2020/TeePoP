# SETUP - TeePoP Caixa & Gestão

## 1. Instalar e rodar o frontend

```bash
cd client
npm install
npm run dev
```

Abra o endereço mostrado no terminal, geralmente:

```txt
http://localhost:5173
```

## 2. Configurar o backend no Google Apps Script

1. Abra o Google Sheet TeePop.
2. Vá em **Extensões > Apps Script**.
3. Crie/abra o arquivo `Code.gs`.
4. Cole o conteúdo completo de:

```txt
google-apps-script/Code.gs
```

5. Salve.
6. Execute a função `ensureSetup`.
7. Autorize as permissões.

## 3. Publicar como Web App

No Apps Script:

1. Clique em **Implantar**.
2. Clique em **Nova implantação**.
3. Selecione **Aplicativo da Web**.
4. Configuração:

```txt
Executar como: Eu
Quem tem acesso: Qualquer pessoa
```

5. Clique em **Implantar**.
6. Copie a URL terminando com `/exec`.

## 4. Criar arquivo .env

Dentro da pasta `client`, crie o arquivo `.env`:

```txt
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/SEU_DEPLOYMENT_ID/exec
```

## 5. Rodar novamente

```bash
npm run dev
```

## 6. Build de produção

```bash
npm run build
```

## 7. Deploy no Netlify

Use estas configurações:

```txt
Base directory: client
Build command: npm run build
Publish directory: client/dist
```

Adicione esta variável no Netlify:

```txt
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/SEU_DEPLOYMENT_ID/exec
```
