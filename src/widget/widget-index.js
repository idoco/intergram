import 'whatwg-fetch'
import { h, render } from 'preact';
import Widget from './widget';
import { defaultConfiguration } from './default-configuration';


if (window.attachEvent) {
    window.attachEvent('onload', injectChat);
} else {
    window.addEventListener('load', injectChat, false);
}

function injectChat() {
    if (!window.intergramId) {
        console.error('Please set window.intergramId (see example at github.com/Kintoyyy/intergram)');
    } else {
        let root = document.createElement('div');
        root.id = 'intergramRoot';
        document.getElementsByTagName('body')[0].appendChild(root);
        const server = window.intergramServer || 'https://telegram-chat-widget-t3ez.onrender.com';
        const iFrameSrc = server + '/chat.html';
        const host = window.location.host || 'unknown-host';
        const conf = { ...defaultConfiguration, ...window.intergramCustomizations };
        const chatId = window.intergramId;

        const CustomData = window.CustomData || null;

        fetch(server + '/usage-start', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                host: host,
                chatId: chatId,
            })
        }).then(response => {
            response.json().then(result => {
                if (result.online) {
                    render(
                        <Widget intergramId={chatId}
                            CustomData={CustomData}
                            host={host}
                            isMobile={window.screen.width < 500}
                            iFrameSrc={iFrameSrc}
                            conf={conf}
                        />,
                        root
                    );
                }
            });
        });

    }




}



