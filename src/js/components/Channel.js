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
import FacebookOAuthMixin from '../mixins/FacebookOAuthMixin'

import UserStore from '../stores/UserStore';

export default React.createClass({
    mixins: [SetIntervalMixin, History, FacebookOAuthMixin],

    getInitialState() {
        return {
            channels: ChannelStore.channels,
            active_channel: ChannelStore.active_channel,
            prompt_to_join: false,
            user: UserStore.user,
            authKey: UserStore.authKey,
            is_authenticated: UserStore.is_authenticated,
        }
    },

    componentDidMount() {
        window.pubnub = PUBNUB.init({
            publish_key: 'pub-c-b0729086-9a78-4ebc-b04f-f87bd208d0fe',
            subscribe_key: 'sub-c-4daa87ec-5f9d-11e5-bc11-0619f8945a4f',
            uuid: this.state.user.username,
            auth_key: this.state.authKey
        })


        $(ReactDOM.findDOMNode(this.refs.sidebar)).sidebar({
            context: $('#main')
        }).sidebar('attach events', '.mobile-menu');

        ChannelStore.addChangeListener(this._onChange);
    },

    componentWillUnmount() {
        ChannelStore.removeChangeListener(this._onChange);
    },

    componentWillMount() {
        if (this.state.is_authenticated) {
            // Get channel list and join them
            ChannelService.get_subscribed_channels(this.state.user.user_id)
            .then((res) => {
                let channels = res.body
                if (channels.length > 0) {
                    ChannelService.grant(this.state.authKey, channels)
                    .then(() => {
                        ChannelService.join_channels(channels)
                        if (!this.props.params.channelId) {
                            // if no channel Id is provided, go to the first channel of the list
                            this.history.replaceState(null, '/channels/' + channels[0].id + '/')
                        } else {
                            ChannelActions.mark_as_active(this.props.params.channelId)
                        }
                    })

                } else {
                    history.replaceState(null, 'join-channel')
                }
            })
        } else {
            if (this.props.params.channelId)
                this.handleGuestSession(this.props.params.channelId)
            else
                history.pushState(null, 'join-channel')
        }

    },

    componentWillReceiveProps(nextProps) {
        if(nextProps.params.channelId != this.props.params.channelId) {
            let id = nextProps.params.channelId
            if (this.state.is_authenticated)
                ChannelActions.mark_as_active(id)
            else
                this.handleGuestSession(id)
        }
        $(ReactDOM.findDOMNode(this.refs.sidebar)).sidebar('hide')
    },

    handleGuestSession(id) {
        ChannelService.async_get_channel_info(id)
            .then((res) => {
                // res.body is a channel object
                let channel = res.body
                ChannelService.grant(this.state.authKey, [channel])
                .then(() => {
                    ChannelService.join_channels([channel])
                    ChannelActions.mark_as_active(channel.id)
                    this.setState({
                        prompt_to_join: false
                    });
                })

            }, (err) => {
                alert('Something went wrong');
            })
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
                    <Avatar is_authenticated={this.state.is_authenticated} username={this.state.user.username} />
                    <div className="ui list">
                        <h5 className="ui header">Top 5 Stocks</h5>
                        <ChannelNav name="top 1" />
                        <ChannelNav name="top 2" />
                        <ChannelNav name="top 3" />
                        <ChannelNav name="top 4" />
                        <ChannelNav name="top 5" />
                    </div>
                    <ChannelList />
                </div>
                <div className="full height pusher">
                    <div className="icon item mobile-menu">
                        <i className="content icon"></i>
                    </div>
                    <div id="profile-container">
                        <div id="profile-menu" className="ui vertical menu grid profile-menu">
                            <div className="logo">
                                APPSE
                            </div>
                            <Avatar is_authenticated={this.state.is_authenticated} username={this.state.user.username} />
                            <div className="ui list">
                                <h5 className="ui header">Top 5 Stocks</h5>
                                <ChannelNav name="top 1" />
                                <ChannelNav name="top 2" />
                                <ChannelNav name="top 3" />
                                <ChannelNav name="top 4" />
                                <ChannelNav name="top 5" />
                            </div>
                            <ChannelList />
                        </div>
                    </div>
                    <div id="messages-container">
                        <ChannelHeader />
                        {_.map(this.state.channels, (channel) => {
                        return (<ChannelItem key={channel.id}
                            channel_id={channel.id}
                            name={channel.name}
                            messages={channel.messages}
                            occupancy={chyannel.occupancy}
                            users={channel.users}
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