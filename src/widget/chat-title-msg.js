import { h, Component } from 'preact';

export default class ChatTitleMsg extends Component {

    render({isOpened, conf},{}) {
        return (
            <div style={{position: 'relative', cursor: 'pointer'}} onClick={this.props.onClick}>
                <div 
                    className="desktop-closed-message"
                    style={{
                        background: conf.mainColor,
                        letterSpacing: '1px',
                        color: '#fff',
                        display: 'block',
                        position: 'absolute',
                        fontSize: '14px',
                        top: 0,
                        right: '130px',
                        marginTop: '23px',
                        borderRadius: '5px',
                        padding: '15px 20px',
                        boxShadow: '#8e8d8d -3px 2px 20px',
                    }}
                >
                    {conf.introMessage}
                    <div
                        style={{
                            width: 0,
                            height: 0, 
                            position: 'absolute',
                            top: '12px',
                            right: '-10px',
                            borderTop: '10px solid transparent',
                            borderBottom: '10px solid transparent',
                            borderLeft: '10px solid '+conf.mainColor
                        }}
                    />
                </div>
                <div 
                    className="desktop-closed-message-avatar"
                    style={{
                        background: '#fff',
                        display: 'block',
                        position: 'absolute',
                        top: '10px',
                        right: '40px',
                        height: '60px',
                        width: '60px',
                        borderRadius: '999px',
                        boxShadow: '#8e8d8d -3px 2px 20px',
                        border: '2px solid '+conf.mainColor
                    }}
                >
                    {(conf.closedChatAvatarUrl === '') ?
                        <svg style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: '999px'
                            }}
                            fill="#000000" height="24" viewBox="0 0 24 24" width="24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21.859c0 2.281-1.5 4.141-3.328 4.141h-13.344c-1.828 0-3.328-1.859-3.328-4.141 0-4.109 1.016-8.859 5.109-8.859 1.266 1.234 2.984 2 4.891 2s3.625-0.766 4.891-2c4.094 0 5.109 4.75 5.109 8.859zM16 8c0 3.313-2.688 6-6 6s-6-2.688-6-6 2.688-6 6-6 6 2.688 6 6z"></path>
                        </svg>
                        :
                        <img 
                            src={conf.closedChatAvatarUrl} 
                            alt="Avatar"
                            style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: '999px'
                            }}
                        />
                    }
                    <div
                        style={{
                            background: '#d0021b',
                            width: '20px',
                            height: '20px',
                            borderRadius: '999px',
                            position: 'absolute',
                            right: '-5px',
                            bottom: '-5px',
                            textAlign: 'center',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.8em',
                            lineHeight: '20px'
                        }}
                    >
                        1
                    </div>
                </div>
            </div>
        );
    }
}
