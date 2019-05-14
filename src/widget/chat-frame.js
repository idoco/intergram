import { Component, h } from 'preact'

export default class ChatFrame extends Component {
  constructor () {
    super()
    this.state = {
      loading: true
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return false
  }
  hideSpinner () {
    this.loader.style.display = 'none'
    this.frame.style.opacity = '1'
  }
  render ({ intergramId, host, iFrameSrc, isMobile, conf }, {}) {
    // these configuration are loaded when the chat frame is opened
    let dynamicConf = window.intergramOnOpen || {}
    let encodedConf = encodeURIComponent(
      JSON.stringify({ ...conf, ...dynamicConf })
    )
    return (
      <span>
        <span
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%'
          }}
          ref={r => {
            this.loader = r
          }}
          className='intergram-loading'
        />
        <iframe
          ref={r => {
            this.frame = r
          }}
          onLoad={() => this.hideSpinner()}
          src={
            iFrameSrc +
            '?id=' +
            intergramId +
            '&host=' +
            host +
            '&conf=' +
            encodedConf
          }
          width='100%'
          height='100%'
          frameborder='0'
          style={{
            transition: 'opacity 250ms ease-in-out',
            opacity: '0'
          }}
        />
      </span>
    )
  }
}
