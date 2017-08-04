import dateFormat from 'dateformat'
import { h, Component } from 'preact';

const dayInMillis = 60 * 60 * 24 * 1000;

export default class MessageArea extends Component {
    scrollToBottom = () => {
        console.log('scrolling down');
        const messageArea = document.getElementById('messageArea');
        console.log('height values are ::',messageArea.scrollTop , messageArea.scrollHeight);
        messageArea.scrollTop = messageArea.scrollHeight;
    };

    componentDidMount() {
        console.log('message area mount');
        this.scrollToBottom();
    }

    componentDidUpdate() {
        console.log('message area update');
        this.scrollToBottom();
    }

    render(props,{}) {
        const currentTime = new Date();
        //TODO  60px because 57px is the size of the input field
        const styleChat = 'height:'+(props.conf.wrapperHeight-60)+'px;';
        const sorted_messages = Object.values(props.messages);
        sorted_messages.sort(function(msg1, msg2) {return (msg1.time > msg2.time) - (msg1.time < msg2.time);}) ;
        return (
            <ol class="chat" style={styleChat} >
                {sorted_messages.map(({name, text, from, time}) => {
                    //from is either 'visitor' or 'admin'
                    const msgTime = new Date(time);
                    return (
                        <li class={from}>
                            <div class="msg">
                                <p>{text}</p>
                                { (props.conf.displayMessageTime) ?
                                    <div class="time">
                                        {
                                            currentTime - msgTime < dayInMillis ?
                                                dateFormat(msgTime, "HH:MM") :
                                                dateFormat(msgTime, "m/d/yy HH:MM")
                                        }
                                    </div>
                                    :
                                    ''
                                }
                            </div>
                        </li>
                    );
                })}
            </ol>
        );
    }

}
