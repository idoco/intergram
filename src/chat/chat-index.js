import * as store from 'store';

import { Component, h, render } from 'preact';
import { danielleImg, jamesImg, otterImg } from './admin-images';

import Chat from './chat';
import Consent from './consent';

const now = new Date().toLocaleString('en-US', {
  timeZone: 'Europe/London'
});
let hours = new Date(now).getHours();
let minutes = new Date(now).getMinutes();
if (hours < 10) {
  hours = `0${hours}`;
}
if (minutes < 10) {
  minutes = `0${minutes}`;
}
const ampm = hours >= 12 ? 'pm' : 'am';

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

export default class ConsentSwitch extends Component {
  constructor(props) {
    super(props);
    this.state.consented = wasSeenBefore();
  }

  render({}, state) {
    let content;
    if (!this.state.consented) {
      content = (
        <Consent
          onAcceptConsent={this.onAcceptConsent}
          contactEmail={conf.contactEmail}
        />
      );
    } else {
      content = (
        <Chat
          chatId={getUrlParameter('id')}
          isNewUser={!store.get('userId')}
          userId={getUserId()}
          host={getUrlParameter('host')}
          conf={conf}
        />
      );
    }
    return (
      <div class="chat-container">
        <div class="chat-header">
          <h5>Questions? Problems? Chat with us!</h5>
          <p>
            It's currently {`${hours}:${minutes}${ampm}`} where we are, if we're
            awake then we'll typically respond to your message within a few
            minutes.
          </p>

          <div class="admin-images">
            <img src={otterImg} alt="otter-img" />
            <img src={danielleImg} alt="danielle-img" />
            <img src={jamesImg} alt="james-img" />
          </div>
        </div>
        {content}
      </div>
    );
  }

  onAcceptConsent = () => {
    this.setState({
      consented: true
    });
  };
}

render(<ConsentSwitch />, document.getElementById('intergramChat'));

function wasSeenBefore() {
  return !!store.get('userId');
}

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
  return Math.random().toString(36).substr(2, 6);
}
