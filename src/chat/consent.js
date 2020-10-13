import { Component, h } from 'preact';
import { danielleImg, jamesImg } from './admin-images';

import MessageArea from './message-area';
import io from 'socket.io-client';

export default class Chat extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render({}, state) {
    return (
      <div className="consent-container">
        <p>
          For chat to work we need to store some cookies on your device, is this
          ok?
        </p>
        <button onClick={this.props.onAcceptConsent}>I accept</button>
      </div>
    );
  }
}
