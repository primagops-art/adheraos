import fs from "node:fs";
import path from "node:path";
import Script from "next/script";

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
  const style = extract(source, /<style>/i, /<\/style>/i);
  const body = extract(source, /<body>/i, /<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r128\/three\.min\.js"><\/script>/i);
  const inlineScript = extract(source, /<script>\s*\(function\(\)/i, /<\/script>\s*<\/body>/i);

  return {
    style,
    body,
    inlineScript: `
function runAdheraLegacy() {
  if (!window.THREE) {
    window.setTimeout(runAdheraLegacy, 50);
    return;
  }
  (function()${inlineScript}
}
runAdheraLegacy();
`,
  };
}

const landing = readLanding();

const leadCaptureOverride = `
window.submitForm = async function submitForm() {
  const btn = document.querySelector('#tp-contato .btn-form');
  const originalText = btn ? btn.textContent : '';
  if (btn) {
    btn.textContent = 'Enviando...';
    btn.style.opacity = '.65';
    btn.disabled = true;
  }

  const empresa = document.querySelector('#tp-empresa');
  const projeto = document.querySelector('#tp-projeto');
  const contato = document.querySelector('#tp-contato');
  const pick = (root, selector, index = 0) => root?.querySelectorAll(selector)?.[index]?.value?.trim() || '';

  const payload = {
    company_name: pick(empresa, 'input', 0),
    industry: pick(empresa, 'select', 0),
    team_size: pick(empresa, 'select', 1),
    revenue_range: pick(empresa, 'select', 2),
    pain_point: pick(projeto, 'select', 0),
    engagement_type: pick(projeto, 'select', 1),
    project_description: pick(projeto, 'textarea', 0),
    contact_name: pick(contato, 'input', 0),
    whatsapp: pick(contato, 'input', 1),
    email: pick(contato, 'input', 2),
    source: pick(contato, 'select', 0),
    source_path: window.location.pathname
  };

  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Lead request failed');
    document.querySelectorAll('.form-h,.form-s,.form-tabs,.tab-panel').forEach(el => el.style.display = 'none');
    document.getElementById('successMsg')?.classList.add('on');
  } catch (error) {
    alert('Nao foi possivel enviar agora. Tente novamente em instantes.');
    if (btn) {
      btn.textContent = originalText || 'Enviar briefing ->';
      btn.style.opacity = '1';
      btn.disabled = false;
    }
  }
};
`;

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: landing.style }} />
      <div dangerouslySetInnerHTML={{ __html: landing.body }} />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="afterInteractive" />
      <Script id="adhera-legacy" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: landing.inlineScript }} />
      <Script id="adhera-lead-capture" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: leadCaptureOverride }} />
    </>
  );
}
