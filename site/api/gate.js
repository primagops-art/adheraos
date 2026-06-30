// Form handler for the site-wide access gate (see /middleware.js at the
// project root). Receives the POST from the gate page, compares the
// submitted code against the SITE_ACCESS_CODE environment variable (set in
// Vercel -> Project -> Settings -> Environment Variables; never written to
// this file or to the repo), and either sets the session cookie and sends
// the visitor to "/", or sends them back to "/?error=1".

import { GATE_COOKIE_NAME, computeGateToken } from '../lib/gate-auth.js';

export const config = { runtime: 'edge' };

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
