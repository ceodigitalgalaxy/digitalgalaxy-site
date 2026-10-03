# Digital Galaxy — Landing page

Landing page institucional da **Digital Galaxy**, consultoria de marketing para negócios locais e médias empresas. Segue o modelo AIDA (hero, dor, método, como funciona, serviços, resultados, oferta do mês teste, para quem é, projetos avulsos, FAQ e CTA final) e leva o visitante ao formulário pré-reunião em [diagnostico.digitalgalaxy.com.br](https://diagnostico.digitalgalaxy.com.br).

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

- **Prévia (GitHub Pages):** a cada push na branch `main`, o workflow `.github/workflows/pages.yml` publica o site em `https://ceodigitalgalaxy.github.io/digitalgalaxy-site/`.
- **Domínio principal (HostGator):** envie o conteúdo do projeto (`index.html`, `css/`, `js/`, `images/`, `fonts/`) para a pasta `public_html` do cPanel, pelo Gerenciador de Arquivos. Faça backup da `public_html` antes.

## Onde alterar

| O quê | Onde |
|---|---|
| **Textos** | `index.html`. Cada seção está marcada com um comentário (`<!-- ============ 4. DOR (Interesse) ============ -->` etc.) |
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

Os textos entre `[colchetes]` ficam **ocultos no site** até serem preenchidos:

| O quê | Onde | Como aparece |
|---|---|---|
| **WhatsApp e e-mail** | `js/main.js` → `CONFIG` | Preenchido o número, aparecem o botão do hero, o link do CTA final, o botão flutuante (celular) e o contato no rodapé |
| **Faixa de prova e seção Resultados** | `index.html` (seções `FAIXA DE PROVA` e `RESULTADOS`) | Mude `SHOW_PROOF` para `true` em `js/main.js`. Também mostra o link "Resultados" no menu e no rodapé |
| **Preços dos projetos avulsos** | `index.html`, `a partir de R$ [valor]` | Aparece quando o valor não tem colchetes. Para não exibir, apague o texto |
| **Perguntas do FAQ** (preço do plano, responsável pela conta, relatório) | `index.html`, seção `FAQ` | Aparece quando a resposta não tem colchetes |
| **Cidade/UF e CNPJ** | `index.html`, rodapé | Aparece quando não tem colchetes |
| **Escassez no CTA final** | `index.html`, comentário em `CTA FINAL` | Descomente só se for verdade |
| **Política de privacidade** | `index.html`, rodapé | — |

Qualquer elemento com o atributo `data-fill` segue essa regra (`setupPlaceholders` em `js/main.js`).

### Rastreamento

Os botões têm `data-track` (`cta_quiz`, `cta_whatsapp`, `cta_orcamento`) e `data-origin` (seção de origem). Se o GA4 (`gtag` ou `dataLayer`) ou o Meta Pixel (`fbq`) estiverem instalados no `<head>`, o clique vira evento. Sem eles, nada acontece.

## Qualidade

Testado em 375, 768 e 1440 px: sem rolagem horizontal, console sem erros, links internos válidos, um único H1, todas as imagens com `alt` e animações desativadas para quem usa "reduzir movimento".
