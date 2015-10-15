import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

export default React.createClass({
    render() {
        let cls = classnames({
            'unread': this.props.unread,
            'item': true
        })
        return (
            <Link activeClassName="active" className={cls} to={`/channels/${this.props.id}/`}>
                {this.props.name}
            </Link>
        )
    }
});