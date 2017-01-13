import { h, render } from 'preact';
import Chat from './Chat';

const userId = Math.random().toString(36).substr(2, 5); // 5 random chars
const chatId = getUrlParameter('id');

render(<Chat chatId={chatId} userId={userId} />, document.getElementById('intergramChat'));

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}