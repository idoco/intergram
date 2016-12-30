
(function () {

    injectCSS();
    if (window.attachEvent) {
        window.attachEvent('onload', injectChat);
    } else {
        window.addEventListener('load', injectChat, false);
    }

    function openClick() {
        if (!window.intergramId) {
            console.error("To use Intergram you have to set an intergramId ");
            return;
        }

        document.querySelector('#intergramTitle').innerHTML = 'Intergram';
        document.querySelector('#intergramTitle').onclick = closeClick;

        document.querySelector('#intergramRoot').
        insertAdjacentHTML('beforeend',
            '<iframe src=\'https:\/\/idoco.github.io/intergram/chat.html#' + window.intergramId +
            '\' width=\'300\' height=\'350\' frameborder=\'0\' id=\'intergramIframe\' ><\/iframe>')
    }

    function closeClick() {
        document.querySelector('#intergramTitle').innerHTML = "Click to chat with us!";
        document.querySelector('#intergramTitle').onclick = openClick;

        var chatIframe = document.querySelector('#intergramIframe');
        chatIframe.parentNode.removeChild(chatIframe);
    }

    function injectCSS() {
        // add a style tag to the head
        var styleTag = document.createElement("link");
        styleTag.rel = "stylesheet";
        styleTag.type = "text/css";
        styleTag.href = "https://idoco.github.io/intergram/embed/style.css";
        styleTag.media = "all";
        document.getElementsByTagName('head')[0].appendChild(styleTag);
    }

    function injectChat() {
        // create the wrapper
        var root = document.createElement('div');
        root.id = 'intergramRoot';
        document.getElementsByTagName('body')[0].appendChild(root);

        // create the inner div
        var div = document.createElement('div');
        div.id = 'intergramTitle';
        div.onclick = openClick;
        root.appendChild(div);

        div.innerHTML = "Click to chat with us!"
    }

})();