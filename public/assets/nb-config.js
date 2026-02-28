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