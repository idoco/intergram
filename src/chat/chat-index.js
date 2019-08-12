import {h, render} from 'preact';
import Chat from './chat';
import * as store from 'store'
import {hri} from 'human-readable-ids';

let conf = {};
const confString = getUrlParameter('conf');
if (confString) {
    try {
        conf = JSON.parse(confString);
    } catch (e) {
        console.log('Failed to parse conf', confString, e);
    }
}

render(
    <Chat
        chatId={getUrlParameter('id')}
        userId={getUserId()}
        host={getUrlParameter('host')}
        conf={conf}
    />,
    document.getElementById('intergramChat')
);

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function getUserId() {
    if (store.enabled) {
        return store.get('userId') || store.set('userId', hri.random());
    } else {
        return hri.random();
    }
}