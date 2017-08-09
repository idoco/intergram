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

function getBaseUrl(){
    // let pathArray = document.getElementById('intergramWidget').src.split( '/' );
    // let protocol = pathArray[0];
    // let host = pathArray[2];
    // let url = protocol + '//' + host;
    // return url;
    return document.getElementById('intergramWidget').src.split( 'js/widget.js' )[0];
}

function injectChat() {
    let root = document.createElement('div');
    root.id = 'intergramRoot';
    document.getElementsByTagName('body')[0].appendChild(root);
    const settings = JSON.parse(getUrlParameter('settings'));
    console.log('settings');
    console.log(settings);
    const conf = {...defaultConfiguration, ...settings};
    const iFrameSrc = getBaseUrl()+'chat.html';

    render(
        <Widget
                isMobile={window.screen.width < 500}
                iFrameSrc={iFrameSrc}
                conf={conf}
        />,
        root
    );

}
