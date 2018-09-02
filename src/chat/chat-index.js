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
const server = getUrlParameter('server')
const lang = getUrlParameter('lang')

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

function getUserId () {
  if (store.enabled) {
    return store.get('userId') || store.set('userId', generateRandomId());
  } else {
    return generateRandomId();
  }
}

function generateRandomId() {
  let ret = ''
  try {
    const request = new XMLHttpRequest();
    request.open('GET', server + '/fake' + lang, false)
    request.send()
    if (request.status === 200) {
      ret = request.responseText
    }
  } catch (e) {
    console.error(e)
    ret = Math.random().toString(36).substr(2, 6)
  }
  return ret
}
