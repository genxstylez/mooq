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
import SetIntervalMixin from '../mixins/SetIntervalMixin';

import UserStore from '../stores/UserStore';

export default React.createClass({
    mixins: [SetIntervalMixin],

    getInitialState() {
        return {
            channels: ChannelStore.channels
        }
    },

    componentDidMount() {
        $(ReactDOM.findDOMNode(this.refs.sidebar)).sidebar({
            context: $('#main')
        }).sidebar('attach events', '.mobile-menu');

        this.setInterval(ChannelActions.get_here_now, 10000, true);
    },

    componentWillMount() {
        var channel_id = this.props.params.channelId || ChannelStore.channels[0].id;
        ChannelActions.mark_as_active(channel_id);

        this.setState({
            active_channel: ChannelStore.active_channel
        });

    },

    componentWillUnmount() {
        pubnub.unsubscribe({
            channel: UserStore.user.channels
        });
    },

    componentWillReceiveProps(nextProps) {
        if(nextProps.params.channelId) {
            this.setState({
                active_channel: ChannelStore.get_channel(nextProps.params.channelId)
            });
            ChannelActions.mark_as_active(nextProps.params.channelId);
        }
        $(ReactDOM.findDOMNode(this.refs.sidebar)).sidebar('hide');
    },

    render() {
        return (
            <div id="main">
                <div className="ui sidebar vertical left inline grid menu profile-menu" ref="sidebar">
                    <Avatar />
                    <div className="ui list">
                        <h5 className="ui header">Top 5 Stocks</h5>
                        <ChannelNav name="top 1" />
                        <ChannelNav name="top 2" />
                        <ChannelNav name="top 3" />
                        <ChannelNav name="top 4" />
                        <ChannelNav name="top 5" />
                    </div>
                    <ChannelList  />
                </div>
                <div className="full height pusher">
                    <div id="profile-container">
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
                            <ChannelList  />
                        </div>
                    </div>
                    <div id="messages-container">
                        {this.state.channels.map((channel) => {
                            return (<ChannelItem key={channel.id}
                                id={channel.id}
                                name={channel.name}
                                occupancy={channel.occupancy}
                                users={channel.users}
                                messages={channel.messages}
                                is_active={this.state.active_channel.id == channel.id} />);
                        })}
                    </div>
                </div>
            </div>
        );
    }
});