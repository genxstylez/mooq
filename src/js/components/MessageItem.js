import React from 'react';
import moment from 'moment';


moment.locale('en') // TODO: locale goes here

export default React.createClass({
    render() {
        return (
            <div className="comment">
                <a className="avatar">
                    <img src={this.props.message.avatar || STATIC_URL + 'img/avatar.png'} />
                </a>
                <div className="content">
                    <a className="author">
                        {this.props.message.uuid}
                    </a>
                    <div className="metadata">
                        {moment(this.props.message.timestamp).fromNow()}
                    </div>
                    <div className="text">
                        {this.props.message.text}
                    </div>
                </div>
            </div>
        );
    }
})
