import React from 'react';

export default React.createClass({
    render() {
        return (
            <div className="ui grid equal height padded">
                <div id="channels" className="three wide computer only five wide tablet only column purple">
                    <div>chatroom list</div>
                </div>
                <div id="messages_container" className="red thirteen wide computer eleven wide tablet sixteen wide mobile column">
                    chatroom content
                </div>
            </div>
        );
    }
});