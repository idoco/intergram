import { Component, h } from "preact";
import { danielleImg, jamesImg } from "./admin-images";

import MarkdownIt from "markdown-it";
import dateFormat from "dateformat";

const md = new MarkdownIt();
const dayInMillis = 60 * 60 * 24 * 1000;

const admins = {
  jivings: jamesImg,
  dinkydani: danielleImg
};
export default class MessageArea extends Component {
  componentDidMount() {
    this.ref.scrollTo(0, this.ref.scrollHeight);
  }

  componentDidUpdate() {
    this.ref.scrollTo(0, this.ref.scrollHeight);
  }

  render(props, {}) {
    const currentTime = new Date();
    return (
      <ol
        class="chat"
        ref={r => {
          this.ref = r;
        }}
      >
        {props.messages.map(({ name, text, from, time, adminName }) => {
          const renderedMsg = md.render(text);
          console.log(renderedMsg);
          const isAdmin = from !== "visitor";
          return (
            <li class={isAdmin ? "admin" : "visitor"}>
              {admins[adminName] ? (
                <div class="msg-image">
                  <img src={admins[adminName]} alt="admin-image" />
                </div>
              ) : null}

              <div class="msg">
                <div dangerouslySetInnerHTML={{ __html: renderedMsg }} />
                {props.conf.displayMessageTime ? (
                  <div class="time">
                    {currentTime - new Date(time) < dayInMillis
                      ? dateFormat(time, "HH:MM")
                      : dateFormat(time, "m/d/yy HH:MM")}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </li>
          );
        })}
      </ol>
    );
  }
}
