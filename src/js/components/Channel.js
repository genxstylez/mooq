import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { Link, History } from 'react-router';
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
            joinedChannels: ChannelStore.joinedChannels,
            channels: ChannelStore.channels,
            user: UserStore.user,
            authKey: UserStore.authKey,
            jwt: UserStore.jwt,
            is_authenticated: UserStore.is_authenticated,
        }
    },

    componentDidMount() {
        $(ReactDOM.findDOMNode(this.refs.sidebar)).sidebar({
            context: $('#main')
        }).sidebar('attach events', '.mobile-menu');

        ChannelStore.addChangeListener(this._onChange)
        UserStore.addChangeListener(this._onUserChange)
    },

    componentWillUnmount() {
        ChannelStore.removeChangeListener(this._onChange)
        UserStore.removeChangeListener(this._onUserChange)
    },

    componentWillMount() {
        if(this.state.is_authenticated)
            this._joinSubscribedChannels()
        if (this.props.params.channelId)
            this._joinChannel(this.props.params.channelId)
    },

    componentWillReceiveProps(nextProps) {
        if(nextProps.params.channelId != this.props.params.channelId) {
            $(ReactDOM.findDOMNode(this.refs.sidebar)).sidebar('hide')
            if(!ChannelStore.has_joinedChannel(nextProps.params.channelId)) {
                this._joinChannel(nextProps.params.channelId)
            }
        }
    },

    _joinSubscribedChannels() {
        // Get channel list and join them
        let channels = this.state.user.channels
        if (channels.length > 0) {
            ChannelService.grant(this.state.authKey, channels)
            .then(() => {
                ChannelService.join_channels(channels)
                //this.history.pushState(null, `/channels/${channels[0].id}/`)
            })
        }
    },

    _joinChannel(id) {
        let channelObj = _.findWhere(this.state.channels, {id: id})
        if(channelObj == undefined) {
            // if this we don't have the details for this id, get it from server
            ChannelService.get_channel_info(id)
                .then((res) => {
                    // res.body is a channel object
                    let channel = res.body
                    ChannelService.grant(this.state.authKey, [channel])
                    .then(() => {
                        ChannelService.join_channels([channel])
                    })
                }, (err) => {
                    console.log('Something went wrong');
                })
        } else {
            ChannelService.grant(this.state.authKey, [channelObj])
                .then(() => {
                    ChannelService.join_channels([channelObj])
                }, (err) => {
                    console.log('Something went wrong');
                })
        }
    },

    _onUserChange() {
        this.setState({
            user: UserStore.user,
            authKey: UserStore.authKey,
            is_authenticated: UserStore.is_authenticated
        })
        if(UserStore.is_authenticated)
            this._joinSubscribedChannels()
    },

    _onChange() {
        this.setState({
            joinedChannels: ChannelStore.joinedChannels,
            channels: ChannelStore.channels
        })
    },

    render() {
        return (
            <div id="main">
                <div className="ui sidebar vertical left inline grid menu profile-menu" ref="sidebar">
                    <div className="logo">
                        <img src={LOGO_URL} />
                    </div>
                    <div className="ui list top-list">
                        <h5 className="ui header">Top Stocks</h5>
                        {_.map(_.slice(this.state.channels, 0, 5), (channel) => {
                            return (<ChannelNav key={channel.id} channel={channel} />)
                        })}
                    </div>
                     <div className="item search-link">
                        <Link to="/search/" style={{marginLeft: '-3px'}}><i className="search icon" />More Stocks</Link>
                    </div>
                    <ChannelList joinedChannels={this.state.joinedChannels} />
                    <Avatar is_authenticated={this.state.is_authenticated} avatar={this.state.user.profile.avatar} username={this.state.user.username} />
                </div>
                <div className="full height pusher">
                    <div id="profile-container">
                        <div id="profile-menu" className="ui vertical menu grid profile-menu">
                            <div className="logo">
                                <img src={LOGO_URL} />
                            </div>

                            <div className="ui list top-list">
                                <h5 className="ui header">Top Stocks</h5>
                                {_.map(_.slice(this.state.channels, 0, 5), (channel) => {
                                    return (<ChannelNav key={channel.id} channel={channel} />)
                                })}
                                <div className="item search-link">
                                    <Link to="/search/" style={{marginLeft: '-3px'}}><i className="search icon" />More Stocks</Link>
                                </div>
                            </div>
                            <ChannelList joinedChannels={this.state.joinedChannels} />
                        </div>
                        <Avatar is_authenticated={this.state.is_authenticated} avatar={this.state.user.profile.avatar}  username={this.state.user.username} />
                    </div>
                    <div id="messages-container">
                        <ChannelHeader channel_id={this.props.params.channelId} />
                        {_.map(this.state.joinedChannels, (channel) => {
                        return (<ChannelItem key={channel.id}
                            channel_id={channel.id}
                            name={channel.name}
                            messages={channel.messages}
                            is_authenticated={this.state.is_authenticated}
                            preview_mode={!UserStore.has_channel(channel.id)}
                            jwt={this.state.jwt}
                            user={this.state.user}
                            is_active={this.props.params.channelId == channel.id} />);
                        })}
                    </div>
                </div>
            </div>
        );
    }
});