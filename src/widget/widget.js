import { h, Component } from 'preact';
import ChatFrame from './chat-frame';
import ArrowIcon from './arrow-icon';
import ChatIcon from './chat-icon';
import {
    desktopTitleStyle, desktopWrapperStyle,
    mobileTitleStyle, mobileOpenWrapperStyle, mobileClosedWrapperStyle
} from "./style";

export default class Widget extends Component {

    constructor() {
        super();
        this.state.isChatOpen = false;
        this.state.pristine = true;
    }

    render(props, state) {

        let wrapperStyle = desktopWrapperStyle;
        if (props.isMobile) {
            if (state.isChatOpen) {
                wrapperStyle = mobileOpenWrapperStyle;
            } else {
                wrapperStyle = mobileClosedWrapperStyle;
            }
        }

        return (
            <div style={wrapperStyle}>

                {/*Title*/}
                { props.isMobile && !state.isChatOpen ?

                    <div style={mobileTitleStyle} onClick={this.onClick}>
                        <ChatIcon/>
                    </div>

                    :

                    <div style={desktopTitleStyle} onClick={this.onClick}>
                        <div>
                            {!state.isChatOpen ? props.conf.titleOpen : props.conf.titleClosed}
                        </div>

                        <ArrowIcon isOpened={state.isChatOpen}/>
                    </div>
                }

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
