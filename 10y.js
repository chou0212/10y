/**
 * @fileoverview 10亿次下载自动推送插件
 * @author Butterfly
 * @date 2014-05-16
 */
;
(function(win, $) {

    var API = 'https://mystore.meizu.com/service/app_applicationact/getTotalDownloadCount.jsonp',
        DL_API = 'http://app.meizu.com/service/ms_versionAct/downloadApp2Device.jsonp',
        DEVICE_API = 'http://app.meizu.com/service/ms_versionAct/findOnlineDevices.jsonp',
        FLYME_API = 'http://app.meizu.com/loadCacheDevice',
        MAX_COUNT = 1E9;

    var rFlyme = /(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)/g,
        rDevice = /'\s*(\d{10,})\s*'/g;

    var userInfo = {
        flyme: '',
        device: '',
        appList: [{
            name: '查找手机',
            appid: '1e4a6c3c95e045bc8f78299735fc31ba'
        }],
        cache: {}
    }

    var space = 10000;

    var createNotify = (function() {
        var notifications = win.webkitNotifications;
        notifications.checkPermission() > 0 && notifications.requestPermission();
        return function(img, title, body) {
            return notifications.createNotification(img, title, body);
        }
    })();

    function getCount() {
        return $.ajax({
            url: API,
            dataType: 'jsonp',
            jsonpCallback: 'downloadCountCallback'
        })
    }

    function getAppsName() {
        var names = [];
        userInfo.appList.forEach(function(item, index) {
            names.push(item.name);
        })
        return names.join();
    }

    function notify(msg, t) {
        var newNotify = createNotify('logo.png', '', msg);
        if (t) {
            newNotify.ondisplay = function(event) {
                setTimeout(function() {
                    event.currentTarget.cancel();
                }, t);
            }
        }
        newNotify.onclick = function() {
            win.open('http://app.meizu.com/cats/1/1/0');
        }
        newNotify.show();
    }

    function checkCount(count) {
        return MAX_COUNT - count < 1e8
    }

    function checkLogin(callback) {
        return $.getJSON(DEVICE_API).done(function(res) {
            if (res.reply) {
                userInfo.device = res.reply[0].imei;
                callback && callback();
            } else {
                notify('需要重新登录- -', 10 * 1000);
            }
        }).fail(function() {
            notify('需要重新登录- -', 10 * 1000);
        })
    }

    function initPushApp() {
        var appList = userInfo.appList,
            i = 0;

        for (; i < appList.length; i++) {
            var appid = appList[i].appid,
                appname = appList[i].name;

            $.getJSON(DL_API, {
                p0: appid,
                p1: userInfo.device
            }).done(function(data) {
                if (data.error) {
                    notify(data.message ? data.message : "推送失败，自动重试", 10 * 1000);
                    userInfo.appList.push({
                        name: appname,
                        bappid: appid
                    });
                } else {
                    notify("应用已推送，请查看手机", 10 * 1000);
                    userInfo.cache[appid] = appname;
                }
            }).fail(function() {
                userInfo.appList.push({
                    name: appname,
                    bappid: appid
                });
            });
        }

        //清空队列并追加失败列表
        userInfo.appList.length = 0;
    }

    var timer;
    win.init10y = function(t) {
        timer && clearTimeout(timer);
        timer = setInterval(function() {
            getCount().done(function(res) {
                notify('当前下载数：' + res.reply + '\n点我前往APP下载页', 5000);
                if (res.reply >= MAX_COUNT) {
                    clearTimeout(timer);
                }
                checkLogin(function() {
                    checkCount(res.reply) && userInfo.appList.length && initPushApp();
                })
            })
        }, t)
        checkLogin();
    }

    chrome.extension.onMessage.addListener(function(req, sender, sendRes) {
        if (req.appid) {
            userInfo.appList.push(req);
            notify('APP下载队列:\n' + getAppsName(), 4000)
        }
        req.space && (space = req.space);
        alert('设置的间隔为' + space);
        init10y(space);
    });

})(this, jQuery)