(function() {
    var $appList = $('#h_software');
    var $items = $appList.children('li');
    $items.each(function(i, item) {
        var $this = $(this),
        	appid = $('.appCLKCls', $this).attr('id'),
        	name = $('.title', $this).attr('title');
        $this.append('<input type="checkbox" data-appid="' + appid + '" data-name="' + name + '"/>');
    });

    $appList.on('change', function(e) {
        var target = e.target,
            appid = $(target).attr('data-appid'),
            name = $(target).attr('data-name');
        if (target.checked) {
            chrome.extension.sendMessage({
                appid: appid,
                name: name
            }, function(res) {
                console.log(res);
            });
        }
    })

    $('<button>立即推送</button>').css({
        'position': 'fixed',
        'top': '40%',
        'right': '10px'
    }).appendTo('body').click(function(e) {
        chrome.extension.sendMessage({pushTest: true});
    });

})();