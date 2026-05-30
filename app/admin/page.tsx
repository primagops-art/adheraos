type Lead = {
  id: string;
  created_at: string;
  status: string;
  company_name: string;
  contact_name: string;
  whatsapp: string;
  email: string;
  pain_point: string | null;
  engagement_type: string | null;
  project_description: string;
};

export const dynamic = "force-dynamic";

async function getLeads(): Promise<Lead[]> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !serviceKey) return [];

  const response = await fetch(
    `${supabaseUrl}/rest/v1/leads?select=*&order=created_at.desc&limit=50`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) return [];
  return response.json();
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const adminToken = process.env.ADHERA_ADMIN_TOKEN || process.env.adhera_admin_token;

  if (!adminToken || token !== adminToken) {
    return (
      <main className="admin-shell">
        <section className="admin-hero">
          <p>AdheraOS interno</p>
          <h1>Acesso restrito.</h1>
          <span>Configure ADHERA_ADMIN_TOKEN na Vercel para liberar o painel interno.</span>
        </section>
      </main>
    );
  }

  const leads = await getLeads();

  return (
    <main className="admin-shell">
      <section className="admin-hero">
        <p>AdheraOS interno</p>
        <h1>Demandas, execucao e resultado.</h1>
        <span>{leads.length} leads recentes</span>
      </section>

      <section className="admin-board">
        {leads.length === 0 ? (
          <div className="empty-state">
            <h2>Nenhum lead ainda</h2>
            <p>Quando alguem enviar uma solicitacao pela LP, ela aparece aqui.</p>
          </div>
        ) : (
          leads.map((lead) => (
            <article className="lead-card" key={lead.id}>
              <div>
                <span className="status">{lead.status}</span>
                <h2>{lead.company_name}</h2>
                <p>{lead.project_description}</p>
              </div>
              <dl>
                <div><dt>Contato</dt><dd>{lead.contact_name}</dd></div>
                <div><dt>WhatsApp</dt><dd>{lead.whatsapp}</dd></div>
                <div><dt>E-mail</dt><dd>{lead.email}</dd></div>
                <div><dt>Dor</dt><dd>{lead.pain_point || "Nao informado"}</dd></div>
                <div><dt>Modelo</dt><dd>{lead.engagement_type || "Nao informado"}</dd></div>
              </dl>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
