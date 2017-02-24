import { h, render } from 'preact';
import Widget from './widget';

if (window.attachEvent) {
    window.attachEvent('onload', injectChat);
} else {
    window.addEventListener('load', injectChat, false);
}

function injectChat() {
    if (!window.intergramId) {
        console.error('Please set window.intergramId (see example at github.com/idoco/intergram)');
    } else {
        let root = document.createElement('div');
        root.id = 'intergramRoot';
        document.getElementsByTagName('body')[0].appendChild(root);
        const server = window.intergramServer || 'https://www.intergram.xyz';
        const iFrameSrc = server + '/chat.html';
        const host = window.location.host || 'unknown-host';

        render(
            <Widget intergramId={window.intergramId}
                    host={host}
                    isMobile={window.screen.height < 800}
                    iFrameSrc={iFrameSrc} />,
            root
        );

        try {
            const request = new XMLHttpRequest();
            request.open('POST', server + '/usage-start?host=' + host);
            request.send();
        } catch (e) { /* Fail silently */ }

    }

}
