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
            is_authenticated: UserStore.is_authenticated,
            top_5_channels: [],
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
            if (this.props.params.channelId)
                this.handleGuestSession(this.props.params.channelId)
            else
                this.history.pushState(null, '/search/')
        }
        ChannelService.get_channels(5, 0)
            .then((res) => {
                this.setState({
                    top_5_channels: res.body.results
                })
            })

    },

    componentWillReceiveProps(nextProps) {
        console.log('in recv props')
        if(nextProps.params.channelId != this.props.params.channelId) {
            let id = nextProps.params.channelId
            if (this.state.is_authenticated)
                setTimeout(() => {
                    ChannelActions.mark_as_active(id)
                }, 1)
            else
                this.handleGuestSession(id)
        }
        $(ReactDOM.findDOMNode(this.refs.sidebar)).sidebar('hide')
    },

    componentDidUpdate(nextProps, nextState) {
        if(nextState.channels.length != this.state.channels.length ||
            nextState.authKey != this.state.authKey) {
            ChannelService.grant(nextState.authKey, nextState.channels).done()

            if(nextState.channels.length != this.state.channels.length) {
                this.handleChannelChanged()
            }
        }
    },

    handleChannelChanged() {
        if(this.state.is_authenticated) {
            if(this.state.channels.length > 0) {
                if (!this.props.params.channelId) {
                    // if no channel Id is provided, go to the first channel of the list
                    this.history.replaceState(null, '/channels/' + this.state.channels[0].id + '/')
                } else {
                    setTimeout(() => {
                        ChannelActions.mark_as_active(this.props.params.channelId)
                    }, 1)
                }
            } else {
                this.history.pushState(null, '/search/')
            }
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
            channels: ChannelStore.channels
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
                        <h5 className="ui header">Top 5 Stocks</h5>
                        {_.map(this.state.top_5_channels, (channel) => {
                            return (<ChannelNav key={channel.id} id={channel.id} name={channel.name} />)
                        })}
                    </div>
                    <Link to="/search/">Search</Link>
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
                                <h5 className="ui header">Top 5 Stocks</h5>
                                {_.map(this.state.top_5_channels, (channel) => {
                                    return (<ChannelNav key={channel.id} id={channel.id} name={channel.name} />)
                                })}
                            </div>
                            <Link to="/search/">Search</Link>
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