export default function PortalPage() {
  return (
    <main className="admin-shell">
      <section className="admin-hero">
        <p>Portal do cliente</p>
        <h1>Acompanhamento simples do projeto em tempo real.</h1>
        <span>Login e projetos entram na proxima etapa</span>
      </section>

      <section className="portal-grid">
        <article>
          <span>01</span>
          <h2>Projetos ativos</h2>
          <p>O cliente acompanha status, etapas, entregas e proximas acoes.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Novas demandas</h2>
          <p>Um fluxo rapido para enviar novas propostas, arquivos e referencias.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Atualizacoes com IA</h2>
          <p>Resumo claro de progresso, riscos e proximos passos sem complexidade.</p>
        </article>
      </section>
    </main>
  );
}
