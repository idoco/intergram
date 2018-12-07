import * as store from 'store'
import io from 'socket.io-client'

import { h, Component } from 'preact';
import MessageArea from './message-area';

export default class Chat extends Component {

    autoResponseState = 'pristine'; // pristine, set or canceled
    autoResponseTimer = 0;

    constructor(props) {
        super(props);
        if (store.enabled) {
            this.messagesKey = 'messages' + '.' + props.chatId + '.' + props.host;
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
            this.writeToMessages({text: this.props.conf.introMessage, from: 'admin'});
        }
    }

    render({},state) {
        return (
            <div class="wrapper">
                <MessageArea messages={state.messages} conf={this.props.conf}/>

                <div class="input-area">
                    <textarea class="textarea" type="text" placeholder={this.props.conf.placeholderText}
                           ref={(input) => { this.input = input }}
                           onKeyPress={this.handleKeyPress}/>
                    {
                        this.props.conf.displayBanner ?
                            <a class="banner" href="https://github.com/idoco/intergram" target="_blank">
                                Powered by <b>Intergram</b>&nbsp;
                            </a>
                            : ''
                    }
                </div>
            </div>
        );
    }

    handleKeyPress = (e) => {
        let text = this.input.value.trim();
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            if (text) {
                text = text.replace(/\n{2,}/g, '\n');
                this.socket.send({text, from: 'visitor', visitorName: this.props.conf.visitorName});
                this.input.value = '';

                if (this.autoResponseState === 'pristine') {

                    setTimeout(() => {
                        this.writeToMessages({
                            text: this.props.conf.autoResponse,
                            from: 'admin'
                        });
                    }, 500);

                    this.autoResponseTimer = setTimeout(() => {
                        this.writeToMessages({
                            text: this.props.conf.autoNoResponse,
                            from: 'admin'
                        });
                        this.autoResponseState = 'canceled';
                    }, 60 * 1000);
                    this.autoResponseState = 'set';
                }
            }
        }
    };

    incomingMessage = (msg) => {
        this.writeToMessages(msg);
        if (msg.from === 'admin') {
            document.getElementById('messageSound').play();

            if (this.autoResponseState === 'pristine') {
                this.autoResponseState = 'canceled';
            } else if (this.autoResponseState === 'set') {
                this.autoResponseState = 'canceled';
                clearTimeout(this.autoResponseTimer);
            }
        }
    };

    writeToMessages = (msg) => {
        msg.time = msg.time ? new Date(msg.time) : new Date;
        this.setState({
            message: this.state.messages.push(msg)
        });

        if (store.enabled) {
            try {
                store.transact(this.messagesKey, function (messages) {
                    messages.push(msg);
                });
            } catch (e) {
                console.log('failed to add new message to local storage', e);
                store.set(this.messagesKey, [])
            }
        }
    }
}
