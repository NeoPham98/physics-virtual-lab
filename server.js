/**
 * Physics Virtual Lab — Custom Next.js Server
 * Replaces start_server.py
 *
 * - Starts Next.js dev/prod server on port 8081
 * - Serves static files from physicsNobook/physics-en.nobook.com/
 * - Intercepts all API calls → returns mock JSON (no network calls to nobook.com)
 * - Auto-downloads missing assets from physics-en.nobook.com if not found locally
 * - Opens browser automatically on start
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const PORT = 8081;
const dev = process.env.NODE_ENV !== 'production';
const SERVE_DIR = path.join(__dirname, 'physics-en.nobook.com');
const ORIGIN = 'https://physics-en.nobook.com';
const AUTO_DOWNLOAD = true;

// Prefixes that should be auto-downloaded if not found locally
const PROXY_PREFIXES = ['/assets/', '/physics-libs-chunk/', '/physics-libs/', '/imgs/', '/js/'];
const STATIC_EXTS = ['.js', '.css', '.woff', '.woff2', '.ttf', '.eot',
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
    '.mp3', '.mp4', '.webm', '.json'];

// ─── MIME TYPES ─────────────────────────────────────────────────────────────
const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
};

function getMime(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return MIME[ext] || 'application/octet-stream';
}

// ─── AUTO DOWNLOAD ───────────────────────────────────────────────────────────
function fetchAndCache(urlPath) {
    return new Promise((resolve) => {
        const url = ORIGIN + urlPath;
        const localPath = path.join(SERVE_DIR, urlPath.replace(/\//g, path.sep).replace(/^[/\\]/, ''));
        const client = url.startsWith('https') ? https : http;

        const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, (res) => {
            const chunks = [];
            res.on('data', (c) => chunks.push(c));
            res.on('end', () => {
                const data = Buffer.concat(chunks);
                fs.mkdirSync(path.dirname(localPath), { recursive: true });
                fs.writeFileSync(localPath, data);
                console.log(`[PROXY+CACHE] ${urlPath} (${data.length} bytes)`);
                resolve({ data, contentType: res.headers['content-type'] || 'application/octet-stream' });
            });
        });
        req.on('error', (e) => {
            console.log(`[PROXY FAIL] ${urlPath}: ${e.message}`);
            resolve(null);
        });
        req.on('timeout', () => { req.destroy(); resolve(null); });
    });
}

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const MOCK_USER = {
    code: 200,
    data: {
        userId: 'local_user_001', nickName: 'Local User', avatar: '',
        isLogin: true, vipEndTime: '2099-12-31', isVip: true,
        token: 'mock_token_local', phone: '', email: 'local@example.com',
        subjectId: 1, lang: 'vi',
    },
    msg: 'success',
};

const MOCK_LOGIN_CHECK = {
    code: 200,
    data: {
        isLogin: true, userId: 'local_user_001', nickName: 'Local User',
        avatar: '', token: 'mock_token_local', vipEndTime: '2099-12-31',
        isVip: true, subjectId: 1, lang: 'vi', pid: 'LOCAL_PID',
    },
    msg: 'success',
};

const MOCK_EXPERIMENT = {
    code: 200,
    data: {
        id: 'local_exp_001', name: 'Untitled Experiment', content: '',
        moduleId: 1, createTime: '2026-01-01T00:00:00Z', updateTime: '2026-01-01T00:00:00Z',
    },
    msg: 'success',
};

const MOCK_EMPTY_LIST = { code: 200, data: { list: [], total: 0, page: 1, pageSize: 20 }, msg: 'success' };
const MOCK_SUCCESS = { code: 200, data: {}, msg: 'success' };

function getMockResponse(urlPath) {
    let p = urlPath;
    if (p.startsWith('/api/mock')) p = p.slice('/api/mock'.length);
    const pl = p.toLowerCase();

    if (pl.includes('login/check') || pl.includes('logincheck') ||
        (pl.includes('/passport/') && pl.includes('check')) || pl === '/' || pl === '') {
        return MOCK_LOGIN_CHECK;
    }
    if (pl.includes('/user/info') || pl.includes('/userinfo') || pl.includes('/user/detail')) {
        return MOCK_USER;
    }
    if (pl.includes('/experiment') || pl.includes('/module')) {
        return pl.includes('list') ? MOCK_EMPTY_LIST : MOCK_EXPERIMENT;
    }
    if (['/save', '/update', '/create', '/delete'].some(x => pl.includes(x))) return MOCK_SUCCESS;
    if (['/vip', '/payment', '/rate'].some(x => pl.includes(x))) return MOCK_SUCCESS;
    if (['/activate', '/activation', '/isactive'].some(x => pl.includes(x))) {
        return { code: 200, data: { isActive: true, isVip: true, vipEndTime: '2099-12-31' }, msg: 'success' };
    }
    return MOCK_SUCCESS;
}

// ─── SERVE LOCAL FILE ────────────────────────────────────────────────────────
function serveFile(filePath, res) {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, {
        'Content-Type': getMime(filePath),
        'Content-Length': data.length,
        'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
}

// ─── SEND JSON MOCK ──────────────────────────────────────────────────────────
function sendJson(res, data) {
    const body = Buffer.from(JSON.stringify(data), 'utf-8');
    res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': body.length,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, token',
    });
    res.end(body);
}

// ─── MAIN REQUEST HANDLER ────────────────────────────────────────────────────
async function handlePhysicsRequest(req, res) {
    const parsed = parse(req.url, true);
    const urlPath = parsed.pathname;

    // OPTIONS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, token',
        });
        res.end();
        return;
    }

    // ── /physics/virtuallab → redirect to /console
    if (urlPath === '/physics/virtuallab' || urlPath === '/physics/virtuallab.html' || urlPath === '/physics/virtuallab/') {
        const qs = parsed.search || '';
        res.writeHead(302, { Location: '/console' + qs });
        res.end();
        return;
    }

    // ── /console* → serve virtuallab.html
    if (urlPath === '/console' || urlPath.startsWith('/console/')) {
        const fallback = path.join(SERVE_DIR, 'physics', 'virtuallab.html');
        if (fs.existsSync(fallback)) { serveFile(fallback, res); return; }
    }

    // ── /physics/* → serve virtuallab.html (SPA fallback)
    if (urlPath.startsWith('/physics/') && !path.extname(urlPath)) {
        const fallback = path.join(SERVE_DIR, 'physics', 'virtuallab.html');
        if (fs.existsSync(fallback)) { serveFile(fallback, res); return; }
    }

    // ── Check if file exists locally
    const localPath = path.join(SERVE_DIR, urlPath.replace(/\//g, path.sep).replace(/^[/\\]/, ''));

    if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
        serveFile(localPath, res);
        return;
    }

    // ── Directory with index
    if (fs.existsSync(localPath) && fs.statSync(localPath).isDirectory()) {
        const idx = path.join(localPath, 'new.html');
        if (fs.existsSync(idx)) { serveFile(idx, res); return; }
        const idx2 = path.join(localPath, 'index.html');
        if (fs.existsSync(idx2)) { serveFile(idx2, res); return; }
    }

    // ── Auto-download static assets if missing
    const cleanPath = urlPath.split('?')[0];
    const isStaticExt = STATIC_EXTS.some(e => cleanPath.endsWith(e));
    const isProxyPrefix = PROXY_PREFIXES.some(p => urlPath.startsWith(p));

    if ((isProxyPrefix || isStaticExt) && AUTO_DOWNLOAD) {
        const result = await fetchAndCache(cleanPath);
        if (result) {
            res.writeHead(200, {
                'Content-Type': result.contentType,
                'Content-Length': result.data.length,
                'Access-Control-Allow-Origin': '*',
            });
            res.end(result.data);
            return;
        }
        // Stub for JS/CSS to prevent ChunkLoadError
        if (cleanPath.endsWith('.js')) {
            const stub = Buffer.from('/* chunk not available */');
            res.writeHead(200, { 'Content-Type': 'application/javascript', 'Content-Length': stub.length });
            res.end(stub);
            return;
        }
        if (cleanPath.endsWith('.css')) {
            const stub = Buffer.from('/* css chunk not available */');
            res.writeHead(200, { 'Content-Type': 'text/css', 'Content-Length': stub.length });
            res.end(stub);
            return;
        }
    }

    // ── Everything else → Mock JSON API
    const mock = getMockResponse(urlPath);
    sendJson(res, mock);
}

// ─── START SERVER ─────────────────────────────────────────────────────────────
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer(async (req, res) => {
        const parsed = parse(req.url, true);
        const urlPath = parsed.pathname;

        // Next.js handles its own routes: /_next/*, /api/* (Next.js API routes)
        if (urlPath.startsWith('/_next/') || urlPath.startsWith('/api/')) {
            handle(req, res, parsed);
            return;
        }

        // Physics lab static files + mock — handled by our custom logic
        await handlePhysicsRequest(req, res);

    }).listen(PORT, (err) => {
        if (err) throw err;
        console.log(`\n🚀 Physics Virtual Lab (Next.js) running at http://localhost:${PORT}`);
        console.log(`📂 Serving: ${SERVE_DIR}`);
        console.log(`\n🔗 Open: http://localhost:${PORT}/physics/virtuallab.html`);
        console.log('Press Ctrl+C to stop.\n');

        // Open browser after 1.5s
        setTimeout(() => {
            const url = `http://localhost:${PORT}/physics/new?moduleId=1&ignoreBlock=true`;
            const cmd = process.platform === 'win32' ? `start "" "${url}"` :
                process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
            require('child_process').exec(cmd);
        }, 1500);
    });
});
