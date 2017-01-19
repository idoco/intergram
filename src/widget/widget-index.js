import { h, render } from 'preact';
import Widget from './widget';

if (window.attachEvent) {
    window.attachEvent('onload', injectChat);
} else {
    window.addEventListener('load', injectChat, false);
}

function injectChat() {
    if (!window.intergramId) {
        console.error("Please set window.intergramId (see example at github.com/idoco/intergram)");
    } else {
        let root = document.createElement('div');
        root.id = 'intergramRoot';
        document.getElementsByTagName('body')[0].appendChild(root);
        const iFrameSrc = window.intergramIFrameSrc || 'https://www.intergram.xyz/chat.html';
        render(<Widget intergramId={window.intergramId} iFrameSrc={iFrameSrc} />, root);
    }
}
