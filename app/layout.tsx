import type { Metadata } from "next";
import "./global-pages.css";

export const metadata: Metadata = {
  title: "AdheraOS - Interconnected Solutions",
  description: "Solicite projetos de automacao, IA e integracao com acompanhamento simples do inicio ao resultado.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
