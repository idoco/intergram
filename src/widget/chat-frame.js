import { h, Component } from 'preact';

export default class ChatFrame extends Component {

    shouldComponentUpdate() {
        // do not re-render via diff:
        return false;
    }

    render({intergramId, host, iFrameSrc, isMobile},{}) {
        return (
            <iframe src={iFrameSrc + '?id=' + intergramId + '&host=' + host}
                    width={window.screen.height < 800 ? '100%' : 300}
                    height={window.screen.height < 800 ? '94%' : 350}
                    frameborder='0' >
            </iframe>
        );
    }
}
