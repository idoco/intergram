import { h, Component } from 'preact';

export default class ChatFrame extends Component {

    shouldComponentUpdate() {
        // do not re-render via diff:
        return false;
    }

    render(props, state) {
        const { intergramId, host, iFrameSrc, isMobile, conf, CustomData } = props;

        let dynamicConf = window.intergramOnOpen || {}; // these configuration are loaded when the chat frame is opened
        let encodedConf = encodeURIComponent(JSON.stringify({ ...conf, ...dynamicConf }));
        let encodedCustomData = encodeURIComponent(JSON.stringify(CustomData));
        return (
            <iframe src={iFrameSrc +
                '?id=' + intergramId +
                '&host=' + host +
                '&conf=' + encodedConf +
                '&CustomData=' + encodedCustomData
            }
                frameborder='0'
                style={{
                    flex: '1',
                    width: '100%',
                    height: 0,
                }}>
            </iframe>
        );
    }
}
