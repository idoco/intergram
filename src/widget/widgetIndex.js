import { h, render } from 'preact';
import App from './App';

if (window.attachEvent) {
    window.attachEvent('onload', injectChat);
} else {
    window.addEventListener('load', injectChat, false);
}

function injectChat() {
    let root = document.createElement('div');
    root.id = 'intergramRoot';
    document.getElementsByTagName('body')[0].appendChild(root);
    render(<App />, root);
}
