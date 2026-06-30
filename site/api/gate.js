// Form handler for the site-wide access gate (see /middleware.js at the
// project root). Receives the POST from the gate page, compares the
// submitted code against the SITE_ACCESS_CODE environment variable (set in
// Vercel -> Project -> Settings -> Environment Variables; never written to
// this file or to the repo), and either sets the session cookie and sends
// the visitor to "/", or sends them back to "/?error=1".
//
// Note: the gate token logic below is duplicated in middleware.js on
// purpose. Vercel's zero-config Edge Functions (no framework/build step on
// this static site) can't resolve a shared local import across two
// separate Edge Functions, so each function carries its own copy instead
// of importing a shared ./lib file.

export const config = { runtime: 'edge' };

const GATE_COOKIE_NAME = 'adhera_gate';
const TOKEN_PAYLOAD = 'adheraos-site-gate-v1';

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function computeGateToken(secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(TOKEN_PAYLOAD),
  );
  return toHex(signature);
}

// How long the visitor stays in once they enter the correct code.
// Keep this between 7 and 30 days per the agreed spec.
const COOKIE_MAX_AGE_DAYS = 30;

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const origin = new URL(request.url).origin;
  let submittedCode = '';

  try {
    const form = await request.formData();
    submittedCode = String(form.get('code') || '');
  } catch {
    submittedCode = '';
  }

  const accessCode = process.env.SITE_ACCESS_CODE || '';
  const isCorrect = accessCode.length > 0 && submittedCode === accessCode;

  if (!isCorrect) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: `${origin}/?error=1`,
        'cache-control': 'no-store',
      },
    });
  }

  const token = await computeGateToken(accessCode);
  const cookie = [
    `${GATE_COOKIE_NAME}=${token}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    `Max-Age=${COOKIE_MAX_AGE_DAYS * 24 * 60 * 60}`,
  ].join('; ');

  return new Response(null, {
    status: 303,
    headers: {
      Location: `${origin}/`,
      'Set-Cookie': cookie,
      'cache-control': 'no-store',
    },
  });
}
