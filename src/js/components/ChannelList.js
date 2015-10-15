import _ from 'lodash';
import React from 'react';
import ChannelStore from '../stores/ChannelStore';
import ChannelNav from './ChannelNav';

export default React.createClass({

    componentDidMount() {
        ChannelStore.addChangeListener(this._onChange);
    },

    componentWillUnmount() {
        ChannelStore.removeChangeListener(this._onChange);
    },

    _onChange() {
        this.setState({
            channels: ChannelStore.channels
        });
    },

    getInitialState() {
        return {
            channels: ChannelStore.channels
        }
    },

    render() {
        return (
                <div className="ui list">
                    <h5 className="ui header">Your Stocks</h5>
                    {_.map(this.state.channels, (channel) => {
                        return (<ChannelNav key={channel.id}
                            id={channel.id}
                            unread={channel.unread}
                            name={channel.name} />)
                    })}
                </div>
            )

    }

});