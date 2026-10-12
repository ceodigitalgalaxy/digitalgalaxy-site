/* ==========================================================================
   Digital Galaxy — Google Analytics 4 e Google Ads
   --------------------------------------------------------------------------
   IDs: GA_ID (Analytics), ADS_ID (Google Ads) e ADS_LEAD_LABEL (rótulo da
   conversão "Lead" do Google Ads, o trecho depois da barra em
   send_to: "AW-.../rótulo"). Enquanto ADS_LEAD_LABEL estiver vazio, a
   conversão do Ads não é enviada. A tag do Google (gtag.js) é carregada no
   <head> do index.html; este arquivo faz a configuração e registra os
   eventos. Fica num arquivo próprio porque a política de segurança (CSP) do
   site não permite script escrito direto no HTML.

   Eventos enviados:
   - cta_click        clique em "Decolar…" / "Solicitar orçamento" (cta_origem: hero, menu, servicos…)
   - whatsapp_click   clique em qualquer link de WhatsApp
   - generate_lead    formulário de contato enviado com sucesso (disparado em js/main.js);
                      também envia a conversão "Lead" do Google Ads
   Dados pessoais (nome, e-mail, telefone) nunca são enviados.
   ========================================================================== */
const GA_ID = "G-95ECW98DXY";
const ADS_ID = "AW-17664101572";
const ADS_LEAD_LABEL = "";   // PLACEHOLDER: rótulo da conversão "Lead" do Google Ads

window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
window.gtag = gtag;
gtag("js", new Date());
gtag("config", GA_ID);
gtag("config", ADS_ID);

// Atalho usado pelo restante do site: dgTrack("nome_do_evento", { parametro: "valor" })
window.dgTrack = (name, params = {}) => {
  gtag("event", name, params);
  if (name === "generate_lead" && ADS_LEAD_LABEL) gtag("event", "conversion", { send_to: `${ADS_ID}/${ADS_LEAD_LABEL}` });
};

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  if (link.dataset.cta) window.dgTrack("cta_click", { cta_origem: link.dataset.cta, cta_texto: link.textContent.trim().slice(0, 60) });
  else if (/^https:\/\/wa\.me\//.test(link.href)) window.dgTrack("whatsapp_click", { link_origem: link.closest("footer") ? "rodape" : "contato" });
});
