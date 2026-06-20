# AdheraOS — site estático

Pasta final, pronta para publicar em **adheraos.com**.

## Estrutura

```
AdheraOS-Site/
├── site/                  ← isso é o site (raiz do deploy)
│   ├── index.html         landing page
│   ├── diagnostico.html   fluxo de diagnóstico (6 etapas)
│   ├── acesso.html        login do portal (demo)
│   └── portal.html        portal do cliente (AdheraOS)
├── email-template/
│   └── email-acesso.html  template de email transacional
└── README.md
```

`email-acesso.html` **não é uma página do site** — não está linkada de lugar nenhum e não deve ser publicada junto com `site/`. É o template que seu sistema de email dispara para o cliente depois do diagnóstico.

## Fluxo testado (local e via servidor)

- Landing → "Portal" / "Client portal" → `acesso.html` → login demo → `portal.html` ✓
- Landing → "Start now" / "Request diagnostic" → `diagnostico.html` ✓
- `acesso.html` → "No access yet? Start with a diagnostic" → `diagnostico.html` ✓
- `email-acesso.html` → botão "Access your proposal" → `https://adheraos.com/acesso.html` (URL absoluta — email não abre arquivo local) ✓

Todos os links dentro de `site/` são relativos (`acesso.html`, `diagnostico.html`, `portal.html`, sem `/` na frente), então o fluxo funciona tanto abrindo `index.html` direto no navegador quanto hospedado em qualquer domínio/subpasta.

**Mudança que fiz e que vale registrar:** os botões "Start now" / "Request diagnostic" da landing antes abriam um pop-up com uma cópia inteira e duplicada do fluxo de diagnóstico (embutida via iframe), e o link real para `diagnostico.html` ficava morto. Troquei para link direto a `diagnostico.html`, removendo a duplicação — assim o diagnóstico vive em um único lugar e a navegação fica consistente com o resto do site. Você confirmou essa troca antes de eu aplicar.

## O que não foi tocado

- Design brutalista preto-e-branco externo; paleta neon e sidebar P&B dentro do portal — sem alterações.
- Lógica da intro do portal (digitação, geolocalização, reaparecer no `pageshow`) — idêntica, byte a byte, ao original.
- Logos embutidas em base64 — idênticas.
- Todo o conteúdo em inglês — inalterado.
- A pasta `assets/` que já existia no seu projeto não é usada por nenhuma das 4 páginas (todas as imagens/logos do site vêm embutidas em base64 direto no HTML) — não toquei nela nem a incluí no deploy.

## Login de demonstração

`acesso.html` é uma demo de front-end, sem backend. Credencial fixa no código-fonte:

```
cliente@adheraos.com / adhera2026
```

Isso **não é autenticação real** — qualquer pessoa que abrir o código-fonte da página vê a senha. Funciona para demonstração, mas para login de verdade no futuro você vai precisar de um backend (verificação de senha no servidor, sessão, etc.). Mantive como estava, só anotando aqui para não esquecer.

## Como atualizar conteúdo

Cada página é um único arquivo `.html` autocontido (CSS e JS inline, sem etapa de build). Para mudar texto, abra o arquivo, ache o trecho e edite direto — o arquivo salvo já é o arquivo final, não precisa compilar nada.

## Como republicar (Vercel)

O projeto Vercel está conectado ao repositório GitHub (`primagops-art/adheraos`), com **Root Directory = `site`**. Deploy é automático:

- Push em `main` → deploy de produção.
- Push em outra branch / PR → deploy de preview (URL própria, não afeta produção).

Para publicar qualquer atualização: edite os arquivos dentro de `site/`, comite e dê `git push`. Não precisa rodar nada manualmente.

### Deploy manual via CLI (alternativa, raramente necessário)

1. Instalar a CLI uma vez: `npm i -g vercel`
2. Entrar na pasta `site/` — **é só essa pasta que vai pro ar**, não a `AdheraOS-Site/` toda:
   ```
   cd site
   ```
3. Login (essa etapa é com você): `vercel login`
4. Deploy de teste: `vercel` → gera uma URL de preview para revisar antes de ir ao ar
5. Deploy em produção: `vercel --prod`

### Domínio

`adheraos.com` e `www.adheraos.com` já estão configurados em *Settings → Domains* do projeto Vercel.

## Observação sobre o email

`email-acesso.html` usa dois placeholders que seu sistema de envio (ESP) deve preencher: `{{FIRST_NAME}}` (nome do destinatário) e `{{MANAGE_URL}}` (link de preferências). O botão já aponta para `https://adheraos.com/acesso.html` — isso só vai responder de fato depois que o domínio estiver publicado.
