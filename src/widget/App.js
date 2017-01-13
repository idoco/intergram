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


export default class App extends Component {

    state = {
        pristine: true,
        isChatOpen: false
    };

    render({},{}) {
        return (
            <div style={wrapperStyle}>

                {/*Title*/}
                <div style={titleStyle} onClick={this.onClick}>
                    {!this.state.isChatOpen ? "Click to chat with us!" : "Intergram"}
                </div>

                {/*Chat IFrame*/}
                <div style={{display: this.state.isChatOpen ? 'block' : 'none'}}>
                    {this.state.pristine ? null : <ChatFrame /> }
                </div>

            </div>
        );
    }

    onClick = () => {
        if (!window.intergramId) {
            console.error("To use Intergram you have to set an intergramId ");
            return;
        }

        this.setState({
            pristine: false,
            isChatOpen: !this.state.isChatOpen
        });

    };

}
