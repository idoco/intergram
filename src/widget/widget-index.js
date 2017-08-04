import {h, render} from 'preact';
import Widget from './widget';
import {defaultConfiguration} from './default-configuration';

if (window.attachEvent) {
    window.attachEvent('onload', injectChat);
} else {
    window.addEventListener('load', injectChat, false);
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(document.getElementById('intergramWidget').src);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function injectChat() {
    let root = document.createElement('div');
    root.id = 'intergramRoot';
    document.getElementsByTagName('body')[0].appendChild(root);
    const host = window.location.host;
    console.log('settings');
    console.log(getUrlParameter('settings'));
    const conf = {...defaultConfiguration, ...JSON.parse(getUrlParameter('settings'))};
    const iFrameSrc = 'chat.html';

    render(
        <Widget host={host}
                isMobile={window.screen.width < 500}
                iFrameSrc={iFrameSrc}
                conf={conf}
        />,
        root
    );

}
