import _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import { Link, History } from 'react-router'
import ChannelStore from '../stores/ChannelStore'
import ChannelActions from '../actions/ChannelActions'
import ChannelService from '../services/ChannelService'
import UserService from '../services/UserService'
import UserActions from '../actions/UserActions'
import MessageItem from './MessageItem'
import MessageInput from './MessageInput'
import classnames from 'classnames'


export default React.createClass({
    mixins: [History],

    getInitialState() {
        return {
            messages: this.props.messages,
            preview_mode: this.props.preview_mode,
            is_authenticated: this.props.is_authenticated,
            jwt: this.props.jwt,
            user: this.props.user
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
            messages: messages,
            preview_mode: nextProps.preview_mode,
            is_authenticated: nextProps.is_authenticated

        })
    },

    handleHeightChange(height) {
        let node = ReactDOM.findDOMNode(this.refs.messages) ;
        height = height + 20 // 20 is the padding for footer
        node.style.bottom = height.toString() + 'px';
        node.scrollTop = node.scrollHeight;
    },

    handleJoin() {
        UserService.subscribe_to_channel(this.state.jwt, this.props.channel_id, this.state.user.user_id)
            .then((res) => {
                UserActions.add_channel(res.body.channel)
            })
            .catch((err) => {
                console.log(err)
            })
    },

    handleLogin() {
        this.history.pushState(null, '/login/')
    },

    render() {
        var cls = classnames({
            active: this.props.is_active,
            channel: true
        })
        let InputNode = <MessageInput channel_id={this.props.channel_id} onHeightChange={this.handleHeightChange} />
        if(this.state.preview_mode) {
            if(this.state.is_authenticated)
                InputNode = <div className="preview">
                        <span>You are viewing a preview of {this.props.name}</span>
                        <button className="ui button tiny navy button" onClick={this.handleJoin}>Join this channel</button>
                    </div>
            else
                InputNode = <div className="preview">
                        <span>You are viewing a preview of {this.props.name}</span>
                        <button className="ui button tiny navy button" onClick={this.handleLogin}>Please Login</button>
                    </div>
        }
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
                    {InputNode}
                </div>
            </div>

        )
    }
});