(self.webpackChunkvirtuallab = self.webpackChunkvirtuallab || []).push([
    [6458], {
        31469: function(c) {
            c.exports = {
                mechDiyTool: "mechDiyTool___2sRaV",
                mechDiyTool_mobile: "mechDiyTool_mobile___lIzVG"
            }
        },
        66458: function(c, h, e) {
            "use strict";
            e.r(h);
            var B = e(11849),
                I = e(2824),
                K = e(30929),
                A = e(98765),
                D = e(15936),
                r = e(67294),
                M = e(80125),
                R = e(31469),
                T = e.n(R),
                E = e(85893),
                U = o => {
                    var _, i = o,
                        P = i.dispatch,
                        C = i.mechDiyToolModel,
                        g = i.inPlayer,
                        O = g === void 0 ? !1 : g,
                        t = i.canvasMain,
                        S = (0, M.YB)(),
                        W = (0, r.useState)(!0),
                        f = (0, I.Z)(W, 2),
                        x = f[0],
                        V = f[1];
                    (0, r.useEffect)(() => {
                        var l, a = (l = t.activeModule) === null || l === void 0 ? void 0 : l.napeEngine;
                        V(a.play)
                    }, [t == null || (_ = t.activeModule) === null || _ === void 0 ? void 0 : _.napeEngine]);
                    var Z = l => {
                            var a;
                            P({
                                type: "mechDiyToolModel/mechToolChange",
                                payload: {
                                    type: (a = l.detail) === null || a === void 0 ? void 0 : a.type,
                                    inPlayer: O
                                }
                            })
                        },
                        p = l => {
                            P({
                                type: "mechDiyToolModel/playStateChange",
                                payload: {
                                    value: l.detail,
                                    inPlayer: O
                                }
                            })
                        },
                        v = {},
                        b = {},
                        n = !0;
                    if (K.Z.isSDK) {
                        var d, m, s, y, u, N = (d = o.sdkModel) === null || d === void 0 ? void 0 : d.rightToolbarVisible,
                            j = (m = o.sdkModel) === null || m === void 0 || (s = m.css) === null || s === void 0 || (y = s.leftToolbar) === null || y === void 0 ? void 0 : y.mechDiyTool;
                        n = (u = o.sdkModel) === null || u === void 0 ? void 0 : u.mechDiyCommonToolVisible, !N && !j && D.Z.isMobile() ? (v = {
                            left: "26px",
                            top: "10px"
                        }, n = !1, b = {
                            paddingBottom: "9px"
                        }, x && (v = {
                            display: "none"
                        })) : (v = j || {}, n = n || !0)
                    }
                    return (0, E.jsx)("div", {
                        className: "".concat(T().mechDiyTool, " ").concat(D.Z.isMobile() ? T().mechDiyTool_mobile : ""),
                        style: (0, B.Z)({}, v),
                        id: "mechDiyTool",
                        children: (0, E.jsx)(A._q, {
                            keycode: C.toolType,
                            isPlay: C.isPlay,
                            commonToolVisible: n,
                            onMechToolChange: Z,
                            groupDiv2Style: b,
                            trans: {
                                getStrFromKey(l, a) {
                                    return S.formatMessage({
                                        id: l,
                                        defaultMessage: a
                                    })
                                }
                            },
                            onPlayChange: p
                        })
                    })
                },
                L = o => {
                    var _ = o.mechDiyToolModel,
                        i = o.sdkModel;
                    return {
                        mechDiyToolModel: _,
                        sdkModel: i
                    }
                };
            h.default = (0, M.$j)(L)(U)
        }
    }
]);