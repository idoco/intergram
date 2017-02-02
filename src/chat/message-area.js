import { h, Component } from 'preact';

export default class MessageArea extends Component {

    render(props,{}) {
        return (
            <ol class="chat">
                {props.messages.map(({name, text, from}) => {
                    if (from === 'visitor') {
                        name = "You";
                    }

                    return (
                        <li class={from}>
                            <div class="msg">
                                {name ? name + ': ' + text : text}
                            </div>
                        </li>
                    );
                })}
            </ol>
        );
    }

}
