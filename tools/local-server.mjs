import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, isAbsolute, join, normalize, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const toolsDirectory = dirname(fileURLToPath(import.meta.url));
const siteDirectory = join(toolsDirectory, '..', 'site');
const portArgument = process.argv.indexOf('--port');
const requestedPort = portArgument >= 0 ? Number(process.argv[portArgument + 1]) : 4173;
const port = Number.isInteger(requestedPort) && requestedPort > 0 ? requestedPort : 4173;

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.webp': 'image/webp'
};

function resolveRequestPath(pathname) {
  let decodedPath;

  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  let requestedPath = decodedPath === '/' ? 'index.html' : decodedPath.replace(/^\/+/, '');

  if (!extname(requestedPath)) {
    requestedPath += '.html';
  }

  const absolutePath = normalize(join(siteDirectory, requestedPath));
  const relativePath = relative(siteDirectory, absolutePath);

  if (relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) {
    return null;
  }

  return absolutePath;
}

const server = createServer((request, response) => {
  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? '127.0.0.1'}`);

  if (requestUrl.pathname === '/__adhera_health') {
    response.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Adhera-Local-Server': '1'
    });
    response.end(JSON.stringify({ service: 'adheraos-local', status: 'ok', port }));
    return;
  }

  const filePath = resolveRequestPath(requestUrl.pathname);

  if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store'
    });
    response.end('Página não encontrada.');
    return;
  }

  response.writeHead(200, {
    'Content-Type': contentTypes[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
    'X-Adhera-Local-Server': '1'
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`AdheraOS local disponível em http://127.0.0.1:${port}`);
});

server.on('error', (error) => {
  console.error(`Não foi possível iniciar o servidor local: ${error.message}`);
  process.exitCode = 1;
});
