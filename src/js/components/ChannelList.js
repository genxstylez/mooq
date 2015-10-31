import _ from 'lodash';
import React from 'react';
import ChannelStore from '../stores/ChannelStore';
import ChannelNav from './ChannelNav';

export default React.createClass({

    getInitialState() {
        return {
            joinedChannels: this.props.joinedChannels
        }
    },

    componentWillReceiveProps(nextProps) {
        this.setState({
            joinedChannels: nextProps.joinedChannels
        })
    },

    render() {
        return (
                <div className="ui list">
                    <h5 className="ui header">Your Stocks</h5>
                    {_.map(this.state.joinedChannels, (channel) => {
                        return (<ChannelNav key={channel.id} channel={channel} />)
                    })}
                </div>
            )

    }

});