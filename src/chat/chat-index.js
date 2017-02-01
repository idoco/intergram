import { h, render } from 'preact';
import Chat from './chat';
import * as store from 'store'

render(<Chat chatId={getUrlParameter('id')} userId={getUserId()} />, document.getElementById('intergramChat'));

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function getUserId () {
    let userId = store.enabled && store.get('userId');

    if (!userId) {
        userId = Math.random().toString(36).substr(2, 6); // 6 random chars
        if (store.enabled) {
            store.set('userId', userId);
        }
    }

    return userId
}