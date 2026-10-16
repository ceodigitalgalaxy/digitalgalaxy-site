/* ==========================================================================
   Digital Galaxy — Google Analytics 4, Google Ads e Pixel da Meta
   --------------------------------------------------------------------------
   IDs: GA_ID (Analytics), ADS_ID (Google Ads) e ADS_LEAD_LABEL (rótulo da
   conversão "Lead" do Google Ads, o trecho depois da barra em
   send_to: "AW-.../rótulo"). Enquanto ADS_LEAD_LABEL estiver vazio, a
   conversão do Ads não é enviada. META_PIXEL_ID: Pixel da Meta. A tag do Google (gtag.js) é carregada no
   <head> do index.html; este arquivo faz a configuração e registra os
   eventos. Fica num arquivo próprio porque a política de segurança (CSP) do
   site não permite script escrito direto no HTML.

   Eventos enviados:
   - cta_click        clique em "Decolar…" / "Solicitar orçamento" (cta_origem: hero, menu, servicos…)
   - whatsapp_click   clique em qualquer link de WhatsApp
   - generate_lead    formulário de contato enviado com sucesso (disparado em js/main.js);
                      também envia a conversão "Lead" do Google Ads e o evento
                      "Lead" do Pixel da Meta
   No Pixel da Meta: PageView (visita), Lead (formulário), Contact (WhatsApp)
   e CTAClick (botões, evento personalizado).
   Dados pessoais (nome, e-mail, telefone) nunca são enviados.
   ========================================================================== */
const GA_ID = "G-95ECW98DXY";
const ADS_ID = "AW-17664101572";
const ADS_LEAD_LABEL = "";   // PLACEHOLDER: rótulo da conversão "Lead" do Google Ads
const META_PIXEL_ID = "1663876148441409";

window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
window.gtag = gtag;
gtag("js", new Date());
gtag("config", GA_ID);
gtag("config", ADS_ID);

// Pixel da Meta (código oficial, carregado daqui por causa da CSP)
/* eslint-disable */
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,"script","https://connect.facebook.net/en_US/fbevents.js");
/* eslint-enable */
fbq("init", META_PIXEL_ID);
fbq("track", "PageView");

// Atalho usado pelo restante do site: dgTrack("nome_do_evento", { parametro: "valor" })
window.dgTrack = (name, params = {}) => {
  gtag("event", name, params);
  if (name === "generate_lead") {
    if (ADS_LEAD_LABEL) gtag("event", "conversion", { send_to: `${ADS_ID}/${ADS_LEAD_LABEL}` });
    fbq("track", "Lead", { content_name: "Formulário do site", cta_origem: params.cta_origem || "" });
  }
  if (name === "whatsapp_click") fbq("track", "Contact");
  if (name === "cta_click") fbq("trackCustom", "CTAClick", { cta_origem: params.cta_origem || "" });
};

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  if (link.dataset.cta) window.dgTrack("cta_click", { cta_origem: link.dataset.cta, cta_texto: link.textContent.trim().slice(0, 60) });
  else if (/^https:\/\/wa\.me\//.test(link.href)) window.dgTrack("whatsapp_click", { link_origem: link.closest("footer") ? "rodape" : "contato" });
});
