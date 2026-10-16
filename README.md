# Digital Galaxy — Landing page

Landing page institucional da **Digital Galaxy**, agência de marketing digital. Apresenta o método de trabalho, os serviços, os projetos avulsos e as dúvidas frequentes, e termina num formulário de contato que grava os leads na mesma planilha do formulário de diagnóstico.

O conteúdo foi extraído do documento *Estratégia e Planos da Consultoria de Marketing*. Informações internas do documento (faturamento, capacidade financeira, preços de referência de módulos e projetos, pesquisa de mercado e próximos passos) **não** foram publicadas.

## Tecnologias

- **HTML5** semântico
- **CSS3** com variáveis (sem frameworks)
- **JavaScript** vanilla: animações (galáxia, cards, dúvidas, estrela do selo), menu, carrossel e formulário de contato
- [Lenis](https://github.com/darkroomengineering/lenis) para a rolagem suave (arquivo local em `site/js/vendor/`)
- Fontes locais (Sora e Orbitron, só os pesos usados)
- Medição: Google Analytics 4, Google Ads e Pixel da Meta (`site/js/analytics.js`)

## Estrutura

Tudo o que vai para o ar fica em `site/`, que é a raiz do domínio (`site/robots.txt` é publicado como `/robots.txt`). Fora dela ficam só arquivos de manutenção.

```
/
├── site/                          ← publicado em https://digitalgalaxy.com.br/
│   ├── index.html                 Página (conteúdo, SEO, dados estruturados e CSP)
│   ├── css/
│   │   ├── style.css              Variáveis, base, tipografia, botões e seções
│   │   └── responsive.css         Ajustes para notebook, tablet e celular
│   ├── js/
│   │   ├── main.js                Interações, animações e formulário + CONFIG de contato
│   │   ├── analytics.js           Google Analytics 4, Google Ads e Pixel da Meta
│   │   └── vendor/lenis.min.js    Rolagem suave (biblioteca de terceiros)
│   ├── images/
│   │   ├── logo/                  Logo (SVG), favicons e ícones (96, 192, 512 px e iPhone)
│   │   ├── og/                    Imagem de compartilhamento (redes e WhatsApp)
│   │   └── servicos/              Fotos dos cards de serviço (WebP)
│   ├── fonts/                     Sora e Orbitron (woff2)
│   ├── favicon.ico                Ícone que o Google e os navegadores buscam na raiz
│   ├── site.webmanifest           Nome e ícones do site para celulares
│   ├── robots.txt                 Regras para buscadores
│   └── sitemap.xml                Páginas do site para o Google
├── .github/workflows/pages.yml    Publicação automática no GitHub Pages
├── .gitattributes                 Quebras de linha e arquivos binários
├── .gitignore
└── README.md
```

## Executar localmente

Qualquer servidor estático serve, apontando para a pasta `site/`. Na pasta do projeto:

```bash
python3 -m http.server 8080 --directory site
# abra http://localhost:8080
```

Também dá para abrir o `site/index.html` direto no navegador, mas um servidor local reproduz melhor o site publicado.

## Deploy

- **GitHub Pages:** a cada push na branch `main`, o workflow `.github/workflows/pages.yml` publica o site em `https://digitalgalaxy.com.br/` (o endereço `ceodigitalgalaxy.github.io/digitalgalaxy-site/` redireciona para ele). Só o conteúdo da pasta `site/` vai para o ar; um arquivo novo colocado nela é publicado automaticamente.
- **Domínio (DNS na HostGator):** `digitalgalaxy.com.br` com 4 registros A para o GitHub Pages (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`); `www` e `diagnostico` com CNAME para `ceodigitalgalaxy.github.io`. Os registros de e-mail (MX, `mail`, SPF, DKIM, DMARC) continuam na HostGator. Mudanças de plano na HostGator podem trocar esses registros: se o site sair do ar, confira o Editor de Zona do cPanel.
- **Cache:** o GitHub Pages guarda os arquivos por 10 minutos. Ao mudar CSS ou JS, aumente o número em `?v=` nos links do `<head>` do `site/index.html`.
- **Segurança:** a política de conteúdo (CSP) fica numa `<meta>` no `<head>`. Ela só permite arquivos do próprio site: para usar um script, fonte ou imagem de outro domínio, inclua o domínio nela. Evite `style="..."` no HTML (a CSP bloqueia); use classes no CSS.

## Onde alterar

| O quê | Onde |
|---|---|
| **Textos** | `site/index.html`. Cada seção está marcada com um comentário (`<!-- ============ SERVIÇOS ============ -->` etc.) |
| **Perguntas frequentes** | `site/index.html`, seção `FAQ` (cada pergunta é um `<details>`) |
| **Cores** | `site/css/style.css`, bloco `:root` (`--color-primary`, `--color-secondary`, `--color-background`…) |
| **Espaçamentos e largura** | `site/css/style.css`, bloco `:root` (`--container-width`, `--space-*`) |
| **Layout no celular/tablet** | `site/css/responsive.css` |
| **WhatsApp e e-mail** | `site/js/main.js`, objeto `CONFIG` no topo. Enquanto estiverem vazios, os botões ficam ocultos |
| **Formulário de contato** | `site/index.html`, seção `CONTATO`. Os botões do site levam até ele (`href="#contato"`) e o `data-cta` de cada um é gravado na coluna `botao_origem`. Os envios vão para a mesma planilha do formulário de diagnóstico (Google Apps Script, URL em `data-endpoint` no `<form>`). Para trocar a planilha, troque essa URL e a do `connect-src` da CSP |
| **Instagram** | `site/index.html`, rodapé |
| **Logo e favicon** | `site/images/logo/` |
| **Imagem de compartilhamento** | `site/images/og/og-digital-galaxy.jpg` (1200×630) |
| **Título e descrição para o Google** | `site/index.html`, `<title>` e `<meta name="description">` |

### Placeholders a completar

Estes itens não constam no documento de origem e estão marcados no código:

- **E-mail:** `site/js/main.js` → `CONFIG` (o WhatsApp já está preenchido)
- **Política de privacidade:** `site/index.html`, rodapé

## Qualidade

Testado em 375, 390, 430, 768, 1024, 1280, 1440 e 1920 px: sem rolagem horizontal, console sem erros, links internos válidos, um único H1, todas as imagens com `alt` e animações desativadas para quem usa "reduzir movimento".

## Google Analytics 4, Google Ads e Pixel da Meta

- **ID de medição:** `G-95ECW98DXY`, em `site/js/analytics.js` (`GA_ID`) e na tag `gtag.js` do `<head>` do `site/index.html`.
- A configuração fica em `site/js/analytics.js` porque a política de segurança (CSP) do site não permite script escrito direto no HTML. A CSP libera só os domínios do Google Analytics (`googletagmanager.com`, `google-analytics.com`, `analytics.google.com`).
- **Eventos:** `cta_click` (botões "Decolar…" e "Solicitar orçamento", com `cta_origem`), `whatsapp_click` e `generate_lead` (formulário enviado com sucesso, com `cta_origem`, `objetivo` e `investimento`). Nome, e-mail e telefone nunca são enviados.
- **Google Ads:** `AW-17664101572` (`ADS_ID` em `site/js/analytics.js`). A conversão "Lead" é enviada junto com o `generate_lead` quando `ADS_LEAD_LABEL` estiver preenchido com o rótulo da ação de conversão (o trecho depois da barra em `send_to`).
- **Pixel da Meta:** `1663876148441409` (`META_PIXEL_ID` em `site/js/analytics.js`), com `PageView`, `Lead` (formulário enviado), `Contact` (WhatsApp) e `CTAClick` (botões, evento personalizado). A imagem de reserva para quem está sem JavaScript fica logo depois do `<body>`.
- Para outras ferramentas, adicione os domínios delas na CSP do `site/index.html`.
