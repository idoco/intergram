import { h, Component } from 'preact';

export default class ChatFrame extends Component {

    shouldComponentUpdate() {
        // do not re-render via diff:
        return false;
    }

    render({intergramId, host, iFrameSrc, isMobile, conf},{}) {
        let encodedConf = encodeURIComponent(JSON.stringify(conf));
        return (
            <iframe src={iFrameSrc + '?id=' + intergramId + '&host=' + host + '&conf=' + encodedConf }
                    width='100%'
                    height={isMobile ? '94%' : '100%'}
                    frameborder='0' >
            </iframe>
        );
    }
}
