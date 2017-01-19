import { h, Component } from 'preact';

export default class ChatFrame extends Component {

    shouldComponentUpdate() {
        // do not re-render via diff:
        return false;
    }

    render({intergramId, iFrameSrc},{}) {
        return (
            <iframe src={iFrameSrc + '?id=' + intergramId}
                    width='300' height='350' frameborder='0'>
            </iframe>
        );
    }
}
