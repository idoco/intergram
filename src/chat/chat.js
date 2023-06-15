import * as store from 'store';

import { Component, h } from 'preact';

import MessageArea from './message-area';
import io from 'socket.io-client';

export default class Chat extends Component {
  autoResponseState = 'pristine'; // pristine, set or canceled
  autoResponseTimer = 0;

  constructor(props) {
    super(props);
    if (store.enabled) {
      this.messagesKey = `messages.${props.chatId}.${props.host}.${props.userId}`;
      if (props.conf.private) {
        this.messagesKey = `${this.messagesKey}.private`;
      }
      this.state.messages =
        store.get(this.messagesKey) || store.set(this.messagesKey, []);
    } else {
      this.state.messages = [];
    }
  }

  componentDidMount() {
    this.socket = io.connect();
    const oldId = store.get('oldId');
    this.socket.on('connect', () => {
      this.socket.emit('register', {
        chatId: this.props.chatId,
        userId: this.props.userId,
        isNewUser: this.props.isNewUser,
        userData: this.props.conf.userData,
        currentUrl: this.props.conf.url,
        oldId
      });
    });
    store.set('oldId', null);
    this.socket.on(
      this.props.chatId + '-' + this.props.userId,
      this.incomingMessage
    );

    if (!this.state.messages.length) {
      this.writeToMessages({
        text: this.props.conf.introMessage,
        from: 'admin'
      });
    }
  }

  render({}, state) {
    return (
      <div style="height: 100%;">
        <MessageArea messages={state.messages} conf={this.props.conf} />
        <input
          class="textarea"
          type="text"
          placeholder={this.props.conf.placeholderText}
          ref={(input) => {
            this.input = input;
          }}
          onKeyPress={this.handleKeyPress}
        />
      </div>
    );
  }

  handleKeyPress = (e) => {
    let message;
    let timeout;
    const now = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Singapore'
    });
    let hours = new Date(now).getHours();
    const isNightTime = hours < 8 && hours > 11;
    this.socket.send({ action: 'typing' });
    if (e.keyCode == 13 && this.input.value) {
      let text = this.input.value;
      this.socket.send({
        action: 'message',
        msg: {
          text,
          from: 'visitor'
        },
        userData: this.props.conf.userData
      });
      this.input.value = '';
      if (this.autoResponseState === 'pristine') {
        if (isNightTime) {
          timeout = 1000;
          message = `(Auto message) It's night time right now and we're probably asleep, please leave your email so we can contact you later, or fill out the <a href="https://leavemealone.com/feedback" target="_">form here</a>.`;
        } else {
          timeout = 60 * 1000 * 2;
          message = `(Auto message) We're not around right now, please leave your email so we can contact you later, or fill out the <a href="https://leavemealone.com/feedback" target="_">form here</a>).`;
        }
        this.autoResponseTimer = setTimeout(() => {
          this.writeToMessages({
            text: message,
            from: 'admin'
          });
          this.autoResponseState = 'canceled';
        }, timeout); // 2 MINUTES
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
    msg.time = new Date();
    const prevMessage = this.state.messages[this.state.messages.length - 1];
    if (
      prevMessage &&
      msg.text === prevMessage.text &&
      msg.from === prevMessage.from
    ) {
      // ignore duplicate msg
      return;
    }
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
        store.set(this.messagesKey, []);
      }
    }
  };
}
