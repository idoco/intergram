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

        const {conf, isMobile} = props;
        const border = {border: '1px solid ' + conf.mainColor};
        const background = {background: conf.mainColor};

        let wrapperStyle = {...border, ...desktopWrapperStyle};
        let titleStyle = desktopTitleStyle;
        if (isMobile) {
            if (state.isChatOpen) {
                wrapperStyle = mobileOpenWrapperStyle;
            } else {
                titleStyle = mobileTitleStyle;
                wrapperStyle = {...border, ...mobileClosedWrapperStyle};
            }
        }
        titleStyle = {...background, ...titleStyle};

        return (
            <div style={wrapperStyle}>

                {/*Title*/}
                { isMobile && !state.isChatOpen ?

                    <div style={titleStyle} onClick={this.onClick}>
                        <ChatIcon/>
                    </div>

                    :

                    <div style={titleStyle} onClick={this.onClick}>
                        <div>
                            {state.isChatOpen ? conf.titleOpen : conf.titleClosed}
                        </div>

                        <ArrowIcon isOpened={state.isChatOpen}/>
                    </div>
                }

                {/*Chat IFrame*/}
                <div style={{
                    display: state.isChatOpen ? 'block' : 'none',
                    height: isMobile ? '100%' : ''
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
