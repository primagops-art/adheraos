import Link from "next/link";

export default async function SolicitarPage({
  searchParams,
}: {
  searchParams: Promise<{ enviado?: string }>;
}) {
  const { enviado } = await searchParams;

  return (
    <main className="request-page">
      <section className="request-copy">
        <Link href="/">AdheraOS</Link>
        <p>Solicitacao de projeto</p>
        <h1>Conte a demanda. Nos estruturamos o caminho.</h1>
        <span>Sem reuniao obrigatoria, sem atrito: briefing rapido e resposta em ate 48h.</span>
      </section>

      <form className="request-form" action="/api/leads" method="post">
        {enviado === "1" ? (
          <div className="request-success">
            <strong>Solicitacao recebida.</strong>
            <span>Agora vamos analisar a demanda e retornar em ate 48h.</span>
          </div>
        ) : null}
        <label>
          Empresa
          <input name="company_name" required placeholder="Empresa Ltda" />
        </label>
        <label>
          Seu nome
          <input name="contact_name" required placeholder="Nome completo" />
        </label>
        <label>
          WhatsApp
          <input name="whatsapp" required placeholder="+55 (11) 99999-9999" />
        </label>
        <label>
          E-mail
          <input name="email" type="email" required placeholder="voce@suaempresa.com" />
        </label>
        <label>
          Tipo de projeto
          <select name="engagement_type" defaultValue="">
            <option value="" disabled>Selecione...</option>
            <option>Projeto pontual</option>
            <option>Plano recorrente</option>
            <option>Diagnostico primeiro</option>
          </select>
        </label>
        <label>
          Demanda
          <textarea name="project_description" required placeholder="Descreva o processo, problema ou objetivo..." />
        </label>
        <button type="submit">Enviar solicitacao</button>
      </form>
    </main>
  );
}
