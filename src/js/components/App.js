import React from 'react';
import ReactDOM from 'react-dom';
import ChannelNav from './ChannelNav';
import ChannelList from './ChannelList';
import ChannelItem from './ChannelItem';
import ChannelStore from '../stores/ChannelStore';
import ChannelActions from '../actions/ChannelActions';
import SidebarChannelList from './SidebarChannelList';
import MessageInput from './MessageInput';
import Avatar from './Avatar';


export default React.createClass({
    getInitialState() {
        return {
            channels: ChannelStore.channels
        }
    },

    componentWillMount() {
        var channel_id = this.props.params.channelId || ChannelStore.channels[0].id;
        ChannelActions.mark_as_active(channel_id);

        this.setState({
            active_channel: ChannelStore.active_channel
        });
    },

    componentWillReceiveProps(nextProps) {
        if(nextProps.params.channelId) {
            this.setState({
                active_channel: ChannelStore.get_channel(nextProps.params.channelId)
            });
            ChannelActions.mark_as_active(nextProps.params.channelId);
        }

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
                            id={channel.id}
                            is_active={this.state.active_channel.id == channel.id} />);
                    })}
                </div>
            </div>
        );
    }
});