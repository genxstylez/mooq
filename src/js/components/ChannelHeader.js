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
            channel: ChannelStore.get_joinedChannel(this.props.channel_id)
        }
    },

    componentWillReceiveProps(nextProps) {
        this.setState({
            channel: ChannelStore.get_joinedChannel(nextProps.channel_id)
        })
    },

    handleHereNow() {
        let dimmer = ReactDOM.findDOMNode(this.refs.dimmer);
        $(dimmer).dimmer('show');
    },

    render() {
        if (this.state.channel != undefined)
            return (
                <div id="header">
                    <div className="ui dimmer" ref="dimmer">
                        <div className="content">
                            <div className="center">
                                <div className="ui horizontal inverted list">
                                    {_.map(this.state.channel.users, (username) => {
                                        return (
                                            <div key={username} className="item">
                                                <div className="content">
                                                    <div className="header">{username}</div>
                                                </div>
                                            </div>
                                        )
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
                            <h2 className="ui header">{this.state.channel.name}</h2>
                        </div>
                        <div className="right menu">
                            <div className="item here_now" onClick={this.handleHereNow}>
                                <i className="users icon"></i>{this.state.channel.occupancy}
                            </div>
                        </div>
                    </div>
                </div>
            )
        else
            return (
                <div className="ui top fixed menu channel-header">
                    <div className="icon item mobile-menu">
                        <i className="content icon"></i>
                    </div>
                    <div className="item channel-name">
                        <h2 className="ui header"></h2>
                    </div>
                    <div className="right menu">
                        <div className="item here_now">
                            <i className="users icon"></i>0
                        </div>
                    </div>
                </div>
                )
    }
});










