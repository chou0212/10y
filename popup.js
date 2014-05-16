(function() {
    var spaceForm = document.getElementById('form_space');
    spaceForm.onsubmit = function(e) {
        var space = e.target['space'].value;
        space < 5000 && (space = 5000);
        sendMsg({space: space});
        e.preventDefault();
    }

    function sendMsg(data) {
        //chrome.tabs.query({}, function(tabArr) {
            //console.log(tabArr[0].id)
            chrome.extension.sendMessage(data, function(res) {
                console.log(res);
            });
        //})
    }

})();
//init10y()