import { NextRequest, NextResponse } from 'next/server';

// Same mock data and routing logic as start_server.py / server.js
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
        moduleId: 1,
    },
    msg: 'success',
};

const MOCK_EMPTY_LIST = { code: 200, data: { list: [], total: 0, page: 1, pageSize: 20 }, msg: 'success' };
const MOCK_SUCCESS = { code: 200, data: {}, msg: 'success' };

function getMockResponse(urlPath: string) {
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

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, token',
};

export async function GET(req: NextRequest, { params }: { params: { mock: string[] } }) {
    const urlPath = '/api/mock/' + (params.mock || []).join('/');
    const data = getMockResponse(urlPath);
    return NextResponse.json(data, { headers: corsHeaders });
}

export async function POST(req: NextRequest, { params }: { params: { mock: string[] } }) {
    const urlPath = '/api/mock/' + (params.mock || []).join('/');
    const data = getMockResponse(urlPath);
    return NextResponse.json(data, { headers: corsHeaders });
}

export async function OPTIONS() {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
}
