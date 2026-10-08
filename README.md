# Digital Galaxy — Landing page

Landing page institucional da **Digital Galaxy**, consultoria de marketing para negócios locais e médias empresas. Apresenta a proposta de valor, os serviços, os planos mensais, os projetos avulsos, o modelo de trabalho e a equipe, e leva o visitante ao formulário pré-reunião em [diagnostico.digitalgalaxy.com.br](https://diagnostico.digitalgalaxy.com.br).

O conteúdo foi extraído do documento *Estratégia e Planos da Consultoria de Marketing*. Informações internas do documento (faturamento, capacidade financeira, preços de referência de módulos e projetos, pesquisa de mercado e próximos passos) **não** foram publicadas.

## Tecnologias

- **HTML5** semântico
- **CSS3** com variáveis (sem frameworks)
- **JavaScript** vanilla, apenas para menu mobile, header ao rolar, animações de entrada, céu estrelado e links de contato
- Fontes locais (Sora e Orbitron, só os pesos usados), sem dependências externas

## Estrutura

```
/
├── index.html                 Página (todo o conteúdo e SEO)
├── css/
│   ├── style.css              Variáveis, base, tipografia, botões e seções
│   └── responsive.css         Ajustes para notebook, tablet e celular
├── js/
│   └── main.js                Interações + CONFIG de contato (WhatsApp/e-mail)
├── images/
│   ├── logo/                  Logo (SVG), favicon e ícone para iPhone
│   └── og/                    Imagem de compartilhamento (redes e WhatsApp)
├── fonts/                     Sora e Orbitron (woff2)
├── .github/workflows/         Publicação automática no GitHub Pages
├── README.md
└── .gitignore
```

## Executar localmente

Qualquer servidor estático serve. Na pasta do projeto:

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

Também dá para abrir o `index.html` direto no navegador, mas um servidor local reproduz melhor o site publicado.

## Deploy

- **GitHub Pages:** a cada push na branch `main`, o workflow `.github/workflows/pages.yml` publica o site em `https://digitalgalaxy.com.br/` (o endereço `ceodigitalgalaxy.github.io/digitalgalaxy-site/` redireciona para ele). Só `index.html`, `css/`, `js/`, `images/` e `fonts/` vão para o ar.
- **Cache:** o GitHub Pages guarda os arquivos por 10 minutos. Ao mudar CSS ou JS, aumente o número em `?v=` nos links do `<head>` do `index.html`.
- **Segurança:** a política de conteúdo (CSP) fica numa `<meta>` no `<head>`. Ela só permite arquivos do próprio site: para usar um script, fonte ou imagem de outro domínio, inclua o domínio nela. Evite `style="..."` no HTML (a CSP bloqueia); use classes no CSS.

## Onde alterar

| O quê | Onde |
|---|---|
| **Textos** | `index.html`. Cada seção está marcada com um comentário (`<!-- ============ SERVIÇOS ============ -->` etc.) |
| **Perguntas frequentes** | `index.html`, seção `FAQ` (cada pergunta é um `<details>`) |
| **Cores** | `css/style.css`, bloco `:root` (`--color-primary`, `--color-secondary`, `--color-background`…) |
| **Espaçamentos e largura** | `css/style.css`, bloco `:root` (`--container-width`, `--space-*`) |
| **Layout no celular/tablet** | `css/responsive.css` |
| **WhatsApp e e-mail** | `js/main.js`, objeto `CONFIG` no topo. Enquanto estiverem vazios, os botões ficam ocultos |
| **Links do formulário** | `index.html`: busque por `diagnostico.digitalgalaxy.com.br` (cada link tem um `utm_medium` diferente para medir a origem) |
| **Instagram** | `index.html`, rodapé |
| **Logo e favicon** | `images/logo/` |
| **Imagem de compartilhamento** | `images/og/og-digital-galaxy.jpg` (1200×630) |
| **Título e descrição para o Google** | `index.html`, `<title>` e `<meta name="description">` |

### Placeholders a completar

Estes itens não constam no documento de origem e estão marcados no código:

- **E-mail:** `js/main.js` → `CONFIG` (o WhatsApp já está preenchido)
- **Política de privacidade:** `index.html`, rodapé

## Qualidade

Testado em 375, 390, 430, 768, 1024, 1280, 1440 e 1920 px: sem rolagem horizontal, console sem erros, links internos válidos, um único H1, todas as imagens com `alt` e animações desativadas para quem usa "reduzir movimento".
