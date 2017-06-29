import { h, Component } from 'preact';

export default class ArrowIcon extends Component {

    render({isOpened},{}) {
        return (
            <div>
                {/* keyboard arrow up */}
                { (isOpened) ?
                    <svg style={{
                            marginRight: 15,
                            marginTop: 6,
                            verticalAlign: 'middle',
                        }}
                        fill="#FFFFFF" height="15" viewBox="0 0 15 15" width="15"
                        xmlns="http://www.w3.org/2000/svg">
                        <line x1="1" y1="15" 
                            x2="15" y2="1" 
                            stroke="white" 
                            stroke-width="1"/>
                        <line x1="1" y1="1" 
                            x2="15" y2="15" 
                            stroke="white" 
                            stroke-width="1"/>
                    </svg>
                    :
                    <svg style={{
                        marginRight: 15,
                        marginTop: 6,
                        verticalAlign: 'middle',
                    }}
                        fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.582 13.891c-0.272 0.268-0.709 0.268-0.979 0s-0.271-0.701 0-0.969l7.908-7.83c0.27-0.268 0.707-0.268 0.979 0l7.908 7.83c0.27 0.268 0.27 0.701 0 0.969s-0.709 0.268-0.978 0l-7.42-7.141-7.418 7.141z"></path>
                    </svg>
                    
                }
            </div>
        );
    }
}
