import { h, Component } from 'preact';

export default class ChatFrame extends Component {

    shouldComponentUpdate() {
        // do not re-render via diff:
        return false;
    }

    render() {
        const frameSrc = window.intergramFrameSrc || 'https://intergram.herokuapp.com/chat.html';
        return (
            <iframe src={frameSrc + '?id=' + window.intergramId}
                    width='300' height='350' frameborder='0'>
            </iframe>
        );
    }
}
