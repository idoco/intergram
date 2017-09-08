import { h, render } from 'preact';
import Chat from './chat';
import * as store from 'store'

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
    conf.includeJSURL ?
    <script id="includedJS" src={conf.includeJSURL}> </script>
    : {},
    document.getElementById('includePlaceholder')
);

render(
    <Chat
        userId={getUserId()}
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

function getUserId () {
    if (store.enabled) {
        return store.get('userId') || store.set('userId', generateRandomId());
    } else {
        return generateRandomId();
    }
}

function generateRandomId() {
    return Math.random().toString(36).substr(2, 6);
}