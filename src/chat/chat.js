import * as store from 'store'
import io from 'socket.io-client'

import { h, Component } from 'preact';
import MessageArea from './message-area';

export default class Chat extends Component {

    constructor(props) {
        super(props);
        if (store.enabled) {
            this.messagesKey = 'messages' + '.' + props.chatId;
            this.state.messages = store.get(this.messagesKey) || store.set(this.messagesKey, []);
        } else {
            this.state.messages = [];
        }
    }

    componentDidMount() {
        this.socket = io.connect();
        this.socket.on('connect', () => {
            this.socket.emit('register', {chatId: this.props.chatId, userId: this.props.userId });
        });
        this.socket.on(this.props.chatId, this.incomingMessage);
        this.socket.on(this.props.chatId+'-'+this.props.userId, this.incomingMessage);

        if (!this.state.messages.length) {
            this.writeToMessages({text: 'Hello! How can we help you?', from: 'admin'});
        }
    }

    render({},state) {
        return (
            <div>
                <MessageArea messages={state.messages} />

                <input class="textarea" type="text" placeholder="Type here!"
                       ref={(input) => { this.input = input }}
                       onKeyPress={this.handleKeyPress}/>

                <a class="banner" href="https://github.com/idoco/intergram" target="_blank">
                    Powered by <b>Intergram</b>&nbsp;
                </a>
            </div>
        );
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter' && this.input.value) {
            let text = this.input.value;
            this.socket.send({text, from: 'visitor'});
            this.input.value = '';
        }
    };

    incomingMessage = (msg) => {
        this.writeToMessages(msg);
        if (msg.from === 'admin') {
            document.getElementById('messageSound').play();
        }
    };

    writeToMessages = (msg) => {
        msg.time = new Date();
        this.setState({
            message: this.state.messages.push(msg)
        });
        store.transact(this.messagesKey, function(messages) {
            messages.push(msg);
        });
    }
}
