// =====================================================
// nb-config.js - PATCHED FOR LOCAL USE
// All API URLs redirected to localhost:8081/api/mock/
// =====================================================
var LOCAL_MOCK = 'http://localhost:8081/api/mock';

// Bỏ ép ngôn ngữ 'vi' vì frontend (umi.js) không có file JS dịch tiếng Việt (gây lỗi chunk loading).
// Ta sẽ dùng lại bản dịch tự động bằng script (MutationObserver) trong virtuallab.html và new.html
window.__nb_language = 'en';
window.nb_language = 'en';
window.__locale = 'en-US';
localStorage.setItem('umi_locale', 'en-US');

window.__nb_domain = {
    userLoginApi: LOCAL_MOCK + '/login/username',
    passportUrl: LOCAL_MOCK,
    nbMainDomain: LOCAL_MOCK,
    pinyinUrl: LOCAL_MOCK,
    apiDomainUrl: LOCAL_MOCK,
    noteachUrl: LOCAL_MOCK,
    model3DDomain: LOCAL_MOCK
};

window.__vip_rate_limit_config = {
    VIP_RATE_LIMIT_URL: LOCAL_MOCK + '/experiment/v1/Play'
};

var insert_config = {
    lan: 'vi',
    lang: 'vi',
    __nb_hide_school: 'true',
    api: {
        host: LOCAL_MOCK,
        webPath: LOCAL_MOCK
    }
};

try {
    Object.keys(insert_config).forEach(function (key) {
        window[key] = insert_config[key];
    });
} catch (err) { }

// --- Embed patch: skip nobook login so the lab renders inside the smart-class iframe -------------
// When embedded (3rd-party iframe), the nobook login flow calls requestStorageAccess which the
// browser denies (partitioned storage), leaving the user/labData props undefined so `createCanvas`
// reads undefined.isLoad and the whole lab crashes (blank). Standalone works because the top-level
// page is granted storage. Hiding the login UI + injecting a fake logged-in user makes the lab skip
// that flow entirely — mirrors the chemistry lab, which embeds successfully.
window.__nb_hideLoginRegister = 'true';
window.__nb_hideNBElement = 'true';
window.__nb_hideUserPopver = 'true';
window.__nb_loginEndTip = '';
window.__nb_vipEndTip = '';
window.__nb_noWebTip = '';

window.__nb_fake_user = {
    userId: 'embed_user_001',
    nickName: 'Nobook User',
    isLogin: true,
    isVip: true,
    token: 'embed_token_2026',
    subjectId: 1,
    lang: 'en'
};

// nobook checks some flags as booleans — normalize 'true'/'false' strings to real booleans.
try {
    Object.keys(window).filter(function (k) { return /^__nb_/.test(k); }).forEach(function (key) {
        if (/^(true|false)$/i.test(window[key])) {
            window[key] = /true/i.test(window[key]);
        }
    });
} catch (err) { }
