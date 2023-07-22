import { h, render } from 'preact';
import Chat from './chat';
import * as store from 'store'
import { hri } from 'human-readable-ids';

let conf = {};
let CustomData = {};
const confString = getUrlParameter('conf');
const CustomDataString = getUrlParameter('CustomData');

if (CustomDataString) {
    try {
        CustomData = JSON.parse(CustomDataString);
    } catch (e) {
        console.log('Failed to parse conf', CustomDataString, e);
    }
}

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
        CustomData={CustomData}
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

function generateGuestUsername() {
    return 'Guest-' + Math.random().toString(36).substr(2, 6);
}

function getUserId() {

    if (store.enabled) {
        const userId = store.get('userId');

        if (CustomData && CustomData.username && CustomData.username !== userId) {
            store.set('userId', CustomData.username);
            return CustomData.username;
        }

        if (!userId) {
            const generatedUserId = conf.humanReadableIds ? hri.random() : generateGuestUsername();
            store.set('userId', generatedUserId);
            return generatedUserId;
        }

        return userId;
    } else {
        return CustomData.username || (conf.humanReadableIds ? hri.random() : generateGuestUsername());
    }


}

