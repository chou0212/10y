(function() {
    var $appList = $('#h_software').children('li');
    $appList.each(function(i, item) {
        var $this = $(this),
        	appid = $('.appCLKCls', $this).attr('id'),
        	name = $('.title', $this).attr('title');
        $this.append('<input type="checkbox" data-appid="' + appid + '" data-name="' + name + '"/>');
    });

    $('#h_software').on('change', function(e) {
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


})();