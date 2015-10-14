import React from 'react';
import ReactDOM from 'react-dom';
import ChannelItem from './ChannelItem';
import ChannelList from './ChannelList';
import ChannelService from '../services/ChannelService';
import ChannelStore from '../stores/ChannelStore';
import SidebarChannelList from './SidebarChannelList';
import Avatar from './Avatar';
import ActiveChannel from './ActiveChannel';

let user_channels = [{id: 'test_channel', name: '1101 台泥'}, {id: 'test_channel1', name: 'APPL'}];

export default React.createClass({
    componentWillMount() {
        // Subscribing channels.
        ChannelService.join_subscribed(user_channels);
        var channel = {};
        if(this.props.params.channelId) {
            channel = ChannelStore.get_channel(this.props.params.channelId)[0]
        }
        else
            channel = user_channels[0]
        this.setState({
            active_channel: channel
        });
    },

    componentWillReceiveProps(nextProps) {
        if(nextProps.params.channelId)
            this.setState({
                active_channel: ChannelStore.get_channel(nextProps.params.channelId)[0]
            });
    },

    componentDidUpdate() {

    },


    ClickMobileMenu() {
       let sidebar = ReactDOM.findDOMNode(this.refs.sidebar)
       $(sidebar).sidebar('toggle');
    },

    render() {
        return (
            <div className="full height">
                <div id="profile-container">
                    <div className="ui sidebar vertical grid menu profile-menu" ref="sidebar">
                        <Avatar />
                        <div className="ui list">
                            <h5 className="ui header">Top 5 Stocks</h5>
                            <ChannelItem name="top 1" />
                            <ChannelItem name="top 2" />
                            <ChannelItem name="top 3" />
                            <ChannelItem name="top 4" />
                            <ChannelItem name="top 5" />
                        </div>
                        <SidebarChannelList channels={user_channels} />
                    </div>
                    <div id="profile-menu" className="ui vertical menu grid profile-menu">
                        <Avatar />
                        <div className="ui list">
                            <h5 className="ui header">Top 5 Stocks</h5>
                            <ChannelItem name="top 1" />
                            <ChannelItem name="top 2" />
                            <ChannelItem name="top 3" />
                            <ChannelItem name="top 4" />
                            <ChannelItem name="top 5" />
                        </div>
                        <ChannelList channels={user_channels} />
                    </div>
                </div>
                <div id="messages-container">
                    <div className="ui top fixed menu">
                        <a className="icon item" id="mobile-menu" onClick={this.ClickMobileMenu}>
                            <i className="content icon"></i>
                        </a>
                        <div className="item">
                            <h2 className="ui header">#{this.state.active_channel.name}</h2>
                        </div>
                        <div className="right menu">
                            <div className="item">
                                <i className="users icon"></i>10
                            </div>
                        </div>
                    </div>
                    <div id="footer">
                        <div className="ui form">
                            <div className="field">
                                <textarea rows="1" />
                            </div>
                        </div>
                    </div>
                    <ActiveChannel channel={this.state.active_channel} />
                </div>
            </div>
        );
    }
});