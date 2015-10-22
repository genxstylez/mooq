import _ from 'lodash'
import React from 'react'
import SemanticInput from './SemanticInput'
import ChannelService from '../services/ChannelService'


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
            previous: null
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

    componentWillUnMount() {
        return
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

    handleChange(e) {
        if(e.currentTarget.value) {
            this.getSearchResults(e.currentTarget.value)
        } else {
            this.getTopChannels()
        }
    },

    render() {
        return (
            <div>
                <h2>Search something</h2>
                <div>
                    <SemanticInput required={true} icon={true} name="search" placeholder="Enter Stock symbol e.g. APPL"
                        type="text" onChange={this.handleChange} validation={false}>
                        <i className="search icon" />
                    </SemanticInput>
                </div>
                <ul>
                {_.map(this.state.channels, (channel) => {
                    return (<li key={channel.id}>{channel.name} - {channel.subscribers_count}</li>)
                })}
                </ul>
            </div>
        )
    }
})