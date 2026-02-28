(self.webpackChunkvirtuallab = self.webpackChunkvirtuallab || []).push([
    [367], {
        367: function(h, t, d) {
            "use strict";
            d.r(t);
            var l = d(30929),
                M = d(33666),
                f = d(67294),
                m = d(80125),
                r = d(85893),
                v = o => {
                    var a = o.formModel,
                        e = o.sdkModel,
                        E = o.onFormMin,
                        u = o.moduleId,
                        D = o.onShowChart,
                        i = a.active,
                        s = n => {
                            i && a.initCompleteCb && a.initCompleteCb(n.formBox)
                        },
                        _ = n => {
                            E(n)
                        };
                    return (0, r.jsx)("div", {
                        children: i ? (0, r.jsx)(M.J, {
                            lan: l.Z.compLan,
                            hideAutoRecordMenu: l.Z.isSDK,
                            hideDownload: l.Z.isSDK ? e.preventDownload : !1,
                            onFormBoxInited: s,
                            onToMinEvent: n => _(n),
                            onShowChart: n => D(n),
                            moduleId: u
                        }) : null
                    })
                },
                C = o => {
                    var a = o.formModel,
                        e = o.sdkModel;
                    return {
                        formModel: a,
                        sdkModel: e
                    }
                };
            t.default = (0, m.$j)(C)(v)
        }
    }
]);