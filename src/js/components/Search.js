import _ from 'lodash'
import React from 'react'
import { Link } from 'react-router'
import SemanticInput from './SemanticInput'
import ChannelService from '../services/ChannelService'
import ChannelStore from '../stores/ChannelStore'
import UserStore from '../stores/UserStore'


export default React.createClass({
    mixins: [],

    limit: 10,
    offset: 0,

    getInitialState() {
        return {
            channels: ChannelStore.top_channels,
            next: null,
            previous: null,
            stored_channels: ChannelStore.channels,
            is_authenticated: UserStore.is_authenticated,
            user: UserStore.user,
            authKey: UserStore.authKey,
            jwt: UserStore.jwt,
            changed: false
        }
    },

    componentWillMount() {

    },

    componentDidMount() {
        ChannelStore.addChangeListener(this._onChange)
        UserStore.addChangeListener(this._onUserChange)
    },

    componentWillUnmount() {
        ChannelStore.removeChangeListener(this._onChange)
        UserStore.removeChangeListener(this._onUserChange)
    },

    componentWillUpdate(nextProps, nextState) {
        if (nextState.stored_channels != this.state.stored_channels)
            this.forceUpdate()
    },

    _getChannels(offset, limit, kw, asc) {
        ChannelService.get_channels(offset, limit, kw, asc)
            .then((res)=> {
                this.setState({
                    channels: res.body.results,
                    next: res.body.next,
                    previous: res.body.previous
                })
            })
            .catch((err) => {
                alert('Search: Something went wrong')
            })
    },

    getSearchResults(kw) {
        this._getChannels(this.limit, this.offset, kw)
    },

    handleJoin(channel) {
        if(this.state.is_authenticated) {
             ChannelService.subscribe_to_channel(this.state.jwt, channel.id, this.state.user.user_id)
            .then(ChannelService.grant(this.state.authKey, [channel]))
            .then(() => {
                    channel.subscribers_count += 1
                    ChannelService.join_channels([channel])
            })
            .catch((err) => {
                alert('Please try again!')
            })
        } else {
            ChannelService.grant(this.state.authKey, [channel])
                .then(() => {
                        channel.subscribers_count += 1
                        ChannelService.join_channels([channel])
                })
                .catch((err) => {
                    alert('Please try again!')
                })
        }
    },

    handleChange(e) {
        this.setState({
            changed: true
        })

        if(e.currentTarget.value) {
            this.getSearchResults(e.currentTarget.value)
        } else {
            this.setState({
                channels: ChannelStore.top_channels
            })
        }
    },

    _onUserChange() {
        this.setState({
           user: UserStore.user,
           jwt: UserStore.jwt
        })
    },

    _onChange() {
        if(!this.state.changed) {
            this.setState({
                channels: ChannelStore.top_channels
            })
        }
        this.setState({
            stored_channel: ChannelStore.channels
        })
    },

    render() {
        return (
            <div className="ui segment">
                <Link to="/channels/">Go to Chat</Link>
                <h2>Search something</h2>
                <div className="ui form">
                    <SemanticInput required={true} icon={true} name="search" placeholder="Enter Stock symbol e.g. APPL"
                        type="text" onChange={this.handleChange} validation={false}>
                        <i className="search icon" />
                    </SemanticInput>
                </div>
                <ul>
                {_.map(this.state.channels, (channel) => {
                    return (
                        <li key={channel.id}>
                            {channel.name} - {channel.subscribers_count}
                            {ChannelStore.get_channel(channel.id) ?
                                <button className="ui disabled button">Joined</button>
                                :
                                <button className="ui basic teal button" onClick={this.handleJoin.bind(this, channel)}>Join</button>
                            }
                        </li>
                    )
                })}
                </ul>
            </div>
        )
    }
})