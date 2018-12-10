import dateFormat from 'dateformat'
import { h, Component } from 'preact';

const dayInMillis = 60 * 60 * 24 * 1000;

export default class MessageArea extends Component {
    scrollToBottom() {
        this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }

    focus() {
        this.chat.focus();
    }

    componentDidMount() {
        this.scrollToBottom();
        this.focus();
    }

    componentDidUpdate() {
        this.scrollToBottom();
        this.focus();
    }

    render(props,{}) {
        const currentTime = new Date();
        return (
            <div class="chat" ref={(el) => {this.chat = el;}}>
                {props.messages.map(({name, text, from, time}) => {
                    return (
                        <div class={'chat-message ' + from}>
                            <div class="msg">
                                <p>{text.split('\n').map((item, key) => <span key={key}>{item}<br/></span>)}</p>
                                { (props.conf.displayMessageTime) ?
                                    <div class="time">
                                        {
                                            currentTime - new Date(time) < dayInMillis ?
                                                dateFormat(time, "HH:MM") :
                                                dateFormat(time, "m/d/yy HH:MM")
                                        }
                                    </div> 
                                    :
                                    ''
                                }
                            </div>
                        </div>
                    );
                })}
                <div ref={(el) => {this.messagesEnd = el;}}/>
            </div>
        );
    }

}
