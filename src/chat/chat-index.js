import * as store from 'store';

import { h, render } from 'preact';

import Chat from './chat';

let conf = {};
const confString = getUrlParameter('conf');

if (confString) {
  try {
    conf = JSON.parse(confString);
    console.log('conf', conf);
  } catch (e) {
    console.log('Failed to parse conf', confString, e);
  }
}

render(
  <Chat
    chatId={getUrlParameter('id')}
    isNewUser={!store.get('userId')}
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
  return results === null
    ? ''
    : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function getUserId() {
  let userId = conf.userId;
  let storedId;
  if (store.enabled) {
    storedId = store.get('userId');
  }
  if (userId) {
    if (userId && userId !== storedId) {
      // user id has changed, probably due to login
      console.log('id has changed');
      store.set('userId', userId);
      store.set('oldId', storedId);
    }
    return userId;
  }
  // no userId, but there is an old id
  // so switch back to it
  else if (store.get('oldId')) {
    const id = store.get('oldId');
    store.set('userId', id);
    return id;
  }

  if (!storedId) {
    const newId = generateRandomUserId();
    if (store.enabled) {
      store.set('userId', newId);
    }
    return newId;
  }

  return storedId;
}

function generateRandomUserId() {
  return Math.random()
    .toString(36)
    .substr(2, 6);
}
