# Digital Galaxy — site institucional

Landing page estática (HTML, CSS e JS puros) da Digital Galaxy.

- Prévia: https://ceodigitalgalaxy.github.io/digitalgalaxy-site/
- Produção: https://digitalgalaxy.com.br

## Estrutura

```
index.html            página única, cada seção marcada com <!-- ===== NOME ===== -->
css/style.css         estilos; cores e espaçamentos nas variáveis do topo (:root)
css/responsive.css    ajustes para tablet e celular
js/main.js            interações; contatos no objeto CONFIG
images/logo/          logo, favicons
images/og/            imagem de compartilhamento (Open Graph)
fonts/                Sora e Orbitron (woff2, locais)
```

## Onde alterar cada coisa

| O quê | Onde |
|---|---|
| Textos, planos, serviços, FAQ | `index.html`, na seção correspondente |
| Cores, fontes, espaçamentos | variáveis `--color-*` no topo de `css/style.css` |
| WhatsApp, mensagem padrão, e-mail | objeto `CONFIG` no início de `js/main.js` |
| Fotos da equipe | seção QUEM SOMOS no `index.html` (placeholders marcados) |
| Imagem de compartilhamento | `images/og/og-digital-galaxy.jpg` (1200×630) |

Os botões de WhatsApp e o e-mail do rodapé ficam ocultos enquanto os campos do `CONFIG` estiverem vazios.

## Publicação

- **GitHub Pages:** publicado a partir da branch `main` (raiz). Cada alteração na `main` entra no ar em ~1 minuto.
- **HostGator:** compactar os arquivos (sem `README.md` e `.gitignore`) e extrair na `public_html` pelo Gerenciador de Arquivos do cPanel.
