// Server-side access gate for the entire adheraos.com site during private
// testing. Runs on every request (Vercel Routing Middleware, Edge runtime)
// before any HTML - including the landing page - is served. With no valid
// session cookie, the visitor only ever sees the gate page below, no matter
// which URL they hit (/, /portal, /diagnostico, /acesso, etc). The real
// HTML is never returned to a request that hasn't passed the check.
//
// The password itself lives only in the SITE_ACCESS_CODE environment
// variable (Vercel -> Project -> Settings -> Environment Variables). It is
// never written to this file or committed to the repo.
//
// Note: the gate token logic below is duplicated in api/gate.js on purpose.
// Vercel's zero-config Edge Functions (no framework/build step on this
// static site) can't resolve a shared local import across two separate
// Edge Functions, so each function carries its own copy instead of
// importing a shared ./lib file.

import { next } from '@vercel/functions';

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

export const config = {
  runtime: 'edge',
  // Everything goes through the gate except /api/* (that's the form
  // handler that checks the password - it can't be gated by the same
  // check it performs, or no one could ever submit the form).
  matcher: '/((?!api/).*)',
};

// --- Token bypass for the real client flow (DISABLED during testing) ---
// Today's client flow is: email -> /acesso?token=... -> /portal?token=...
// The token in that link is already a private, unguessable credential, so
// once there are real clients you may want them to land on /acesso or
// /portal straight from the email link without also entering the site
// password. To turn that on later, flip this single flag to true. Nothing
// else needs to change.
const ALLOW_TOKEN_BYPASS_FOR_CLIENT_LINKS = false;

function isTokenBypassEligible(url) {
  if (!ALLOW_TOKEN_BYPASS_FOR_CLIENT_LINKS) return false;
  const path = url.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  const isClientRoute = path === '/acesso' || path === '/portal';
  const token = url.searchParams.get('token');
  return isClientRoute && !!token;
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i === -1) continue;
    out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  return out;
}

function gatePage(showError) {
  const errorText = showError ? 'Wrong code. Try again.' : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Restricted</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#000;color:#fff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
  .box{width:100%;max-width:380px}
  .lab{font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#fff}
  h1{font-size:34px;line-height:1.05;letter-spacing:-.03em;font-weight:800;margin:18px 0 0}
  p{font-size:13px;line-height:1.6;color:rgba(255,255,255,.55);margin:14px 0 28px}
  input{width:100%;background:transparent;border:1px solid #2a2a2a;color:#fff;font-size:15px;padding:15px 16px;outline:none}
  input:focus{border-color:#fff}
  button{width:100%;margin-top:12px;background:#fff;color:#000;border:0;font-size:14px;font-weight:700;letter-spacing:.04em;padding:16px;cursor:pointer}
  .err{color:#FF2D55;font-size:12px;margin-top:12px;min-height:16px}
  .ft{margin-top:34px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#555}
</style>
</head>
<body>
  <div class="box">
    <div class="lab">[ Restricted ]</div>
    <h1>Access code required.</h1>
    <p>This area is in private testing. Enter your access code to continue.</p>
    <form method="POST" action="/api/gate">
      <input type="password" name="code" placeholder="Access code" autofocus autocomplete="off">
      <button type="submit">Enter &gt;&gt;&gt;</button>
      <div class="err">${errorText}</div>
    </form>
    <div class="ft">AdheraOS · Brazil</div>
  </div>
</body>
</html>`;
}

export default async function middleware(request) {
  const url = new URL(request.url);

  if (isTokenBypassEligible(url)) {
    return next();
  }

  const accessCode = process.env.SITE_ACCESS_CODE || '';
  const cookies = parseCookies(request.headers.get('cookie'));
  const presented = cookies[GATE_COOKIE_NAME];

  if (accessCode && presented) {
    const expected = await computeGateToken(accessCode);
    if (presented === expected) {
      return next();
    }
  }

  const showError = url.searchParams.get('error') === '1';
  return new Response(gatePage(showError), {
    status: 401,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
