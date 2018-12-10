import { h, Component } from 'preact';
import ChatFrame from './chat-frame';
import ChatFloatingButton from './chat-floating-button';
import ChatTitleMsg from './chat-title-msg';
import ArrowIcon from './arrow-icon';
import {
    desktopTitleStyle,
    desktopWrapperStyle,
    mobileOpenWrapperStyle,
    mobileClosedWrapperStyle,
    desktopClosedWrapperStyleChat,
    titleStyle
} from "./style";

export default class Widget extends Component {

    constructor() {
        super();
        this.state.isChatOpen = false;
        this.state.pristine = true;
        this.state.wasChatOpened = this.wasChatOpened();
    }

    render({conf, isMobile}, {isChatOpen, pristine}) {

        const wrapperWidth = {width: conf.desktopWidth};
        const desktopHeight = (window.innerHeight - 100 < conf.desktopHeight) ? window.innerHeight : conf.desktopHeight;
        const wrapperHeight = {height: desktopHeight};

        return (
            <div>
                {/*CLOSED STATE*/}
                <div style={{display: isChatOpen ? 'none' : 'block'}}>
                    {(isMobile || conf.alwaysUseFloatingButton) ?
                        <div style={mobileClosedWrapperStyle}>
                            <ChatFloatingButton color={conf.mainColor} onClick={this.onClick}/>
                        </div>
                        :
                        (conf.closedStyle === 'chat' || this.wasChatOpened()) ?
                            <div style={desktopWrapperStyle}>
                                <div style={{background: conf.mainColor, ...desktopTitleStyle}} onClick={this.onClick}>
                                    <div style={titleStyle}>{conf.titleClosed}</div>
                                    <ArrowIcon isOpened={false}/>
                                </div>
                            </div>
                            :
                            <div style={desktopClosedWrapperStyleChat}>
                                <ChatTitleMsg onClick={this.onClick} conf={conf}/>
                            </div>
                    }
                </div>

                {/*OPENED STATE*/}
                <div style={{display: isChatOpen ? 'block' : 'none'}}>
                    <div style={isMobile ? mobileOpenWrapperStyle : {...desktopWrapperStyle, ...wrapperWidth, ...wrapperHeight}}>
                        <div style={{background: conf.mainColor, ...desktopTitleStyle}} onClick={this.onClick}>
                            <div style={titleStyle}>{conf.titleOpen}</div>
                            <ArrowIcon isOpened={true}/>
                        </div>
                        {pristine ? null : <ChatFrame {...this.props} />}
                    </div>
                </div>
            </div>
        );
    }

    onClick = () => {
        let stateData = {
            pristine: false,
            isChatOpen: !this.state.isChatOpen,
        }
        if(!this.state.isChatOpen && !this.wasChatOpened()){
            this.setCookie();
            stateData.wasChatOpened = true;
        }
        this.setState(stateData);
    }

    setCookie = () => {
        let date = new Date();
        let expirationTime = parseInt(this.props.conf.cookieExpiration);
        date.setTime(date.getTime()+(expirationTime*24*60*60*1000));
        let expires = "; expires="+date.toGMTString();
        document.cookie = "chatwasopened=1"+expires+"; path=/";
    }

    getCookie = () => {
        var nameEQ = "chatwasopened=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return false;
    }

    wasChatOpened = () => {
        return (this.getCookie() === false) ? false : true;
    }

}
