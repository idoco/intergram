import { h, Component } from 'preact';
import ChatFrame from './chat-frame';
import ArrowIcon from './arrow-icon';
import {titleStyle, wrapperStyle, mobileOpenWrapperStyle} from "./style";

export default class Widget extends Component {

    constructor() {
        super();
        this.state.isChatOpen = false;
        this.state.pristine = true;
    }

    render(props, state) {

        return (
            <div style={state.isChatOpen && props.isMobile ? mobileOpenWrapperStyle : wrapperStyle}>

                {/*Title*/}
                <div style={titleStyle} onClick={this.onClick}>
                    <div>
                        {!state.isChatOpen ? 'Click to chat!' : 'Let\'s chat!'}
                    </div>

                    <ArrowIcon isOpened={state.isChatOpen}/>
                </div>

                {/*Chat IFrame*/}
                <div style={{
                    display: state.isChatOpen ? 'block' : 'none',
                    height: props.isMobile ? '100%' : ''
                }}>
                    {state.pristine ? null : <ChatFrame {...props} /> }
                </div>

            </div>
        );
    }

    onClick = () =>
        this.setState({
            pristine: false,
            isChatOpen: !this.state.isChatOpen
        });

}
