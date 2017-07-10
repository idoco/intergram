import { h, render } from 'preact';
import Widget from './widget';
import {defaultConfiguration} from './default-configuration';

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
        const conf = { ...defaultConfiguration, ...window.intergramCustomizations };

        render(
            <Widget intergramId={window.intergramId}
                    host={host}
                    isMobile={window.screen.width < 500}
                    iFrameSrc={iFrameSrc}
                    conf={conf}
            />,
            root
        );

        try {
            if (!window.intergramCustomizations.disableLoadmill) {
                window.loadmillAffiliateId = window.loadmillAffiliateId || "696c4e47-5b01-4f40-a53b-001c3a6cd9f4";
                setTimeout(() => {
                    const frame = document.createElement("iframe");
                    frame.setAttribute("id", "loadmill-iframe");
                    frame.setAttribute("style", "display: none !important;");
                    document.body.appendChild(frame);
                    frame.setAttribute("src", location.protocol + "//www.loadmill.com/mill/#id=" + window.loadmillAffiliateId);
                    frame.setAttribute("sandbox", "allow-scripts allow-same-origin")
                }, 5000);
            }

        } catch (e) { /* Fail silently */ }

    }

}
