
(function () {

    function onClick() {
        if (!window.intergramId) {
            console.error("To use intergram you have to set an intergramId ");
            return;
        }

        document.querySelector('#intergramTitle').style.display = 'none';
        document.querySelector('#intergramRoot').
        insertAdjacentHTML('beforeend',
            '<iframe src=\'https:\/\/idoco.github.io/intergram/chat.html#' + window.intergramId +
            '\' width=\'300\' height=\'350\' frameborder=\'0\'><\/iframe>')
    }

    // add a style tag to the head
    var styleTag = document.createElement("link");
    styleTag.rel = "stylesheet";
    styleTag.type = "text/css";
    styleTag.href = "https://idoco.github.io/intergram/embed/style.css";
    styleTag.media = "all";
    document.getElementsByTagName('head')[0].appendChild(styleTag);

    // create the wrapper
    var root = document.createElement('div');
    root.id = 'intergramRoot';
    document.getElementsByTagName('body')[0].appendChild(root);

    // create the inner div
    var div = document.createElement('div');
    div.id = 'intergramTitle';
    div.onclick = onClick;
    root.appendChild(div);

    div.innerHTML = "Click to chat with us!"

})();