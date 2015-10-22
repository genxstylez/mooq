import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import ChannelStore from '../stores/ChannelStore';
import ChannelActions from '../actions/ChannelActions';
import classnames from 'classnames';

import request from 'superagent';


export default React.createClass({
    getInitialState() {
        return {
            active_channel: this.props.channel
        }
    },

    componentWillReceiveProps(nextProps) {
        if(nextProps.channel != this.state.channel)
            this.setState({
                active_channel: nextProps.channel
            })
    },

    handleHereNow() {
        let dimmer = ReactDOM.findDOMNode(this.refs.dimmer);
        $(dimmer).dimmer('show');
    },

    render() {
        return (
            <div id="header">
                <div className="ui dimmer" ref="dimmer">
                    <div className="content">
                        <div className="center">
                            <div className="ui horizontal inverted list">
                                {_.map(this.state.active_channel.users, (username) => {
                                    return (
                                        <div key={username} className="item">
                                            <div className="content">
                                                <div className="header">{username}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ui top fixed menu channel-header">
                    <div className="icon item mobile-menu">
                        <i className="content icon"></i>
                    </div>
                    <div className="item channel-name">
                        <h2 className="ui header">{this.state.active_channel.name}</h2>
                    </div>
                    {this.state.active_channel != '' ?
                    <div className="right menu">
                        <div className="item here_now" onClick={this.handleHereNow}>
                            <i className="users icon"></i>{this.state.active_channel.occupancy || 0}
                        </div>
                    </div>
                    : <span />
                    }
                </div>
            </div>
        );
    }
});










