import _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import { History } from 'react-router'
import SemanticInput from './SemanticInput'
import ChannelService from '../services/ChannelService'
import ChannelStore from '../stores/ChannelStore'
import UserStore from '../stores/UserStore'


export default React.createClass({
    mixins: [History],

    limit: 50,
    offset: 0,

    getInitialState() {
        return {
            channels: ChannelStore.channels,
            next: null,
            previous: null,
            joinedChannels: ChannelStore.joinedChannels,
            is_authenticated: UserStore.is_authenticated,
            user: UserStore.user,
            authKey: UserStore.authKey,
            jwt: UserStore.jwt,
            changed: false,
            width: 40,
            keyword: ''
        }
    },

    componentDidMount() {
        ChannelStore.addChangeListener(this._onChange)
        UserStore.addChangeListener(this._onUserChange)
        ReactDOM.findDOMNode(this.refs.search).focus()
    },

    componentWillUnmount() {
        ChannelStore.removeChangeListener(this._onChange)
        UserStore.removeChangeListener(this._onUserChange)
    },

    componentWillUpdate(nextProps, nextState) {
        if (nextState.stored_channels != this.state.stored_channels)
            this.forceUpdate()
    },

    componentDidUpdate(prevProps, prevState) {
        if(prevState.keyword != this.state.keyword) {
            if(this.state.keyword.length > 0) {
                this.getSearchResults(this.state.keyword)
            } else {
                this.setState({
                    channels: ChannelStore.channels,
                })
            }
            let width = ReactDOM.findDOMNode(this.refs.hidden_span).offsetWidth
            this.setState({
                width: this.state.keyword.length ? width : 30
            })
        }
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
        this._getChannels(this.offset, this.limit, kw)
    },

    handleJoin(channel) {
        /*
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
        */
    },

    handleClickChannel(channel) {
        this.history.pushState(null, `/channels/${channel.id}/`)
    },

    handleClickButton() {
        this.history.pushState(null, '/channels/')
    },

    handleChange(e) {
        this.setState({
            changed: true,
            keyword: e.currentTarget.value
        })
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
                channels: ChannelStore.channels
            })
        }
        this.setState({
            joinedChannels: ChannelStore.joinedChannels
        })
    },

    render() {
        return (
            <div className="ui container search-container">
                <div className="ui center aligned grid search-grid" >
                    <div className="ui center aligned grid header">
                        <h5>Enter Stock symbol e.g. AAPL</h5>
                    </div>
                    <div className="ui center aligned grid input-symbol">
                        <i className="search icon" />
                        <input className="borderless" ref="search" name="search" style={{width: this.state.width + 'px'}} value={this.state.keyword} onChange={this.handleChange}/>
                        <span className="hidden" ref="hidden_span">{this.state.keyword}</span>
                    </div>
                </div>
                <div className="ui center aligned grid">
                {this.state.channels.length > 0 ?
                    _.map(this.state.channels, (channel) => {
                        return (
                            <div className="three wide computer five wide tablet twelve wide mobile column" key={channel.id} onClick={this.handleClickChannel.bind(this, channel)}>
                                <div className="ui segment">
                                    {channel.name} - {channel.subscribers_count}
                                </div>
                            </div>
                        )
                    })
                    : <div className="no-results">No results found for {this.state.keyword}</div>
                }
                </div>
            </div>
        )
    }
})