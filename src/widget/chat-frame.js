import { h, Component } from 'preact';

export default class ChatFrame extends Component {

    shouldComponentUpdate() {
        // do not re-render via diff:
        return false;
    }

    render({intergramId, host, iFrameSrc},{}) {
        return (
            <iframe src={iFrameSrc + '?id=' + intergramId + '&host=' + host}
                    width='300'
                    height={window.screen.height < 800 ? 250 : 350}
                    frameborder='0' >
            </iframe>
        );
    }
}
