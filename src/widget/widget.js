import { h, Component } from 'preact';
import ChatFrame from './chat-frame';
import ChatFloatingButton from './chat-floating-button';
import ArrowIcon from './arrow-icon';
import {
    desktopTitleStyle, desktopWrapperStyle,
    mobileOpenWrapperStyle, mobileClosedWrapperStyle
} from "./style";

export default class Widget extends Component {

    constructor() {
        super();
        this.state.isChatOpen = false;
        this.state.pristine = true;
    }

    render({conf, isMobile}, {isChatOpen, pristine}) {

        const border = {border: '1px solid ' + conf.mainColor};

        let wrapperStyle;
        if (!isChatOpen && (isMobile || conf.alwaysUseFloatingButton)) {
            wrapperStyle = {...border, ...mobileClosedWrapperStyle}; // closed mobile floating button
        } else if (!isMobile){
            wrapperStyle = {...border, ...desktopWrapperStyle}; // desktop mode
        } else {
            wrapperStyle = mobileOpenWrapperStyle; // open mobile wrapper should have no border
        }

        return (
            <div style={wrapperStyle}>

                {/* Open/close button */}
                { (isMobile || conf.alwaysUseFloatingButton) && !isChatOpen ?

                    <ChatFloatingButton color={conf.mainColor} onClick={this.onClick}/>

                    :

                    <div style={{background: conf.mainColor, ...desktopTitleStyle}} onClick={this.onClick}>
                        <div>
                            {isChatOpen ? conf.titleOpen : conf.titleClosed}
                        </div>

                        <ArrowIcon isOpened={isChatOpen}/>
                    </div>
                }

                {/*Chat IFrame*/}
                <div style={{
                    display: isChatOpen ? 'block' : 'none',
                    height: isMobile ? '100%' : ''
                }}>
                    {pristine ? null : <ChatFrame {...this.props} /> }
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
