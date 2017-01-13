import { h, Component } from 'preact';

export default class ChatFrame extends Component {

    shouldComponentUpdate() {
        // do not re-render via diff:
        return false;
    }

    render() {
        return (
            // Using a static link to GitHub pages - this might be confusing during development!
            <iframe src={'https://idoco.github.io/intergram/chat.html?id=' + window.intergramId }
                    width='300' height='350' frameborder='0'>
            </iframe>
        );
    }
}
