import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import ChannelStore from '../stores/ChannelStore';
import ChannelActions from '../actions/ChannelActions';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import classnames from 'classnames';
import SetIntervalMixin from '../mixins/SetIntervalMixin';

import request from 'superagent';


export default React.createClass({
    mixins: [SetIntervalMixin],

    getInitialState() {
        return {
            messages: this.props.messages,
            occupancy: this.props.occupancy || 0,
            users: this.props.users || [],
            price: 0
        }
    },

    componentDidMount() {
        ChannelStore.addChangeListener(this._onChange);
        /* HACK for render callback
        var node = ReactDOM.findDOMNode(this);
        setTimeout(() => {
            node.scrollTop = node.scrollHeight;
        }, 1000);
        */
        //this.setInterval(this._getStock, 5000, true);
    },

    componentWillUnmount() {
        ChannelStore.removeChangeListener(this._onChange);
    },

    componentDidUpdate() {
        var node = ReactDOM.findDOMNode(this.refs.messages);
        $(node).animate({ scrollTop: node.scrollHeight }, 'slow');
    },

    _onChange() {
        this.setState({
            messages: ChannelStore.get_channel(this.props.id).messages,
            occupancy: ChannelStore.get_channel(this.props.id).occupancy,
            users: ChannelStore.get_channel(this.props.id).users
        });
    },

    handleHeightChange(height) {
        let node = ReactDOM.findDOMNode(this.refs.messages) ;
        height = height + 20 // 20 is the padding for footer
        node.style.bottom = height.toString() + 'px';
        node.scrollTop = node.scrollHeight;

    },

    handleHereNow() {
        let dimmer = ReactDOM.findDOMNode(this.refs.dimmer);
        $(dimmer).dimmer('show');
    },

    render() {
        var cls = classnames({
            active: this.props.is_active,
            channel: true
        })
        return (
            <div className={cls}>
                <div className="messages" ref="messages">
                    <div className="ui feed">
                        {_.map(this.state.messages, (message) => {
                            return (
                                <MessageItem key={message.timestamp} message={message}  />
                            );
                        })}
                    </div>
                </div>
                 <div className="footer">
                    <MessageInput id={this.props.id} onHeightChange={this.handleHeightChange} />
                </div>
            </div>

        )
    }
});