import React from 'react';
import ReactDOM from 'react-dom';
import ChannelNav from './ChannelNav';
import ChannelList from './ChannelList';
import ChannelItem from './ChannelItem';
import ChannelStore from '../stores/ChannelStore';
import SidebarChannelList from './SidebarChannelList';
import Avatar from './Avatar';
import ActiveChannel from './ActiveChannel';


export default React.createClass({
    getInitialState() {
        return {
            channels: ChannelStore.channels
        }
    },

    componentWillMount() {
        var channel = {};
        if(this.props.params.channelId) {
            channel = ChannelStore.get_channel(this.props.params.channelId)
        }
        else
            channel = ChannelStore.channels[0]
        this.setState({
            active_channel: channel
        });
    },

    componentWillReceiveProps(nextProps) {
        if(nextProps.params.channelId)
            this.setState({
                active_channel: ChannelStore.get_channel(nextProps.params.channelId)
            });
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
                            <ChannelNav name="top 1" />
                            <ChannelNav name="top 2" />
                            <ChannelNav name="top 3" />
                            <ChannelNav name="top 4" />
                            <ChannelNav name="top 5" />
                        </div>
                        <SidebarChannelList channels={this.state.channels} />
                    </div>
                    <div id="profile-menu" className="ui vertical menu grid profile-menu">
                        <Avatar />
                        <div className="ui list">
                            <h5 className="ui header">Top 5 Stocks</h5>
                            <ChannelNav name="top 1" />
                            <ChannelNav name="top 2" />
                            <ChannelNav name="top 3" />
                            <ChannelNav name="top 4" />
                            <ChannelNav name="top 5" />
                        </div>
                        <ChannelList channels={this.state.channels} />
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
                    {this.state.channels.map((channel) => {
                        return (<ChannelItem key={channel.id}
                            channel={channel}
                            is_active={this.state.active_channel.id == channel.id} />);
                    })}
                    <div id="footer">
                        <div className="ui form">
                            <div className="field">
                                <textarea rows="1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});