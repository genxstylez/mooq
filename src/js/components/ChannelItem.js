import _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import ChannelStore from '../stores/ChannelStore'
import ChannelActions from '../actions/ChannelActions'
import ChannelService from '../services/ChannelService'
import MessageItem from './MessageItem'
import MessageInput from './MessageInput'
import classnames from 'classnames'


export default React.createClass({
    getInitialState() {
        return {
            messages: this.props.messages
        }
    },

    componentWillMount() {
        if(this.props.messages.length == 0) {
            ChannelService.get_history(this.props.channel_id)
        }
    },

    componentDidMount() {
        /* HACK for render callback
        var node = ReactDOM.findDOMNode(this);
        setTimeout(() => {
            node.scrollTop = node.scrollHeight;
        }, 1000);
        */
    },

    componentDidUpdate(prevProps, prevState) {
       if (prevState.messages.length != this.state.messages.length) {
            var node = ReactDOM.findDOMNode(this.refs.messages)
            $(node).animate({ scrollTop: node.scrollHeight }, 'slow')
        }
    },

    componentWillReceiveProps(nextProps) {
        let messages = _.clone(nextProps.messages) // do a shallow copy of the instance to prevent data "too-synced"
        this.setState({
            messages: messages
        })
    },

    handleHeightChange(height) {
        let node = ReactDOM.findDOMNode(this.refs.messages) ;
        height = height + 20 // 20 is the padding for footer
        node.style.bottom = height.toString() + 'px';
        node.scrollTop = node.scrollHeight;
    },

    render() {
        var cls = classnames({
            active: this.props.is_active,
            channel: true
        })
        return (
            <div className={cls}>
                <div className="messages" ref="messages">
                    <div className="ui comments">
                        {_.map(this.state.messages, (message) => {
                            return (
                                <MessageItem key={message.timestamp} message={message}  />
                            );
                        })}
                    </div>
                </div>
                 <div className="footer">
                    <MessageInput channel_id={this.props.channel_id} onHeightChange={this.handleHeightChange} />
                </div>
            </div>

        )
    }
});