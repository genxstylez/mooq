import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import ChannelStore from '../stores/ChannelStore';
import ChannelActions from '../actions/ChannelActions';
import MessageItem from './MessageItem';


export default React.createClass({
    getInitialState() {
        return {
            messages: this.props.channel.messages
        }
    },

    componentDidMount() {
        ChannelStore.addChangeListener(this._onChange);
        ChannelActions.mark_as_active(this.props.channel);
    },

    componentWillUnmount() {
        ChannelStore.removeChangeListener(this._onChange);
    },

    componentWillReceiveProps(nextProps) {
        if(nextProps.channel)
            this.setState({
                messages: nextProps.channel.messages
            });
            ChannelActions.mark_as_active(nextProps.channel);
    },

    componentDidUpdate() {
        let node = ReactDOM.findDOMNode(this);
        $(node).animate({ scrollTop: node.scrollHeight }, 'slow');
    },

    _onChange() {
        this.setState({
            messages: ChannelStore.active_channel.messages
        });
    },

    render() {
        return (
            <div id="messages">
                <div className="ui feed">
                    {_.map(this.state.messages, (message) => {
                        return (
                            <MessageItem key={message.timestamp} message={message}  />
                        );
                    })}
                </div>
            </div>
        )
    }
});