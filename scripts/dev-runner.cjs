const http = require('node:http');
const net = require('node:net');
const { spawn } = require('node:child_process');

const HOST = '127.0.0.1';
const START_PORT = 5173;
const MAX_PORT_TRIES = 30;
const WAIT_TIMEOUT_MS = 30000;

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });

    server.listen(port, HOST);
  });
}

async function findAvailablePort() {
  for (let port = START_PORT; port < START_PORT + MAX_PORT_TRIES; port += 1) {
    // eslint-disable-next-line no-await-in-loop
    const free = await isPortFree(port);
    if (free) return port;
  }

  throw new Error('No se encontró un puerto disponible para Vite.');
}

function waitForServer(url) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const check = () => {
      const req = http.get(url, (res) => {
        res.resume();
        if (res.statusCode && res.statusCode < 500) {
          resolve();
          return;
        }
        retry();
      });

      req.on('error', retry);
      req.setTimeout(1500, () => {
        req.destroy();
        retry();
      });
    };

    const retry = () => {
      if (Date.now() - startedAt > WAIT_TIMEOUT_MS) {
        reject(new Error(`Timeout esperando a Vite en ${url}`));
        return;
      }
      setTimeout(check, 400);
    };

    check();
  });
}

function pipeWithPrefix(stream, prefix) {
  stream.on('data', (chunk) => {
    const text = chunk.toString();
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (!line) continue;
      process.stdout.write(`[${prefix}] ${line}\n`);
    }
  });
}

function terminateChild(child, signal = 'SIGTERM') {
  if (child && !child.killed) {
    child.kill(signal);
  }
}

(async () => {
  let viteProcess;
  let electronProcess;

  try {
    const port = await findAvailablePort();
    const devServerUrl = `http://${HOST}:${port}`;

    console.log(`[DEV] Usando ${devServerUrl}`);

    viteProcess = spawn('vite', ['--host', HOST, '--port', String(port)], {
      env: process.env,
      stdio: ['inherit', 'pipe', 'pipe']
    });

    pipeWithPrefix(viteProcess.stdout, 'VITE');
    pipeWithPrefix(viteProcess.stderr, 'VITE');

    viteProcess.on('exit', (code, signal) => {
      console.log(`[VITE] exited code=${code ?? 'null'} signal=${signal ?? 'null'}`);
      terminateChild(electronProcess);
      if (!electronProcess) {
        process.exit(code ?? 1);
      }
    });

    await waitForServer(devServerUrl);

    electronProcess = spawn('electron', ['.'], {
      env: {
        ...process.env,
        VITE_DEV_SERVER_URL: devServerUrl
      },
      stdio: ['inherit', 'pipe', 'pipe']
    });

    pipeWithPrefix(electronProcess.stdout, 'ELECTRON');
    pipeWithPrefix(electronProcess.stderr, 'ELECTRON');

    electronProcess.on('exit', (code, signal) => {
      console.log(`[ELECTRON] exited code=${code ?? 'null'} signal=${signal ?? 'null'}`);
      terminateChild(viteProcess);
      process.exit(code ?? 0);
    });

    process.on('SIGINT', () => {
      terminateChild(electronProcess, 'SIGINT');
      terminateChild(viteProcess, 'SIGINT');
      process.exit(130);
    });

    process.on('SIGTERM', () => {
      terminateChild(electronProcess, 'SIGTERM');
      terminateChild(viteProcess, 'SIGTERM');
      process.exit(143);
    });
  } catch (error) {
    console.error(`[DEV] ${error.message}`);
    terminateChild(electronProcess);
    terminateChild(viteProcess);
    process.exit(1);
  }
})();
