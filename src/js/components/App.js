import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { History } from 'react-router';
import ChannelNav from './ChannelNav';
import ChannelList from './ChannelList';
import ChannelHeader from './ChannelHeader';
import ChannelItem from './ChannelItem';
import ChannelStore from '../stores/ChannelStore';
import ChannelActions from '../actions/ChannelActions';
import ChannelService from '../services/ChannelService';
import SidebarChannelList from './SidebarChannelList';
import MessageInput from './MessageInput';
import Avatar from './Avatar';
import SetIntervalMixin from '../mixins/SetIntervalMixin';

import UserStore from '../stores/UserStore';

export default React.createClass({
    mixins: [SetIntervalMixin, History],

    getInitialState() {
        return {
            channels: ChannelStore.channels,
            active_channel: ChannelStore.active_channel,
            prompt_to_join: false,
            user: UserStore.user,
            is_authenticated: UserStore.is_authenticated
        }
    },

    componentDidMount() {
        $(ReactDOM.findDOMNode(this.refs.sidebar)).sidebar({
            context: $('#main')
        }).sidebar('attach events', '.mobile-menu');

        ChannelStore.addChangeListener(this._onChange);
        UserStore.addChangeListener(this._onUserChange);
        this.setInterval(ChannelService.get_here_now, 10000, true);
    },

    componentWillUnmount() {
        pubnub.unsubscribe({
            channel: UserStore.user.channels
        });

        ChannelStore.removeChangeListener(this._onChange);
        UserStore.removeChangeListener(this._onUserChange);
    },

    componentWillMount() {
        if(!this.props.params.channelId) {
            if(this.state.is_authenticated) {
                ChannelService.join_channels(this.state.user.channels)
                this.history.pushState(null, `/channels/${this.state.user.channels[0].id}/`)
           } else {
                // render a join a channel page.
                this.setState({
                    prompt_to_join: true
                });
            }
        } else {
            this.join_channel(this.props.params.channelId);
        }
    },

    componentWillReceiveProps(nextProps) {
        if(nextProps.params.channelId != this.props.params.channelId) {
            this.join_channel(nextProps.params.channelId);
        }
        $(ReactDOM.findDOMNode(this.refs.sidebar)).sidebar('hide');
    },

    componentDidUpdate(prevProps, prevState) {
        if(this.state.is_authenticated != prevState.is_authenticated) {
            // means a state change in authentication
            if(this.state.is_authenticated) {
                ChannelService.join_channels(this.state.user.channels)
                this.history.pushState(null, `/channels/${this.state.user.channels[0].id}/`)

            } else {
                // logout here
            }
        }
    },

    join_channel(id) {
        var channel = ChannelStore.get_channel(id);
        if(!channel) {
            // If channel not found, get complete channel info from server
            let onSuccess = (channel) => {
                ChannelService.join_channels([channel])
                ChannelActions.mark_as_active(channel.id);
            }
            let onError = () => {
                alert('Something went wrong!');
            }
            ChannelService.get_channel_info(id, onSuccess, onError);
        } else {
            // if channel exists in store, means we already joined, just mark it as active
            ChannelActions.mark_as_active(channel.id);
        }
        this.setState({
            prompt_to_join: false
        });
    },

    _onUserChange() {
        this.setState({
            user: UserStore.user,
            is_authenticated: UserStore.is_authenticated
        });
    },

    _onChange() {
        this.setState({
            active_channel: ChannelStore.active_channel,
            channels: ChannelStore.channels
        })
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
                        <ChannelHeader />
                        {_.map(this.state.channels, (channel) => {
                        return (<ChannelItem key={channel.id}
                            id={channel.id}
                            name={channel.name}
                            occupancy={channel.occupancy}
                            users={channel.users}
                            messages={channel.messages}
                            is_active={this.state.active_channel.id == channel.id} />);
                        })}
                        {this.state.prompt_to_join ?
                            <div className="ui active dimmer">
                                <div className="content">
                                    <div className="center">
                                        <h2>Join a channel!</h2>
                                    </div>
                                </div>
                            </div>
                            : null
                        }
                    </div>
                </div>
            </div>
        );
    }
});