import { h, Component } from 'preact';
import {mobileTitleStyle} from "./style";

export default class ChatFloatingButton extends Component {

    render({color, textColor, onClick},{}) {
        return (
            <div
                style={{background: color, color: textColor, ...mobileTitleStyle}}
                onClick={onClick}>

                <svg style={{paddingTop: 4}} height="24" viewBox="0 0 24 24" width="24"
                     fill={textColor}
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                </svg>

            </div>
        );
    }
}
