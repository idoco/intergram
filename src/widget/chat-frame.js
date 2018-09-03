/* eslint-disable indent */
import { h, Component } from 'preact'

export default class ChatFrame extends Component {
  shouldComponentUpdate () {
    // do not re-render via diff:
    return false
  }

  render ({ intergramId, host, iFrameSrc, isMobile, conf, server, lang }, {}) {
    let dynamicConf = window.intergramOnOpen || {} // these configuration are loaded when the chat frame is opened
    let encodedConf = encodeURIComponent(JSON.stringify({ ...conf, ...dynamicConf }))
    return (
      <iframe src={iFrameSrc + '?id=' + intergramId + '&host=' + host + '&conf=' + encodedConf +
      '&server=' + server + '&lang=' + lang}
        width='100%'
        height={isMobile ? '94%' : '100%'}
        frameborder='0' />
    )
  }
}
