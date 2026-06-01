export default function PortalPage() {
  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        overflow: "hidden",
        background: "#050507",
        position: "fixed",
        inset: 0,
      }}
    >
      <iframe
        src="/portal/adheraos-client.html"
        title="AdheraOS Client Portal"
        scrolling="no"
        style={{
          width: "100%",
          height: "100%",
          border: 0,
          display: "block",
          overflow: "hidden",
        }}
      />
    </main>
  );
}
