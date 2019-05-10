import { Component, h } from 'preact';
import { danielleImg, jamesImg } from './admin-images';

import dateFormat from 'dateformat';

const dayInMillis = 60 * 60 * 24 * 1000;

const admins = {
  james: jamesImg,
  danielle: danielleImg
};
export default class MessageArea extends Component {
  componentDidMount() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  componentDidUpdate() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  render(props, {}) {
    const currentTime = new Date();
    return (
      <ol class="chat">
        {props.messages.map(({ name, text, from, time, adminName }) => {
          const isAdmin = from !== 'visitor';
          return (
            <li class={isAdmin ? 'admin' : 'visitor'}>
              {admins[adminName] ? (
                <div class="msg-image">
                  <img src={admins[adminName]} alt="admin-image" />
                </div>
              ) : null}

              <div class="msg">
                <p>{text}</p>
                {props.conf.displayMessageTime ? (
                  <div class="time">
                    {currentTime - new Date(time) < dayInMillis
                      ? dateFormat(time, 'HH:MM')
                      : dateFormat(time, 'm/d/yy HH:MM')}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </li>
          );
        })}
      </ol>
    );
  }
}
