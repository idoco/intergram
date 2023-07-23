import * as store from 'store';
import io from 'socket.io-client';

import { h, Component } from 'preact';
import MessageArea from './message-area';

export default class Chat extends Component {
    autoResponseState = 'pristine'; // pristine, set, or canceled
    autoResponseTimer = 0;

    constructor(props) {
        super(props);
        if (store.enabled) {
            this.messagesKey = 'messages' + '.' + props.chatId + '.' + props.host;
            this.state.messages = store.get(this.messagesKey) || store.set(this.messagesKey, []);
        } else {
            this.state.messages = [];
        }
        this.state.isMobile = this.isMobileDevice();
    }

    componentDidMount() {
        this.socket = io.connect();
        this.socket.on('connect', () => {
            this.socket.emit('register', { chatId: this.props.chatId, userId: this.props.userId, CustomData: this.props.CustomData, helpMsg: this.props.conf.helpMessage });
        });
        this.socket.on(this.props.chatId, this.incomingMessage);
        this.socket.on(this.props.chatId + '-' + this.props.userId, this.incomingMessage);

        if (!this.state.messages.length) {
            this.writeToMessages({ text: this.props.conf.introMessage, from: 'admin' });
        }
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    render({ }, state) {
        const inputEvent = state.isMobile ? null : this.handleKeyPress;

        return (
            <div class="wrapper">
                <MessageArea messages={state.messages} conf={this.props.conf} />
                {state.isMobile && this.props.conf.displayBanner ? (
                    <a class="banner" href="https://github.com/Kintoyyy/Telegram-Chat-Widget" target="_blank">
                        Powered by <b>Telegram Chat Widget</b>&nbsp;
                    </a>
                ) : null}
                <div class="input-area">
                    <textarea
                        class="textarea"
                        type="text"
                        placeholder={this.props.conf.placeholderText}
                        ref={(input) => {
                            this.input = input;
                        }}
                        onKeyPress={inputEvent} // Use inputEvent instead of this.handleKeyPress
                    />

                    <button type="button" onClick={this.handleSendMessage}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            fill="blue"
                            viewBox="0 0 1024 1024"
                        >
                            <path
                                d="M110.9 558.2l147.3 64.5L682.7 391.1l-256 298.7 366.9 167.1a42.7 42.7 0 0 0 59.7-36.3l42.7-640a42.8 42.8 0 0 0-60.8-41.5l-725.3 341.4a42.8 42.8 0 0 0 1 77.7zM341.3 945.8l203.8-98.8L341.3 751.9z">
                            </path>
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    handleKeyPress = (e) => {
        let text = this.input.value.trim();
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage(text);
        }
    };

    handleSendMessage = () => {
        let text = this.input.value.trim();
        this.sendMessage(text);
    };

    sendMessage = (text) => {
        if (text) {
            text = text.replace(/\n{2,}/g, '\n');
            this.socket.send({ text, from: 'visitor', visitorName: this.props.conf.visitorName });
            this.input.value = '';

            if (this.autoResponseState === 'pristine') {
                setTimeout(() => {
                    this.writeToMessages({
                        text: this.props.conf.autoResponse,
                        from: 'admin',
                    });
                }, 500);

                this.autoResponseTimer = setTimeout(() => {
                    this.writeToMessages({
                        text: this.props.conf.autoNoResponse,
                        from: 'admin',
                    });
                    this.autoResponseState = 'canceled';
                }, 60 * 1000);
                this.autoResponseState = 'set';
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
        msg.time = msg.time ? new Date(msg.time) : new Date();
        this.setState({
            messages: this.state.messages.concat(msg),
        });

        if (store.enabled) {
            try {
                store.transact(this.messagesKey, (messages) => {
                    messages.push(msg);
                });
            } catch (e) {
                console.log('failed to add new message to local storage', e);
                store.set(this.messagesKey, []);
            }
        }
    };
}
