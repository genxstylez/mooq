import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import ChannelStore from '../stores/ChannelStore';
import ChannelActions from '../actions/ChannelActions';
import MessageItem from './MessageItem';
import classnames from 'classnames';


export default React.createClass({
    getInitialState() {
        return {
            messages: ChannelStore.get_channel(this.props.id).messages
        }
    },

    componentDidMount() {
        ChannelStore.addChangeListener(this._onChange);
        /* HACK for render callback
        var node = ReactDOM.findDOMNode(this);
        setTimeout(() => {
            node.scrollTop = node.scrollHeight;
        }, 800);
        */
    },

    componentWillUnmount() {
        ChannelStore.removeChangeListener(this._onChange);
    },

    componentWillReceiveProps(nextProps) {
        if(nextProps.channel)
            this.setState({
                messages: ChannelStore.get_channel(nextProps.id).messages
            });
    },

    componentDidUpdate() {
        var node = ReactDOM.findDOMNode(this);
        $(node).animate({ scrollTop: node.scrollHeight }, 'slow');
    },

    _onChange() {
        this.setState({
            messages: ChannelStore.get_channel(this.props.id).messages
        });
    },

    render() {
        var cls = classnames({
            active: this.props.is_active,
            messages: true
        })
        return (
            <div className={cls}>
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