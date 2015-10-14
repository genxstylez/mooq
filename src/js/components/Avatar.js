import React from 'react';

export default React.createClass({
    render() {
        return (
                <div id="avatar">
                    <span className="username overflow_ellipsis">Username</span>
                    <i className="chevron down icon"></i>
                </div>
            )
    }
})