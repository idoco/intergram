import { h, render } from 'preact';
import Widget from './widget';
import {defaultConfiguration, defaultConfigurationDE} from './default-configuration';

// Get default configs and overwrite them with user configs
let conf = { ...defaultConfiguration, ...window.intergramCustomizations };
const confDE = { ...defaultConfigurationDE, ...window.intergramCustomizationsDE };

// Get browser language
const browserLang = navigator.language
let lang = 'EN'
if (browserLang.startsWith('de')) lang = 'DE'

if (lang == 'DE') conf = { ...conf, ...confDE}

let currentUTCHours = new Date(Date.now()).getUTCHours()
if (currentUTCHours >= conf.availabilityStart && currentUTCHours < conf.availabilityEnd ||
  (conf.availability2 && currentUTCHours >= conf.availabilityStart2 && currentUTCHours < conf.availabilityEnd2))
{ if (window.attachEvent) {
  window.attachEvent('onload', injectChat);
} else {
  window.addEventListener('load', injectChat, false);
}}



function injectChat() {
  if (!window.intergramId) {
    console.error('Please set window.intergramId (see example at github.com/idoco/intergram)');
  } else {
    let root = document.createElement('div');
    root.id = 'intergramRoot';
    document.getElementsByTagName('body')[0].appendChild(root);
    const server = window.intergramServer || 'https://www.intergram.xyz';
    const iFrameSrc = server + '/chat.html';
    const host = window.location.host || 'unknown-host';

    render(
      <Widget intergramId={window.intergramId}
              host={host}
              isMobile={window.screen.width < 500}
              iFrameSrc={iFrameSrc}
              conf={conf}
              server={server}
              lang={lang}
      />,
      root
    );

    try {
      const request = new XMLHttpRequest();
      request.open('POST', server + '/usage-start?host=' + host);
      request.send();
    } catch (e) { /* Fail silently */ }

  }
}
