import { h, Component } from 'preact';
import MessageArea from './MessageArea';
import io from 'socket.io-client'

export default class Chat extends Component {

    state = {
        messages: [{
            from: 'other',
            text: 'Hello! How can we help you?'
        }]
    };

    socket = null;

    componentDidMount() {
        this.socket = io.connect('https://intergram.herokuapp.com');
        this.socket.emit('register', {chatId: this.props.chatId, userId: this.props.userId });
        this.socket.on(this.props.chatId, this.incomingMessage);
        this.socket.on(this.props.chatId+"-"+this.props.userId, this.incomingMessage);
    }

    render({},{}) {
        return (
            <div>

                <MessageArea messages={this.state.messages} />

                <input class="textarea" type="text" placeholder="Type here!"
                       ref={(input) => { this.input = input }}
                       onKeyPress={this.handleKeyPress}/>
            </div>
        );
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            let text = this.input.value;
            this.writeToMessages('You: '+text, 'self');
            this.socket.send(text);
            this.input.value = '';
        }
    };

    incomingMessage = (msg) => {
        this.writeToMessages(msg, 'other');
        document.getElementById('messageSound').play();
    };

    writeToMessages = (text, from) => {
        this.setState({
            message: this.state.messages.push({
                from: from,
                text: text
            })
        });
        window.scrollTo(0,document.body.scrollHeight)
    }
}
