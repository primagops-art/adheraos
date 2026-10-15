# AdheraOS — site e portal operacional

Esta é a pasta operacional do site público e do portal de clientes da Adhera.

## Como abrir no Windows

Não abra `index.html`, `acesso.html` ou `portal.html` diretamente pelo Explorador. O portal usa rotas HTTP e uma sessão de autenticação do Supabase; por isso, o modo `file://` não reproduz o funcionamento real.

Na raiz desta pasta, use um dos atalhos:

- `Abrir Portal AdheraOS.cmd` — inicia o servidor local e abre a tela de acesso do portal.
- `Abrir Site Adhera.cmd` — inicia o servidor local e abre o site institucional.
- `Parar AdheraOS Local.cmd` — encerra somente o servidor local iniciado por esses atalhos.

O servidor roda oculto e escolhe a primeira porta livre entre `4173` e `4182`.

## Estrutura

```text
AdheraOS - Recuperacao Legacy/
├── Abrir Portal AdheraOS.cmd
├── Abrir Site Adhera.cmd
├── Parar AdheraOS Local.cmd
├── site/                         # raiz do site e do deploy
│   ├── index.html                # site institucional
│   ├── acesso.html               # autenticação
│   ├── portal.html               # painel do cliente
│   ├── supabase-config.js        # configuração pública do cliente Supabase
│   └── portal/adheraos-client/   # imagens e arquivos do painel
├── supabase/                     # scripts e configuração do Supabase
├── email-template/               # modelos de e-mail
└── tools/                        # servidor e scripts de abertura local
```

## Alternativa pelo terminal

Com Node.js instalado:

```powershell
cd site
npm run dev
```

Depois, acesse:

- Site: `http://127.0.0.1:4173/`
- Login: `http://127.0.0.1:4173/acesso`
- Portal: `http://127.0.0.1:4173/portal`

## Autenticação

O acesso é validado pelo projeto Supabase configurado em `site/supabase-config.js`. Credenciais de usuário não são gravadas neste repositório.

## Produção

- Projeto Vercel: `adheraos`
- Raiz publicada: `site/`
- URL: `https://adheraos.com`

Os arquivos temporários do servidor local ficam em `tools/` e são ignorados pelo Git.
