import { h, render } from 'preact';

import Widget from './widget';
import { defaultConfiguration } from './default-configuration';

let injected = false;
const animationStyles = `
.intergram-loading {
  display: block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  animation: pulse 1s ease-in-out infinite;
  transform: scale(1);
  position: absolute;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.5);
    background-color: #B7A65C;
  }
  100% {
    transform: scale(1);
  }
}`;

if (window.attachEvent) {
  window.attachEvent('onload', injectChat);
} else {
  window.addEventListener('load', injectChat, false);
}

function injectChat() {
  if (injected) {
    return;
  }
  if (!window.intergramId) {
    console.error(
      'Please set window.intergramId (see example at github.com/idoco/intergram)'
    );
  } else {
    injected = true;
    let root = document.createElement('div');
    const style = document.createElement('style');
    style.innerHTML = animationStyles;
    root.id = 'intergramRoot';
    document.getElementsByTagName('body')[0].appendChild(root);
    document.getElementsByTagName('head')[0].appendChild(style);
    const server = window.intergramServer || 'https://www.intergram.xyz';
    const iFrameSrc = server + '/chat.html';
    const host = window.location.host || 'unknown-host';
    setTimeout(() => {
      root.setAttribute('data-loaded', true);
    }, 500);
    const conf = {
      ...defaultConfiguration,
      ...window.intergramCustomizations,
      url: window.location.href
    };

    render(
      <Widget
        intergramId={window.intergramId}
        host={host}
        isMobile={window.screen.width < 500}
        iFrameSrc={iFrameSrc}
        conf={conf}
      />,
      root
    );

    try {
      const request = new XMLHttpRequest();
      let url = `${server}/usage-start?host=${host}`;
      request.open('POST', url);
      request.send();
    } catch (e) {
      /* Fail silently */
    }
  }
}

window.injectChat = injectChat;
