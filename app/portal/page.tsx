import Link from "next/link";
import styles from "./portal.module.css";

type IconName =
  | "home"
  | "folder"
  | "users"
  | "briefcase"
  | "bulb"
  | "bars"
  | "share"
  | "lock"
  | "settings"
  | "grid"
  | "pulse"
  | "code"
  | "graduation"
  | "file"
  | "plus"
  | "upload"
  | "calendar"
  | "bell"
  | "arrow"
  | "send"
  | "external";

const navItems: Array<{ icon: IconName; label: string; active?: boolean }> = [
  { icon: "home", label: "Home", active: true },
  { icon: "folder", label: "Projects" },
  { icon: "users", label: "Workspace" },
  { icon: "briefcase", label: "Vault" },
  { icon: "bulb", label: "Intelligence" },
  { icon: "bars", label: "Analytics" },
  { icon: "share", label: "Integrations" },
  { icon: "lock", label: "Automations" },
  { icon: "settings", label: "Settings" },
];

const intelligenceItems = [
  ["Entenda", "Insights e respostas sobre sua operacao"],
  ["Analise", "Dados, desempenho e resultados"],
  ["Oriente", "Recomendacoes para melhores decisoes"],
];

const steps = [
  { icon: "grid" as IconName, title: "Dashboard", desc: "Automacao Comercial", date: "28/05", time: "14:00", tone: "purple" },
  { icon: "code" as IconName, title: "API", desc: "Automacao Comercial", date: "30/05", time: "09:00", tone: "blue" },
  { icon: "graduation" as IconName, title: "Treinamento IA", desc: "IA para Atendimento", date: "03/06", time: "10:00", tone: "green" },
];

const quickActions = [
  { icon: "plus" as IconName, title: "Nova solicitacao", desc: "Abra uma nova demanda", href: "/solicitar", tone: "purple" },
  { icon: "upload" as IconName, title: "Enviar arquivo", desc: "Envie documentos com seguranca", href: "#vault", tone: "blue" },
  { icon: "calendar" as IconName, title: "Agendar reuniao", desc: "Marque uma conversa com a equipe", href: "#workspace", tone: "green" },
];

function Icon({ name }: { name: IconName }) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
  };

  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      {name === "home" && (
        <>
          <path {...stroke} d="M4 11.5 12 5l8 6.5" />
          <path {...stroke} d="M6.5 10.5V20h11v-9.5" />
          <path {...stroke} d="M10 20v-5h4v5" />
        </>
      )}
      {name === "folder" && <path {...stroke} d="M4 6.5h6l1.7 2H20v9.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />}
      {name === "users" && (
        <>
          <path {...stroke} d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM15 10a2.5 2.5 0 1 0 0-5" />
          <path {...stroke} d="M3.5 20a5.5 5.5 0 0 1 11 0M14.5 14c2.6.2 4.5 2.2 4.8 5" />
        </>
      )}
      {name === "briefcase" && (
        <>
          <rect {...stroke} x="4" y="7" width="16" height="12" rx="2" />
          <path {...stroke} d="M9 7V5h6v2M4 12h16" />
        </>
      )}
      {name === "bulb" && (
        <>
          <path {...stroke} d="M12 3v2M5.6 5.6 7 7M3 12h2M19 12h2M17 7l1.4-1.4" />
          <path {...stroke} d="M9 18h6M10 21h4M8 12a4 4 0 1 1 8 0c0 1.7-1 2.4-1.8 3.4-.4.5-.6 1-.6 1.6h-3.2c0-.6-.2-1.1-.6-1.6C9 14.4 8 13.7 8 12Z" />
        </>
      )}
      {name === "bars" && <path {...stroke} d="M5 20v-7M12 20V5M19 20v-11M4 20h16" />}
      {name === "share" && (
        <>
          <circle {...stroke} cx="6" cy="12" r="2" />
          <circle {...stroke} cx="18" cy="6" r="2" />
          <circle {...stroke} cx="18" cy="18" r="2" />
          <path {...stroke} d="m8 11 8-4M8 13l8 4" />
        </>
      )}
      {name === "lock" && (
        <>
          <rect {...stroke} x="5" y="10" width="14" height="10" rx="2" />
          <path {...stroke} d="M8 10V7a4 4 0 0 1 8 0v3" />
        </>
      )}
      {name === "settings" && (
        <>
          <circle {...stroke} cx="12" cy="12" r="3" />
          <path {...stroke} d="M19.4 15a8 8 0 0 0 .1-2l2-1-2-3.4-2.2.8a7.4 7.4 0 0 0-1.7-1L15.2 6h-4l-.4 2.4c-.6.3-1.2.6-1.7 1L6.9 8.6 5 12l2 1a8 8 0 0 0 .1 2L5.2 16l2 3.4 2.1-.8c.5.4 1.1.7 1.7 1l.4 2.4h4l.4-2.4c.6-.3 1.2-.6 1.7-1l2.1.8 2-3.4Z" />
        </>
      )}
      {name === "grid" && (
        <>
          <rect {...stroke} x="5" y="5" width="5" height="5" rx="1" />
          <rect {...stroke} x="14" y="5" width="5" height="5" rx="1" />
          <rect {...stroke} x="5" y="14" width="5" height="5" rx="1" />
          <rect {...stroke} x="14" y="14" width="5" height="5" rx="1" />
        </>
      )}
      {name === "pulse" && <path {...stroke} d="M3 12h4l2-6 4 12 2-6h6" />}
      {name === "code" && <path {...stroke} d="m8 9-4 3 4 3M16 9l4 3-4 3M13 5l-2 14" />}
      {name === "graduation" && (
        <>
          <path {...stroke} d="m3 9 9-5 9 5-9 5-9-5Z" />
          <path {...stroke} d="M7 12v4c3 2 7 2 10 0v-4" />
        </>
      )}
      {name === "file" && (
        <>
          <path {...stroke} d="M6 3h8l4 4v14H6Z" />
          <path {...stroke} d="M14 3v5h4M9 13h6M9 17h5" />
        </>
      )}
      {name === "plus" && <path {...stroke} d="M12 5v14M5 12h14" />}
      {name === "upload" && <path {...stroke} d="M12 16V5M8 9l4-4 4 4M5 18v2h14v-2" />}
      {name === "calendar" && (
        <>
          <rect {...stroke} x="4" y="5" width="16" height="15" rx="2" />
          <path {...stroke} d="M8 3v4M16 3v4M4 10h16" />
        </>
      )}
      {name === "bell" && <path {...stroke} d="M18 9a6 6 0 0 0-12 0c0 7-2 7-2 7h16s-2 0-2-7M10 20h4" />}
      {name === "arrow" && <path {...stroke} d="M5 12h14M13 6l6 6-6 6" />}
      {name === "send" && <path {...stroke} d="m4 12 16-8-6 16-3-7Z" />}
      {name === "external" && <path {...stroke} d="M14 4h6v6M20 4 10 14M18 13v6H5V6h6" />}
    </svg>
  );
}

function AdheraLogo({ compact = false }: { compact?: boolean }) {
  return (
    <img
      className={compact ? styles.logoCompact : styles.logo}
      src="/portal/adhera-logo.png"
      alt="Adhera"
    />
  );
}

export default function PortalPage() {
  return (
    <main className={styles.portal}>
      <div className={styles.backdrop} />

      <aside className={styles.sidebar} aria-label="Navegacao do portal">
        <AdheraLogo compact />
        <div className={styles.navLine} />
        <nav className={styles.navList}>
          {navItems.map((item) => (
            <a
              className={`${styles.navItem} ${item.active ? styles.navActive : ""}`}
              href={`#${item.label.toLowerCase()}`}
              key={item.label}
              aria-label={item.label}
            >
              <Icon name={item.icon} />
            </a>
          ))}
        </nav>
        <div className={styles.sidebarAvatar}>
          KA
          <span />
        </div>
      </aside>

      <section className={styles.topbar} aria-label="Barra superior">
        <div className={styles.greeting}>
          <div className={styles.avatar}>KA<span /></div>
          <strong>Bom dia, Kaua</strong>
        </div>
        <label className={styles.search}>
          <AdheraLogo compact />
          <span>Como posso ajudar sua operacao?</span>
        </label>
        <div className={styles.datePill}>
          <Icon name="calendar" />
          <span>22 de Maio, 2025</span>
        </div>
        <button className={styles.notification} type="button" aria-label="Notificacoes">
          <Icon name="bell" />
          <span>7</span>
        </button>
      </section>

      <section className={styles.dashboard} aria-label="Home do cliente AdheraOS">
        <article className={`${styles.card} ${styles.intelligence}`} id="intelligence">
          <header className={styles.cardHeader}>
            <div>
              <h1>Adhera Intelligence</h1>
              <p>Nucleo operacional inteligente</p>
            </div>
            <span className={styles.badge}>Beta</span>
          </header>
          <div className={styles.intelligenceBody}>
            <div className={styles.logoTile}>
              <AdheraLogo />
            </div>
            <div className={styles.insightList}>
              {intelligenceItems.map(([title, desc]) => (
                <div className={styles.insightItem} key={title}>
                  <span><Icon name={title === "Analise" ? "pulse" : "bulb"} /></span>
                  <div>
                    <strong>{title}</strong>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form className={styles.askBar} action="/solicitar">
            <span>Pergunte sobre projetos, contratos, automacoes ou resultados</span>
            <button type="submit" aria-label="Enviar pergunta">
              <Icon name="send" />
            </button>
          </form>
        </article>

        <article className={`${styles.card} ${styles.project}`} id="projects">
          <header className={styles.cardHeader}>
            <h2>Projeto em Foco</h2>
            <Icon name="external" />
          </header>
          <div className={styles.projectTitle}>
            <span><Icon name="pulse" /></span>
            <div>
              <h3>Automacao Comercial</h3>
              <small>Em execucao</small>
            </div>
          </div>
          <strong className={styles.progressNumber}>75%</strong>
          <p className={styles.projectDesc}>CRM + WhatsApp + IA</p>
          <div className={styles.progressTrack}><span /></div>
          <footer className={styles.projectFooter}>
            <div>
              <span>Entrega prevista</span>
              <strong>28/06/2025</strong>
            </div>
            <div>
              <span>Responsavel</span>
              <div className={styles.avatarStack}>
                <b>JM</b><b>AL</b><b>RS</b><b>+2</b>
              </div>
            </div>
          </footer>
        </article>

        <article className={`${styles.card} ${styles.steps}`} id="home">
          <header className={styles.cardHeader}>
            <h2>Proximos Passos</h2>
            <a href="#projects">Ver todos &rarr;</a>
          </header>
          <div className={styles.timeline}>
            {steps.map((step) => (
              <div className={styles.timelineItem} key={step.title}>
                <span className={`${styles.stepIcon} ${styles[step.tone]}`}>
                  <Icon name={step.icon} />
                </span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.desc}</p>
                </div>
                <time>{step.date}<br />{step.time}</time>
              </div>
            ))}
          </div>
        </article>

        <article className={`${styles.card} ${styles.impact}`} id="analytics">
          <header className={styles.cardHeader}>
            <h2>Impacto Gerado</h2>
            <Icon name="external" />
          </header>
          <div className={styles.metricGrid}>
            <div className={styles.metric}>
              <span>R$ 87.430</span>
              <p>economizados</p>
              <small>+ 28% vs mes passado</small>
            </div>
            <div className={styles.metric}>
              <span>148h</span>
              <p>poupadas</p>
              <small>+ 18% vs mes passado</small>
            </div>
          </div>
          <div className={styles.chartLine} />
        </article>

        <article className={`${styles.card} ${styles.workspace}`} id="workspace">
          <header className={styles.cardHeader}>
            <h2>Workspace</h2>
            <Icon name="users" />
          </header>
          <div className={styles.workspaceMetrics}>
            <div><Icon name="briefcase" /><strong>3</strong><span>solicitacoes em aberto</span></div>
            <div><Icon name="pulse" /><strong>1</strong><span>aprovacao pendente</span></div>
          </div>
          <a className={styles.cardLink} href="#workspace">Ver todas as solicitacoes <Icon name="arrow" /></a>
        </article>

        <article className={`${styles.card} ${styles.vault}`} id="vault">
          <header className={styles.cardHeader}>
            <h2>Vault</h2>
            <Icon name="lock" />
          </header>
          <div className={styles.documentList}>
            <a href="#vault">
              <Icon name="file" />
              <span><strong>Contrato</strong><small>Aguardando assinatura - Acme Corp.</small></span>
              <Icon name="arrow" />
            </a>
            <a href="#vault">
              <Icon name="file" />
              <span><strong>Proposta</strong><small>Enviada - Revo Operacoes</small></span>
              <Icon name="arrow" />
            </a>
          </div>
          <a className={styles.cardLink} href="#vault">Acessar todos os documentos <Icon name="arrow" /></a>
        </article>

        <article className={`${styles.card} ${styles.actions}`} id="actions">
          <header className={styles.cardHeader}>
            <h2>Acoes Rapidas</h2>
          </header>
          <div className={styles.actionList}>
            {quickActions.map((action) => (
              <Link className={styles.actionButton} href={action.href} key={action.title}>
                <span className={`${styles.actionIcon} ${styles[action.tone]}`}>
                  <Icon name={action.icon} />
                </span>
                <span>
                  <strong>{action.title}</strong>
                  <small>{action.desc}</small>
                </span>
                <Icon name="arrow" />
              </Link>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
