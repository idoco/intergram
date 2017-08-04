import * as store from 'store'
import io from 'socket.io-client'

import {h, Component} from 'preact';
import MessageArea from './message-area';

export default class Chat extends Component {

    autoResponseState = 'pristine'; // pristine, set or canceled
    autoResponseTimer = 0;

    constructor(props) {
        super(props);
        if (store.enabled) {
            this.messagesKey = 'messages' + '.' + props.conf.chatId + '-' + props.userId + '.' + props.host;
            this.state.messages = store.get(this.messagesKey) || store.set(this.messagesKey, {});
        } else {
            this.state.messages = {};
        }
    }

    componentDidMount() {
        this.socket = io.connect();
        this.socket.on('connect', () => {
            this.socket.emit('register', {chatId: this.props.conf.chatId, userId: this.props.userId});
        });
        // this.socket.on(this.props.conf.chatId, this.incomingMessage);
        this.socket.on(this.props.conf.chatId + '-' + this.props.userId, this.incomingMessage);

        if (!this.state.messages.length && this.props.conf.introMessage) {
            this.writeToMessages({text: this.props.conf.introMessage, from: 'admin'});
        }
    }

    render({}, state) {
        return (
            <div>
                <div id="messageArea">
                    <MessageArea messages={state.messages} conf={this.props.conf}/>
                </div>
                <input class="textarea" type="text" placeholder={this.props.conf.placeholderText}
                       ref={(input) => {
                           this.input = input
                       }}
                       onKeyPress={this.handleKeyPress}/>

                <a class="banner" href={this.props.conf.aboutLink} target="_blank">
                    {(this.props.conf.aboutText == 'AboutIcon') ?
                        <svg style="position: absolute; width: 14px; bottom: 6px; right: 6px;" fill="#EEEEEE" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1536 1792"><path d="M1024 1376v-160q0-14-9-23t-23-9h-96v-512q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v160q0 14 9 23t23 9h96v320h-96q-14 0-23 9t-9 23v160q0 14 9 23t23 9h448q14 0 23-9t9-23zm-128-896v-160q0-14-9-23t-23-9h-192q-14 0-23 9t-9 23v160q0 14 9 23t23 9h192q14 0 23-9t9-23zm640 416q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/></svg>
                    : this.props.conf.aboutText}
                </a>
            </div>
        );
    }

    handleKeyPress = (e) => {
        if (e.keyCode == 13 && this.input.value) {
            let text = this.input.value;
            const current_message = {text, from: 'visitor', time: (new Date()).toJSON()};
            console.log('sending text', text);
            this.socket.send(current_message);
            this.writeToMessages(current_message);
            this.input.value = '';

            if (this.autoResponseState === 'pristine') {
                if (this.props.conf.autoResponse) {
                    setTimeout(() => {
                        this.writeToMessages({
                            text: this.props.conf.autoResponse,
                            from: 'admin',
                            time: (new Date()).toJSON()
                        });
                    }, 500);
                }
                if (this.props.conf.autoNoResponse) {
                    this.autoResponseTimer = setTimeout(() => {
                        this.writeToMessages({
                            text: this.props.conf.autoNoResponse,
                            from: 'admin',
                            time: (new Date()).toJSON()
                        });
                        this.autoResponseState = 'canceled';
                    }, 60 * 1000);
                }
                this.autoResponseState = 'set';
            }
        }
    };

    incomingMessage = (msg) => {
        console.log('receiving message', msg);
        this.writeToMessages(msg);
        if (msg.from === 'admin') {
            if (this.props.conf.playSound) {
                document.getElementById('messageSound').play();
            }
            if (this.autoResponseState === 'pristine') {
                this.autoResponseState = 'canceled';
            } else if (this.autoResponseState === 'set') {
                this.autoResponseState = 'canceled';
                clearTimeout(this.autoResponseTimer);
            }
        }
    };

    writeToMessages = (msg) => {
        if (typeof msg.time == 'undefined') {
            msg.time = (new Date()).toJSON();//2015-10-26T07:46:36.611Z
        }
        this.setState({
            message: this.state.messages[msg.time]=msg
        });

        if (store.enabled) {
            try {
                store.transact(this.messagesKey, function (messages) {
                    messages[msg.time]=msg;
                });
            } catch (e) {
                console.log('failed to add new message to local storage', e);
                store.set(this.messagesKey, [])
            }
        }
    }
}
