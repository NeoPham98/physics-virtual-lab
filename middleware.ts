import { NextRequest, NextResponse } from 'next/server';

// Paths that should pass through to Next.js / static files
const PASSTHROUGH_PREFIXES = [
    '/_next/',
    '/physics/',
    '/assets/',
    '/imgs/',
    '/js/',
    '/static/',
    '/physics-libs',
    '/api/',
];

// Static file extensions — let Next.js serve these from public/
const STATIC_EXTS = [
    '.js', '.css', '.html', '.json', '.png', '.jpg', '.jpeg',
    '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.mp3',
    '.mp4', '.webm', '.eot',
];

const MOCK_SUCCESS = { code: 200, data: {}, msg: 'success' };
const MOCK_LOGIN = {
    code: 200,
    data: {
        isLogin: true, userId: 'local_user_001', nickName: 'Local User',
        avatar: '', token: 'mock_token_local', vipEndTime: '2099-12-31',
        isVip: true, subjectId: 1, lang: 'vi', pid: 'LOCAL_PID',
    },
    msg: 'success',
};
const MOCK_USER = {
    code: 200,
    data: {
        userId: 'local_user_001', nickName: 'Local User', avatar: '',
        isLogin: true, vipEndTime: '2099-12-31', isVip: true,
        token: 'mock_token_local', subjectId: 1, lang: 'vi',
    },
    msg: 'success',
};
const MOCK_EXPERIMENT = {
    code: 200,
    data: { id: 'local_exp_001', name: 'Untitled', content: '', moduleId: 1 },
    msg: 'success',
};
const MOCK_LIST = { code: 200, data: { list: [], total: 0, page: 1, pageSize: 20 }, msg: 'success' };

function getMock(pathname: string) {
    const p = pathname.toLowerCase();
    if (p.includes('login') || p.includes('check') || p.includes('passport')) return MOCK_LOGIN;
    if (p.includes('user/info') || p.includes('userinfo')) return MOCK_USER;
    if (p.includes('experiment') || p.includes('module')) {
        return p.includes('list') ? MOCK_LIST : MOCK_EXPERIMENT;
    }
    if (p.includes('activate') || p.includes('isactive') || p.includes('vip')) {
        return { code: 200, data: { isActive: true, isVip: true, vipEndTime: '2099-12-31' }, msg: 'success' };
    }
    return MOCK_SUCCESS;
}

const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, token',
};

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // CORS preflight
    if (req.method === 'OPTIONS') {
        return new NextResponse(null, { status: 200, headers: CORS });
    }

    // Let static files and known routes pass through
    if (PASSTHROUGH_PREFIXES.some(p => pathname.startsWith(p))) return NextResponse.next();
    if (STATIC_EXTS.some(e => pathname.endsWith(e))) return NextResponse.next();

    // Root and console routes → let Next.js handle via rewrites
    if (pathname === '/' || pathname === '/console' || pathname.startsWith('/console/')) {
        return NextResponse.next();
    }

    // Everything else → return mock JSON (catches /passport/*, /v5/*, etc.)
    const mock = getMock(pathname);
    return NextResponse.json(mock, { headers: CORS });
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
