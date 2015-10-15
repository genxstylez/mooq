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
            messages: this.props.channel.messages
        }
    },

    componentDidMount() {
        ChannelStore.addChangeListener(this._onChange);
        //ChannelActions.mark_as_active(this.props.channel);
    },

    componentWillUnmount() {
        ChannelStore.removeChangeListener(this._onChange);
    },

    componentWillReceiveProps(nextProps) {
        if(nextProps.channel)
            this.setState({
                messages: nextProps.channel.messages
            });
            //ChannelActions.mark_as_active(nextProps.channel);
    },

    componentDidUpdate() {
        let node = ReactDOM.findDOMNode(this);
        $(node).animate({ scrollTop: node.scrollHeight }, 'slow');
    },

    _onChange() {
        this.setState({
            messages: ChannelStore.get_channel(this.props.channel.id).messages
        });
    },

    render() {
        var cls = classnames({
            active: this.props.is_active,
            channel: true
        })
        return (
            <div className={cls}>
                <div className="messages">
                    <div className="ui feed">
                        {_.map(this.state.messages, (message) => {
                            return (
                                <MessageItem key={message.timestamp} message={message}  />
                            );
                        })}
                    </div>
                </div>


            </div>
        )
    }
});