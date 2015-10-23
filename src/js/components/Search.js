import _ from 'lodash'
import React from 'react'
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
            channels: [],
            limit: 10,
            offset: 0,
            next: null,
            previous: null,
            stored_channels: ChannelStore.channels,
            user: UserStore.user,
            jwt: UserStore.jwt
        }
    },

    componentWillMount() {
        // Get top 10 channels
        ChannelService.get_channels(this.limit, this.offset)
            .then((res)=> {
                this.setState({
                    channels: res.body.results,
                    next: res.body.next,
                    previous: res.body.previous
                })
            })
            .catch((err) => {
                alert('Something went wrong')
            })
    },

    componentDidMount() {
        ChannelStore.addChangeListener(this._onChange)
        UserStore.addChangeListener(this._onUserChange)
    },

    componentWillUnMount() {
        ChannelStore.removeChangeListener(this._onChange)
        UserStore.removeChangeListener(this._onUserChange)
    },

    componentWillUpdate(nextProps, nextState) {
        if (nextState.stored_channels != this.state.stored_channels)
            this.forceUpdate()
    },

    _getChannels(limit, offset, kw, asc) {
        ChannelService.get_channels(limit, offset, kw, asc)
            .then((res)=> {
                this.setState({
                    channels: res.body.results,
                    next: res.body.next,
                    previous: res.body.previous
                })
            })
            .catch((err) => {
                alert('Something went wrong')
            })
    },

    getTopChannels() {
        // Get top 10 channels
        this._getChannels(this.limit, this.offset)
    },

    getSearchResults(kw) {
        this._getChannels(this.limit, this.offset, kw)
    },

    handleJoin(channel) {
        ChannelService.subscribe_to_channel(this.state.jwt, channel.id, this.state.user.user_id)
            .then((res) => {
                channel.subscribers_count += 1
                ChannelService.join_channels([channel])
            })
            .catch((err) => {
                alert('Please try again!')
            })
    },

    handleChange(e) {
        if(e.currentTarget.value) {
            this.getSearchResults(e.currentTarget.value)
        } else {
            this.getTopChannels()
        }
    },

    _onUserChange() {
        this.setState({
           user: UserStore.user,
           jwt: UserStore.jwt
        })
    },

    _onChange() {
        this.setState({
            stored_channel: ChannelStore.channels
        })
    },

    render() {
        return (
            <div className="ui segment">
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