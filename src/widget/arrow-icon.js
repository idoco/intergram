import { h, Component } from 'preact';

export default class ArrowIcon extends Component {

    render({isOpened},{}) {
        return (
            <div>
                {/* keyboard arrow up */}
                <svg style={{
                    marginRight: 4,
                    verticalAlign: 'middle',
                    transform: isOpened ? 'rotate(180deg)' : ''
                }}
                     fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                </svg>
            </div>
        );
    }
}
