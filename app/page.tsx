import fs from "node:fs";
import path from "node:path";

function extract(source: string, start: RegExp, end: RegExp) {
  const startMatch = source.match(start);
  if (!startMatch || startMatch.index === undefined) return "";
  const from = startMatch.index + startMatch[0].length;
  const rest = source.slice(from);
  const endMatch = rest.match(end);
  if (!endMatch || endMatch.index === undefined) return "";
  return rest.slice(0, endMatch.index);
}

function readLanding() {
  const source = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf8");

  const style = [...source.matchAll(/<style>([\s\S]*?)<\/style>/g)]
    .map((m) => m[1])
    .join("\n");

  const body = extract(source, /<body[^>]*>/i, /<script>/i);
  const inlineScript = extract(source, /<script>/i, /<\/script>/i);

  return { style, body, inlineScript };
}

const landing = readLanding();

const briefingFormBridge = `
(function() {
  var form = document.getElementById('briefingForm');
  if (!form) return;

  function val(name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el ? String(el.value || '').trim() : '';
  }
  function chips(group) {
    var nodes = document.querySelectorAll('.bchip-group[data-name="' + group + '"] .bchip.selected');
    return Array.prototype.map.call(nodes, function(n) { return n.dataset.value; });
  }
  function radio(group) {
    var el = document.querySelector('.bradio-group[data-name="' + group + '"] .bradio.selected');
    return el ? el.dataset.value : '';
  }

  form.addEventListener('submit', function() {
    var detalhes = [
      val('site') ? 'Site/Instagram: ' + val('site') : '',
      chips('processos').length ? 'Processos hoje: ' + chips('processos').join(', ') : '',
      val('ferramentas') ? 'Ferramentas: ' + val('ferramentas') : '',
      radio('equipe_ti') ? 'Equipe de TI: ' + radio('equipe_ti') : '',
      val('perdas') ? 'Maiores perdas de tempo: ' + val('perdas') : '',
      val('problema90') ? 'Prioridade nos proximos 90 dias: ' + val('problema90') : '',
      'Impacto do problema (1-10): ' + val('impacto'),
      val('consequencia') ? 'Consequencia se nao resolver: ' + val('consequencia') : '',
      chips('solucao').length ? 'O que deseja construir: ' + chips('solucao').join(', ') : '',
      val('resultados') ? 'Resultados esperados: ' + val('resultados') : '',
      val('prazo') ? 'Prazo desejado: ' + val('prazo') : '',
      val('orcamento') ? 'Orcamento: ' + val('orcamento') : '',
      val('cargo') ? 'Cargo do contato: ' + val('cargo') : '',
      val('visao') ? 'Visao de futuro: ' + val('visao') : ''
    ].filter(Boolean).join('\\n');

    var description = val('desafio');
    if (detalhes) description += '\\n\\n--- Diagnostico completo ---\\n' + detalhes;

    var payload = {
      company_name: val('empresa'),
      industry: val('segmento'),
      team_size: val('equipe'),
      revenue_range: val('faturamento') || val('orcamento'),
      pain_point: chips('processos').join(', '),
      engagement_type: chips('solucao').join(', '),
      project_description: description,
      contact_name: val('nome'),
      whatsapp: val('whatsapp'),
      email: val('email'),
      source: 'landing-briefing',
      source_path: window.location.pathname
    };

    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(function() {});
  });
})();
`;

export default function Home() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://api.fontshare.com/v2/css?f[]=general-sans@500,600,700,800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: landing.style }} />
      <div dangerouslySetInnerHTML={{ __html: landing.body }} />
      <script dangerouslySetInnerHTML={{ __html: landing.inlineScript }} />
      <script dangerouslySetInnerHTML={{ __html: briefingFormBridge }} />
    </>
  );
}
