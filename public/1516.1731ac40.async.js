(self.webpackChunkvirtuallab = self.webpackChunkvirtuallab || []).push([
    [1516], {
        31523: function(v) {
            v.exports = {
                schem_con: "schem_con___3hLs5",
                schem_box: "schem_box___1vWjb"
            }
        },
        81516: function(v, s, o) {
            "use strict";
            o.r(s);
            var i = o(30929),
                _ = o(98765),
                E = o(67294),
                u = o(80125),
                h = o(31523),
                r = o.n(h),
                M = o(85893),
                C = n => {
                    var t = n.canConvert,
                        a = n.schemModel,
                        D = n.onSchemMin,
                        O = n.isPlayer,
                        l = n.dispatch,
                        y = n.sdkModel,
                        m = a.active,
                        c = (0, E.useRef)(),
                        f = () => {
                            m && a.initCompleteCb && c.current && a.initCompleteCb(c.current)
                        },
                        p = e => {
                            l({
                                type: "schemModel/toElec",
                                payload: e.detail
                            })
                        },
                        S = e => {
                            var d = e.detail;
                            l({
                                type: "equPopMenuModel/popMenu",
                                payload: d
                            })
                        },
                        T = e => {
                            D(e.detail)
                        },
                        L = () => {
                            l({
                                type: "equPopMenuModel/popMenu",
                                payload: null
                            })
                        },
                        A = e => {
                            var d = O ? "DemoAreaCircuitryPageClick" : "EditAreaCircuitryPageClick";
                            l({
                                type: "nbLogModel/track",
                                payload: {
                                    func: "commonEvent",
                                    data: {
                                        [d]: e.detail
                                    }
                                }
                            })
                        };
                    return (0, M.jsx)("div", {
                        onPointerDown: L,
                        className: r().schem_con,
                        children: m ? (0, M.jsx)(_.eS, {
                            ref: c,
                            className: i.Z.isSDK && y.preventDownload ? r().schem_box : null,
                            canConvert: t,
                            lan: i.Z.compLan,
                            onSchemInited: () => f(),
                            onToElecsEvent: e => p(e),
                            onGlobalMenuPopEvent: e => S(e),
                            onToMinEvent: e => T(e),
                            onBtnEvent: e => A(e)
                        }) : null
                    })
                },
                P = n => {
                    var t = n.schemModel,
                        a = n.sdkModel;
                    return {
                        schemModel: t,
                        sdkModel: a
                    }
                };
            s.default = (0, u.$j)(P)(C)
        }
    }
]);