import { Component, h } from 'preact';

export default class ChatFrame extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render({ intergramId, host, iFrameSrc, isMobile, conf }, {}) {
    let dynamicConf = window.intergramOnOpen || {}; // these configuration are loaded when the chat frame is opened
    let encodedConf = encodeURIComponent(
      JSON.stringify({ ...conf, ...dynamicConf })
    );
    return (
      <iframe
        src={
          iFrameSrc +
          '?id=' +
          intergramId +
          '&host=' +
          host +
          '&conf=' +
          encodedConf
        }
        width="100%"
        height={isMobile ? '94%' : '100%'}
        frameborder="0"
      />
    );
  }
}
