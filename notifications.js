"use strict";
! function () {
    var a;
    a = "Notification" in window && "permission" in Notification ? {
        isSupport: !0,
        permission: Notification.permission,
        requestPermission: function (a) {
            "default" === this.permission ? Notification.requestPermission(function (b) {
                this.permission = b, a && a(b)
            }.bind(this)) : a && a(this.permission)
        },
        create: function (a, b, c, d, e) {
            function f(a, b, c, d, e) {
                var h, f = new Notification(a, b),
                    g = null;
                if (c)
                    for (h in c) f.addEventListener(h, c[h], !1);
                d && (g = setTimeout(function () {
                    f.close()
                }, d)), e && e(f, g)
            }
            if ("granted" === this.permission) f(a, b, c, d, e);
            else {
                if ("denied" === this.permission) return e && e("denied"), void 0;
                this.requestPermission(function (g) {
                    "granted" === g ? f(a, b, c, d, e) : e && e(g)
                })
            }
        }
    } : "webkitNotifications" in window ? {
        isSupport: !0,
        permission: function () {
            var a = window.webkitNotifications,
                b = a.checkPermission();
            return 0 === b ? "granted" : 2 === b ? "deined" : "default"
        }(),
        requestPermission: function (a) {
            if ("default" === this.permission) {
                var b = window.webkitNotifications;
                b.requestPermission(function () {
                    var c = b.checkPermission();
                    0 === c ? (this.permission = "granted", a && a("granted")) : 2 === c ? (this.permission = "deined", a && a("denied")) : (this.permission = "default", a && a("default"))
                }.bind(this))
            } else a && a(this.permission)
        },
        create: function (a, b, c, d, e) {
            function g(a, b, c, d, e) {
                var g, h, i;
                if (b || (b = {}), g = f.createNotification(b.icon || "", a, b.body || a), h = null, "tag" in b && (g.replaceId = b.tag), "dir" in b && (g.dir = b.dir), "lang" in b && (g.lang = b.lang), g.show(), c)
                    for (i in c) g.addEventListener(i, c[i], !1);
                d && (h = setTimeout(function () {
                    g.cancel()
                }, d)), e && e(g, h)
            }
            var f = window.webkitNotifications;
            if ("granted" === this.permission) g(a, b, c, d, e);
            else {
                if ("denied" === this.permission) return e && e("denied"), void 0;
                this.requestPermission(function (f) {
                    "granted" === f && g(a, b, c, d, e)
                })
            }
        }
    } : {
        isSupport: !1,
        permission: "denied",
        requestPermission: function (a) {
            a && a("unsupported")
        },
        create: function (a, b, c, d, e) {
            e && e("unsupported")
        }
    }, window.Notify = a
}();