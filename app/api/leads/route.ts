import { NextResponse } from "next/server";

type LeadPayload = {
  company_name?: string;
  industry?: string;
  team_size?: string;
  revenue_range?: string;
  pain_point?: string;
  engagement_type?: string;
  project_description?: string;
  contact_name?: string;
  whatsapp?: string;
  email?: string;
  source?: string;
  source_path?: string;
};

const required = ["company_name", "contact_name", "whatsapp", "email", "project_description"] as const;

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export async function POST(request: Request) {
  let payload: LeadPayload;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else {
      const formData = await request.formData();
      payload = Object.fromEntries(formData.entries()) as LeadPayload;
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const missing = required.filter((key) => !payload[key]?.trim());
  if (missing.length > 0) {
    return NextResponse.json({ error: "Missing required fields", fields: missing }, { status: 400 });
  }

  try {
    const supabaseUrl = env("SUPABASE_URL");
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
    if (!serviceKey) throw new Error("Missing Supabase service key");

    const response = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        ...payload,
        status: "novo",
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      return NextResponse.json({ error: "Supabase insert failed", details }, { status: 502 });
    }

    const [lead] = await response.json();
    if (!(request.headers.get("content-type") || "").includes("application/json")) {
      return NextResponse.redirect(new URL("/solicitar?enviado=1", request.url), { status: 303 });
    }
    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
