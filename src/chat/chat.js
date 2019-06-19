import * as store from 'store';

import { Component, h } from 'preact';
import { danielleImg, jamesImg } from './admin-images';

import MessageArea from './message-area';
import io from 'socket.io-client';

export default class Chat extends Component {
  autoResponseState = 'pristine'; // pristine, set or canceled
  autoResponseTimer = 0;

  constructor(props) {
    super(props);
    if (store.enabled) {
      this.messagesKey = `messages.${props.chatId}.${props.host}.${
        props.userId
      }`;
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
      <div class="chat-container">
        <div class="chat-header">
          <h5>Questions? Problems? Chat with us!</h5>
          <p>
            If we're awake then we'll typically respond to your message within a
            few minutes.
          </p>
          <div class="admin-images">
            <img src={danielleImg} alt="danielle-img" />
            <img src={jamesImg} alt="james-img" />
          </div>
        </div>
        <MessageArea messages={state.messages} conf={this.props.conf} />

        <input
          class="textarea"
          type="text"
          placeholder={this.props.conf.placeholderText}
          ref={input => {
            this.input = input;
          }}
          onKeyPress={this.handleKeyPress}
        />

        {/* <a
          class="banner"
          href="https://github.com/idoco/intergram"
          target="_blank"
        >
          Powered by <b>Intergram</b>&nbsp;
        </a> */}
      </div>
    );
  }

  handleKeyPress = e => {
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
        this.autoResponseTimer = setTimeout(() => {
          // this.writeToMessages({
          //   text: this.props.conf.autoNoResponse,
          //   from: 'admin'
          // })
          this.autoResponseState = 'canceled';
        }, 60 * 1000 * 3);
        this.autoResponseState = 'set';
      }
    }
  };

  incomingMessage = msg => {
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

  writeToMessages = msg => {
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
        store.transact(this.messagesKey, function(messages) {
          messages.push(msg);
        });
      } catch (e) {
        console.log('failed to add new message to local storage', e);
        store.set(this.messagesKey, []);
      }
    }
  };
}
