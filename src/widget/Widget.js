import { h, Component } from 'preact';
import ChatFrame from './ChatFrame';

const wrapperStyle = {
    position: 'fixed',
    bottom: '0px',
    right: '4px',
    zIndex: 2147483647,
    borderRadius: '5px',
    border: '1px solid rgba(82,179,217,0.9)',
    width: '300px',
    background: 'rgb(229, 229, 229)'
};

const titleStyle = {
    height: '30px',
    lineHeight: '30px',
    fontSize: '20px',
    paddingLeft: '10px',
    fontFamily: 'Lato, sans-serif',
    background: 'rgba(82,179,217,0.9)',
    color: '#fff',
    cursor: 'pointer'
};


export default class Widget extends Component {

    constructor() {
        super();
        this.state.isChatOpen = false;
        this.state.pristine = true;
    }

    render(props,state) {
        return (
            <div style={wrapperStyle}>

                {/*Title*/}
                <div style={titleStyle} onClick={this.onClick}>
                    {!state.isChatOpen ? "Click to chat!" : "Let's chat!"}
                </div>

                {/*Chat IFrame*/}
                <div style={{display: state.isChatOpen ? 'block' : 'none'}}>
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
