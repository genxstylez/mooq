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
            channels: ChannelStore.channels,
            active_channel: ChannelStore.active_channel,
            user: UserStore.user,
            authKey: UserStore.authKey,
            jwt: UserStore.jwt,
            is_authenticated: UserStore.is_authenticated,
            top_5_channels: _.slice(ChannelStore.top_channels, 0, 5)
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
        if (!this.state.is_authenticated) {
            if (this.props.params.channelId) {
                this.handleGuestSession(this.props.params.channelId)
            } else {
                if(this.state.channels.length == 0) {
                    // Happens to guest session who doesn't provide on channelId
                    this.history.pushState(null, '/search/')
                } else {
                    ChannelActions.mark_as_active(this.state.channels[0].id)
                }
            }
        }
    },

    componentWillReceiveProps(nextProps) {
        if(nextProps.params.channelId != this.props.params.channelId) {
            setTimeout(() => {
                ChannelActions.mark_as_active(nextProps.params.channelId)
            }, 1)
            $(ReactDOM.findDOMNode(this.refs.sidebar)).sidebar('hide')
        }
    },

    componentDidUpdate(nextProps, nextState) {
        if(nextState.channels.length != this.state.channels.length ||
            nextState.authKey != this.state.authKey) {
            // if auth key changed, ask for permissions
            // if channel changed handle it.
            ChannelService.grant(nextState.authKey, nextState.channels).done()

            if(nextState.channels.length != this.state.channels.length) {
                this.handleChannelChanged()
            }
        }
    },

    handleChannelChanged() {
        if(this.state.channels.length > 0) {
            if (this.props.params.channelId && ChannelStore.get_channel(this.props.params.channelId)) {
                setTimeout(() => {
                    ChannelActions.mark_as_active(this.props.params.channelId)
                }, 1)
            } else {
                // if no channel Id is provided, go to the first channel of the list
                // or when a leave channel event occurs
                this.history.replaceState(null, '/channels/' + this.state.channels[0].id + '/')
            }
        } else {
            this.history.pushState(null, '/search/')
        }
    },

    handleGuestSession(id) {
        ChannelService.get_channel_info(id)
            .then((res) => {
                // res.body is a channel object
                let channel = res.body
                ChannelService.grant(this.state.authKey, [channel])
                .then(() => {
                    ChannelService.join_channels([channel])
                    ChannelActions.mark_as_active(channel.id)
                })
            }, (err) => {
                alert('Something went wrong');
            })
    },

    _onUserChange() {
        this.setState({
            user: UserStore.user,
            authKey: UserStore.authKey,
            is_authenticated: UserStore.is_authenticated
        })
    },

    _onChange() {
        this.setState({
            active_channel: ChannelStore.active_channel,
            channels: ChannelStore.channels,
            top_5_channels: _.slice(ChannelStore.top_channels, 0, 5)
        })
    },

    render() {
        return (
            <div id="main">
                <div className="ui sidebar vertical left inline grid menu profile-menu" ref="sidebar">
                    <div className="logo">
                        <img src={STATIC_URL + 'img/logo.png'} />
                    </div>
                    <div className="ui list top-list">
                        <h5 className="ui header">Top Stocks</h5>
                        {_.map(this.state.top_5_channels, (channel) => {
                            return (<ChannelNav key={channel.id} channel={channel} />)
                        })}
                    </div>
                     <div className="item search-link">
                        <Link to="/search/" style={{marginLeft: '-3px'}}><i className="search icon" />More Stocks</Link>
                    </div>
                    <ChannelList />
                    <Avatar is_authenticated={this.state.is_authenticated} username={this.state.user.username} />
                </div>
                <div className="full height pusher">
                    <div id="profile-container">
                        <div id="profile-menu" className="ui vertical menu grid profile-menu">
                            <div className="logo">
                                <img src={STATIC_URL + 'img/logo.png'} />
                            </div>

                            <div className="ui list top-list">
                                <h5 className="ui header">Top Stocks</h5>
                                {_.map(this.state.top_5_channels, (channel) => {
                                    return (<ChannelNav key={channel.id} channel={channel} />)
                                })}
                                <div className="item search-link">
                                    <Link to="/search/" style={{marginLeft: '-3px'}}><i className="search icon" />More Stocks</Link>
                                </div>
                            </div>
                            <ChannelList />
                        </div>
                        <Avatar is_authenticated={this.state.is_authenticated} username={this.state.user.username} />
                    </div>
                    <div id="messages-container">
                        <ChannelHeader channel={this.state.active_channel} />
                        {_.map(this.state.channels, (channel) => {
                        return (<ChannelItem key={channel.id}
                            channel_id={channel.id}
                            messages={channel.messages}
                            is_active={this.state.active_channel.id == channel.id} />);
                        })}
                    </div>
                </div>
            </div>
        );
    }
});