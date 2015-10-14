import React from 'react';
import moment from 'moment';


moment.locale('en') // TODO: locale goes here

export default React.createClass({
    render() {
        return (
            <div className="event">
                <div className="label">
                    <img src="http://semantic-ui.com/images/avatar/small/elliot.jpg" />
                </div>
                <div className="content">
                    <div className="summary">
                        <a className="user">
                            {this.props.message.username}
                        </a> {this.props.message.text}
                        <div className="date">
                            {moment(this.props.message.timestamp).fromNow()}
                        </div>
                    </div>
                    <div className="meta">
                        <a className="like">
                            <i className="like icon"></i> 4 Likes
                        </a>
                    </div>
                </div>
            </div>
        );
    }
})